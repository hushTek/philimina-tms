import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const transactions = await ctx.db.query("transactions").order("desc").collect();
    
    // Enrich with loan and contact details
    const enrichedTransactions = await Promise.all(
      transactions.map(async (t) => {
        const loan = await ctx.db.get(t.loanId);
        let contactName = "Unknown";
        
        if (loan) {
          const customer = await ctx.db.get(loan.customerId);
          if (customer) {
            const contact = await ctx.db.get(customer.contactId);
            if (contact) contactName = contact.name;
          }
        }

        return {
          ...t,
          clientName: contactName,
          loanId: t.loanId,
        };
      })
    );

    return enrichedTransactions;
  },
});

export const listPaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
    type: v.optional(v.union(v.literal("disbursement"), v.literal("repayment"), v.literal("penalty"))),
    method: v.optional(v.union(v.literal("cash"), v.literal("mobile_money"), v.literal("bank"))),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { paginationOpts, type, method, search } = args;
    const result = await ctx.db
      .query("transactions")
      .order("desc")
      .paginate({
        cursor: paginationOpts.cursor ?? null,
        numItems: paginationOpts.numItems,
      });

    let page = result.page;
    if (type) page = page.filter((t) => t.type === type);
    if (method) page = page.filter((t) => t.method === method);

    const enriched = await Promise.all(
      page.map(async (t) => {
        const loan = await ctx.db.get(t.loanId);
        let contactName = "Unknown";
        if (loan) {
            const customer = await ctx.db.get(loan.customerId);
            if (customer) {
                const contact = await ctx.db.get(customer.contactId);
                contactName = contact?.name ?? "Unknown";
            }
        }
        return { ...t, clientName: contactName };
      })
    );

    const filtered = search
      ? enriched.filter((t) =>
          `${t.clientName}`.toLowerCase().includes(search.toLowerCase())
        )
      : enriched;

    return {
      page: filtered,
      isDone: result.isDone,
      continueCursor: result.continueCursor,
    };
  },
});

export const listRepayments = query({
  args: {},
  handler: async (ctx) => {
    // Filter for repayments in code or use an index if added later. 
    // For now, fetching all and filtering in memory is fine for small datasets, 
    // but ideally we'd add an index on 'type' or just filter.
    // Since 'type' is not indexed alone (it is in schema but not indexed), we do full scan.
    const transactions = await ctx.db
      .query("transactions")
      .order("desc")
      .collect();
      
    const repayments = transactions.filter(t => t.type === "repayment");

    // Enrich with loan and client details
    const enrichedRepayments = await Promise.all(
      repayments.map(async (t) => {
        const loan = await ctx.db.get(t.loanId);
        let clientName = "Unknown";
        
        if (loan) {
          const customer = await ctx.db.get(loan.customerId);
          if (customer) {
            const contact = await ctx.db.get(customer.contactId);
            if (contact) clientName = contact.name;
          }
        }

        return {
          ...t,
          clientName,
        };
      })
    );

    return enrichedRepayments;
  },
});

export const listRepaymentsPaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
    method: v.optional(v.union(v.literal("cash"), v.literal("mobile_money"), v.literal("bank"))),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { paginationOpts, method, search } = args;
    const result = await ctx.db
      .query("transactions")
      .order("desc")
      .paginate({
        cursor: paginationOpts.cursor ?? null,
        numItems: paginationOpts.numItems,
      });
    let page = result.page.filter((t) => t.type === "repayment");
    if (method) page = page.filter((t) => t.method === method);

    const enriched = await Promise.all(
      page.map(async (t) => {
        const loan = await ctx.db.get(t.loanId);
        let clientName = "Unknown";
        if (loan) {
            const customer = await ctx.db.get(loan.customerId);
            if (customer) {
                const contact = await ctx.db.get(customer.contactId);
                clientName = contact?.name ?? "Unknown";
            }
        }
        return { ...t, clientName };
      })
    );

    const filtered = search
      ? enriched.filter((t) =>
          `${t.clientName}`.toLowerCase().includes(search.toLowerCase())
        )
      : enriched;

    return {
      page: filtered,
      isDone: result.isDone,
      continueCursor: result.continueCursor,
    };
  },
});

export const create = mutation({
  args: {
    loanId: v.id("loans"),
    amount: v.number(),
    type: v.union(
      v.literal("disbursement"),
      v.literal("repayment"),
      v.literal("penalty")
    ),
    method: v.union(
      v.literal("cash"),
      v.literal("mobile_money"),
      v.literal("bank")
    ),
    reference: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Create transaction
    const transactionId = await ctx.db.insert("transactions", {
      ...args,
      createdAt: now,
      confirmed: true, // Auto-confirm for manual entry by admin
    });

    // Handle Disbursement: Update Loan Status to Active
    if (args.type === "disbursement") {
        const loan = await ctx.db.get(args.loanId);
        if (loan && loan.status === "new") {
            await ctx.db.patch(args.loanId, {
                status: "active",
                // Set start date to now if not set? It's already set in creation but maybe update it?
                // Keeping original start date is fine.
            });
        }
    }

    // Update loan balance if repayment
    if (args.type === "repayment") {
        const loan = await ctx.db.get(args.loanId);
        if (loan) {
            const newBalance = loan.outstandingBalance - args.amount;
            await ctx.db.patch(args.loanId, {
                outstandingBalance: newBalance > 0 ? newBalance : 0,
                status: newBalance <= 0 ? "completed" : loan.status
            });
        }
    }

    // Update Bank Balance (Main Balance) immediately since it's confirmed
    if (args.method === "bank") {
        const delta = args.type === "disbursement" ? -args.amount : args.amount;
        const rows = await ctx.db.query("bank").order("desc").collect();
        const row = rows[0];
        if (!row) {
            await ctx.db.insert("bank", { balance: delta, updatedAt: now });
        } else {
            await ctx.db.patch(row._id, { balance: row.balance + delta, updatedAt: now });
        }
    }

    // Log to Loan Activities
    await ctx.db.insert("loanActivities", {
        loanId: args.loanId,
        type: args.type === "repayment" ? "success" : args.type === "penalty" ? "warning" : "info",
        title: args.type.charAt(0).toUpperCase() + args.type.slice(1),
        description: `${args.type === 'repayment' ? 'Received' : 'Applied'} ${args.amount} via ${args.method}. Reference: ${args.reference ?? 'N/A'}`,
        performedBy: "system", // Or user if we had context
        createdAt: now,
    });

    return transactionId;
  },
});

export const listUnconfirmedBank = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("transactions").order("desc").collect();
    const page = rows.filter((t) => t.method === "bank" && !t.confirmed);
    const enriched = await Promise.all(
      page.map(async (t) => {
        const loan = await ctx.db.get(t.loanId);
        let clientName = "Unknown";
        if (loan) {
            const customer = await ctx.db.get(loan.customerId);
            if (customer) {
                const contact = await ctx.db.get(customer.contactId);
                clientName = contact?.name ?? "Unknown";
            }
        }
        return { ...t, clientName };
      })
    );
    return enriched;
  },
});

export const confirm = mutation({
  args: { id: v.id("transactions") },
  handler: async (ctx, args) => {
    const tx = await ctx.db.get(args.id);
    if (!tx) return false;
    if (tx.confirmed) return true;
    await ctx.db.patch(args.id, { confirmed: true });
    if (tx.method === "bank") {
      const delta =
        tx.type === "disbursement" ? -tx.amount : tx.amount;
      const rows = await ctx.db.query("bank").order("desc").collect();
      const now = Date.now();
      const row = rows[0];
      if (!row) {
        await ctx.db.insert("bank", { balance: delta, updatedAt: now });
      } else {
        await ctx.db.patch(row._id, { balance: row.balance + delta, updatedAt: now });
      }
    }
    return true;
  },
});
