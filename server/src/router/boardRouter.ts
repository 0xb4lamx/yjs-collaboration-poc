import { eq } from "drizzle-orm";
import { boardTable, usersToBoardsTable } from "../lib/schema";
import { router, authedProcedure } from "../trpcServer";
import { z } from "zod";
import { nanoid } from "nanoid";

export const boardRouter = router({
  init: authedProcedure.mutation(async ({ ctx }) => {
    const result = await ctx.db
      .insert(boardTable)
      .values({
        id: nanoid(),
        name: "New Board",
        createdAt: new Date(),
      })
      .returning()
      .execute();

    await ctx.db
      .insert(usersToBoardsTable)
      .values({
        boardId: result[0].id,
        userId: ctx.user.id,
      })
      .execute();

    return result[0];
  }),

  listByUser: authedProcedure
    .input(
      z.object({
        limit: z.number().default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      const boards = await ctx.db
        .select({
          id: boardTable.id,
          name: boardTable.name,
          createdAt: boardTable.createdAt,
        })
        .from(boardTable)
        .leftJoin(
          usersToBoardsTable,
          eq(boardTable.id, usersToBoardsTable.boardId)
        )
        .where(eq(usersToBoardsTable.userId, ctx.user.id))
        .limit(input.limit)
        .execute();

      return boards;
    }),
});
