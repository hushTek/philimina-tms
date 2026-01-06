import { v } from "convex/values";
import { query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const listPaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
    status: v.optional(v.union(v.literal("active"), v.literal("completed"), v.literal("defaulted"))),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { paginationOpts, status, search } = args;
    const result = await ctx.db
      .query("loans")
      .order("desc")
      .paginate({
        cursor: paginationOpts.cursor ?? null,
        numItems: paginationOpts.numItems,
      });

    let page = result.page;
    if (status) {
      page = page.filter((l) => l.status === status);
    }

    if (search) {
      const lower = search.toLowerCase();
      const enriched = await Promise.all(
        page.map(async (l) => {
          const client = await ctx.db.get(l.clientId);
          return { ...l, clientName: client?.name ?? "" };
        })
      );
      page = enriched.filter(
        (l) =>
          `${l.clientName}`.toLowerCase().includes(lower) ||
          String(l.principalAmount).includes(search)
      ) as typeof page;
    }

    return {
      page,
      isDone: result.isDone,
      continueCursor: result.continueCursor,
    };
  },
});
