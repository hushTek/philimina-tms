import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

export const listPaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("submitted"),
        v.literal("awaiting_referee"),
        v.literal("under_review"),
        v.literal("approved"),
        v.literal("rejected")
      )
    ),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { paginationOpts, status, search } = args;
    const base = ctx.db.query("loanApplications").order("desc");
    const result = await base.paginate({
      cursor: paginationOpts.cursor ?? null,
      numItems: paginationOpts.numItems,
    });

    let page = result.page;
    if (status) {
      page = page.filter((a) => a.status === status);
    }
    if (search) {
      const lower = search.toLowerCase();
      // enrich client names to support search
      const enriched = await Promise.all(
        page.map(async (a) => {
          const client = await ctx.db.get(a.clientId);
          return { ...a, clientName: client?.name ?? "" };
        })
      );
      page = enriched.filter(
        (a) =>
          `${a.clientName}`.toLowerCase().includes(lower) ||
          `${a.loanPurpose}`.toLowerCase().includes(lower)
      );
    }

    return {
      page,
      isDone: result.isDone,
      continueCursor: result.continueCursor,
    };
  },
});

export const submit = mutation({
  args: {
    client: v.object({
      name: v.string(),
      dateOfBirth: v.string(),
      phoneNumber: v.string(),
      email: v.string(),
      maritalStatus: v.string(),
      spouseName: v.optional(v.string()),
      residence: v.object({
        street: v.optional(v.string()),
        houseNumber: v.optional(v.string()),
        ward: v.optional(v.string()),
        district: v.optional(v.string()),
        region: v.optional(v.string()),
        ownership: v.optional(v.string()),
      }),
      employment: v.object({
        status: v.string(),
        companyName: v.optional(v.string()),
        address: v.optional(v.string()),
        position: v.optional(v.string()),
      }),
      nidaNumber: v.optional(v.string()),
    }),
    loanDetails: v.object({
      loanTypeId: v.id("loanTypes"),
      amount: v.string(),
      existingLoan: v.optional(v.string()),
      purpose: v.string(),
    }),
    guarantors: v.array(
      v.object({
        fullName: v.string(),
        phoneNumber: v.string(),
        email: v.optional(v.string()),
        relationship: v.optional(v.string()),
        residence: v.optional(v.string()),
        nidaNumber: v.optional(v.string()),
      })
    ),
    attachments: v.array(
      v.object({
        type: v.union(
          v.literal("nida"),
          v.literal("local_letter"),
          v.literal("collateral"),
          v.literal("photo"),
          v.literal("signature")
        ),
        storageId: v.string(),
        fileName: v.string(),
      })
    ),
    declarationAccepted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const statusMap: Record<string, "employment" | "business" | "unemployed" | "other"> = {
      employed: "employment",
      "self employed": "business",
      selfEmployed: "business",
      unemployed: "unemployed",
    };
    const workStatus =
      statusMap[args.client.employment.status] ?? "other";

    let clientId: Id<"clients">;
    const existingClients = await ctx.db.query("clients").collect();
    const existing = existingClients.find(
      (c) =>
        (c.email && c.email.toLowerCase().trim() === args.client.email.toLowerCase().trim()) ||
        (c.identity?.serial && args.client.nidaNumber && c.identity.serial.trim() === args.client.nidaNumber.trim())
    );
    if (existing) {
      clientId = existing._id as Id<"clients">;
      // Update existing client details
      await ctx.db.patch(clientId, {
        name: args.client.name,
        dateOfBirth: args.client.dateOfBirth,
        phone: args.client.phoneNumber,
        marital: {
          status: args.client.maritalStatus,
          name: args.client.spouseName,
        },
        identity: {
          type: "NIDA",
          serial: args.client.nidaNumber,
        },
        work: {
          company: args.client.employment.companyName,
          address: args.client.employment.address,
          designation: args.client.employment.position,
          status: workStatus,
        },
        address: {
          street: args.client.residence.street,
          ward: args.client.residence.ward,
          district: args.client.residence.district,
          region: args.client.residence.region,
          residenceOwnership: args.client.residence.ownership,
          ownership: args.client.residence.ownership,
          houseNumber: args.client.residence.houseNumber,
        },
      });
    } else {
      clientId = await ctx.db.insert("clients", {
        name: args.client.name,
        dateOfBirth: args.client.dateOfBirth,
        phone: args.client.phoneNumber,
        email: args.client.email,
        marital: {
          status: args.client.maritalStatus,
          name: args.client.spouseName,
        },
        identity: {
          type: "NIDA",
          serial: args.client.nidaNumber,
        },
        work: {
          company: args.client.employment.companyName,
          address: args.client.employment.address,
          designation: args.client.employment.position,
          status: workStatus,
        },
        address: {
          street: args.client.residence.street,
          ward: args.client.residence.ward,
          district: args.client.residence.district,
          region: args.client.residence.region,
          residenceOwnership: args.client.residence.ownership,
          ownership: args.client.residence.ownership,
          houseNumber: args.client.residence.houseNumber,
        },
        createdAt: now,
      });
    }

    function code(): string {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let out = "";
      for (let i = 0; i < 6; i++) {
        out += chars[Math.floor(Math.random() * chars.length)];
      }
      return `TMS-${out}`;
    }
    let applicationNumber = code();
    for (let i = 0; i < 5; i++) {
      const exists = await ctx.db
        .query("loanApplications")
        .collect()
        .then((all) => all.some((a) => a.applicationNumber === applicationNumber));
      if (!exists) break;
      applicationNumber = code();
    }

    const requestedAmount = Number(args.loanDetails.amount) || 0;
    const hasOtherLoans = (args.loanDetails.existingLoan ?? "").toLowerCase() === "yes";

    const applicationId = await ctx.db.insert("loanApplications", {
      clientId,
      loanTypeId: args.loanDetails.loanTypeId,
      applicationNumber,
      requestedAmount,
      loanPurpose: args.loanDetails.purpose,
      hasOtherLoans,
      collateralDescription: "Collateral pledged with listed guarantors.",
      declarationAccepted: args.declarationAccepted,
      status: "submitted",
      submittedAt: now,
      createdAt: now,
    });

    // Process attachments
    for (const att of args.attachments) {
      const url = await ctx.storage.getUrl(att.storageId);
      if (url) {
        await ctx.db.insert("documents", {
          applicationId,
          type: att.type,
          fileUrl: url,
          fileName: att.fileName,
          uploadedAt: now,
        });
      }
    }

    const baseUrl =
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_SITE_URL
        ? process.env.NEXT_PUBLIC_SITE_URL
        : "http://localhost:3000";

    const invitations: { email?: string; phone: string; fullName: string; url: string }[] = [];
    for (const g of args.guarantors) {
      const refereeId = await ctx.db.insert("referees", {
        applicationId,
        fullName: g.fullName,
        phone: g.phoneNumber,
        email: g.email,
        relationship: g.relationship ?? "",
        address: g.residence ?? "",
        nidaNumber: g.nidaNumber ?? "",
        acknowledged: false,
      });
      const token = Math.random().toString(36).slice(2, 10);
      await ctx.db.insert("refereeTokens", {
        refereeId,
        tokenHash: token,
        expiresAt: now + 7 * 24 * 60 * 60 * 1000,
        used: false,
      });
      const url = `${baseUrl}/referee/${token}`;
      await ctx.db.insert("smsLogs", {
        phone: g.phoneNumber,
        message: `Hello ${g.fullName}, please confirm loan application as guarantor: ${url}`,
        status: "sent",
        createdAt: now,
      });
      invitations.push({
        email: g.email,
        phone: g.phoneNumber,
        fullName: g.fullName,
        url,
      });
    }

    return { applicationId, applicationNumber, invitations };
  },
});

export const getByApplicationNumber = query({
  args: { applicationNumber: v.string() },
  handler: async (ctx, args) => {
    const application = await ctx.db
      .query("loanApplications")
      .filter((q) => q.eq(q.field("applicationNumber"), args.applicationNumber))
      .first();

    if (!application) {
      return null;
    }

    const referees = await ctx.db
      .query("referees")
      .filter((q) => q.eq(q.field("applicationId"), application._id))
      .collect();

    const documents = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("applicationId"), application._id))
      .collect();

    const loanType = await ctx.db.get(application.loanTypeId);

    return {
      application,
      referees,
      documents,
      loanType,
    };
  },
});

export const getById = query({
  args: { id: v.id("loanApplications") },
  handler: async (ctx, args) => {
    const application = await ctx.db.get(args.id);
    if (!application) return null;

    const client = await ctx.db.get(application.clientId);
    const loanType = await ctx.db.get(application.loanTypeId);
    const referees = await ctx.db
      .query("referees")
      .filter((q) => q.eq(q.field("applicationId"), application._id))
      .collect();
    const documents = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("applicationId"), application._id))
      .collect();

    return {
      application,
      client,
      loanType,
      referees,
      documents,
    };
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("loanApplications"),
    status: v.union(
      v.literal("draft"),
      v.literal("submitted"),
      v.literal("awaiting_referee"),
      v.literal("under_review"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    reviewNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      reviewNotes: args.reviewNotes,
    });
  },
});

export const updateDetails = mutation({
  args: {
    id: v.id("loanApplications"),
    amount: v.number(),
    loanTypeId: v.id("loanTypes"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      requestedAmount: args.amount,
      loanTypeId: args.loanTypeId,
    });
  },
});

export const listLoanTypes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("loanTypes").filter(q => q.eq(q.field("active"), true)).collect();
  },
});
