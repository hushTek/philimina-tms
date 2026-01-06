import { v } from "convex/values";
import { query } from "./_generated/server";
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
