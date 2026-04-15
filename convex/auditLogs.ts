import { v } from "convex/values";
import { query } from "./_generated/server";
import { requireRole } from "./lib/rbac";

/** Hard cap on results to guard against unbounded reads. */
const MAX_AUDIT_LOG_RESULTS = 500;

export const listForLoan = query({
  args: {
    loanId: v.id("loans"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["admin"]);

    // Verify the loan exists – prevents probing for deleted/non-existent IDs
    // and avoids leaking index data for removed documents.
    const loan = await ctx.db.get(args.loanId);
    if (!loan) {
      throw new Error("Loan not found");
    }

    // entityId is stored as v.string() in the schema; cast the typed Id for
    // a safe, explicit index comparison.
    const entityId: string = args.loanId as string;

    // Clamp the caller-supplied limit to a safe range [1, MAX_AUDIT_LOG_RESULTS].
    const take = Math.min(
      Math.max(args.limit ?? MAX_AUDIT_LOG_RESULTS, 1),
      MAX_AUDIT_LOG_RESULTS,
    );

    return await ctx.db
      .query("auditLogs")
      .withIndex("by_entity", (q) =>
        q.eq("entityTable", "loans").eq("entityId", entityId),
      )
      .order("desc")
      .take(take);
  },
});

