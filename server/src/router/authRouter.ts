import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpcServer";
import { z } from "zod";
import { userTable } from "../lib/schema";
import { eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";
import { lucia } from "../lib/auth";

export const authRouter = router({
  login: publicProcedure
    .input(
      z.object({
        username: z
          .string()
          .min(3)
          .max(31)
          .regex(/^[a-z0-9_-]+$/),
        password: z.string().min(6).max(255),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existingUserQuery = await ctx.db
        .select()
        .from(userTable)
        .where(eq(userTable.id, input.username));

      const existingUser = existingUserQuery[0];

      if (!existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid username or password",
        });
      }

      const validPassword = await new Argon2id().verify(
        existingUser.passwordHash,
        input.password
      );

      if (!validPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid username or password",
        });
      }

      const session = await lucia.createSession(existingUser.id, {});
      ctx.setCookie(lucia.createSessionCookie(session.id).serialize());

      return {
        success: true,
        userId: existingUser.id,
      };
    }),
  register: publicProcedure
    .input(
      z.object({
        username: z
          .string()
          .min(3)
          .max(31)
          .regex(/^[a-z0-9_-]+$/),
        password: z.string().min(6).max(255),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existingUserQuery = await ctx.db
        .select()
        .from(userTable)
        .where(eq(userTable.id, input.username));

      if (existingUserQuery[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username already taken",
        });
      }

      const passwordHash = await new Argon2id().hash(input.password);

      await ctx.db
        .insert(userTable)
        .values({
          id: input.username,
          passwordHash,
        })
        .execute();

      const session = await lucia.createSession(input.username, {});
      ctx.setCookie(lucia.createSessionCookie(session.id).serialize());

      return {
        success: true,
        userId: input.username,
      };
    }),
  check: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      return {
        loggedIn: false,
      };
    }

    return {
      loggedIn: true,
      userId: ctx.user.id,
    };
  }),
  logout: publicProcedure.mutation(async ({ ctx }) => {
    if (ctx.session) {
      await lucia.invalidateSession(ctx.session.id);
    }

    ctx.setCookie(lucia.createBlankSessionCookie().serialize());

    return {
      success: true,
    };
  }),
});
