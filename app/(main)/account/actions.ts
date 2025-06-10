"use server";

import { unstable_expirePath as expirePath } from "next/cache";
import { z } from "zod";

import { db } from "@/lib/db";
import { validatedAction } from "@/lib/middleware";
import { getUser } from "@/lib/queries";
import { links } from "@/lib/constants";

const updateDisplayNameSchema = z.object({
  name: z
    .string()
    .min(1, "Display name must be at least 1 character.")
    .max(32, "Display name must be less than 32 characters."),
});

export const updateDisplayName = validatedAction(
  updateDisplayNameSchema,
  async (data) => {
    const { name } = data;

    const user = await getUser();

    if (!user) {
      return {
        error: "User not authenticated.",
        values: data,
      };
    }

    try {
      await db
        .updateTable("users")
        .set({ name })
        .where("id", "=", user.id)
        .execute();
    } catch (error) {
      console.error(error);
      return {
        error: "An error occurred. Please try again.",
        values: data,
      };
    }

    expirePath(links.account);

    return { success: true };
  },
);

const updateUsernameSchema = z.object({
  username: z
    .string()
    .min(1, "Username must be at least 1 character.")
    .max(48, "Username must be less than 48 characters.")
    .toLowerCase(),
});

export const updateUsername = validatedAction(
  updateUsernameSchema,
  async (data) => {
    const { username } = data;

    const user = await getUser();

    if (!user) {
      return {
        error: "User not authenticated.",
        values: data,
      };
    }

    try {
      const existingUser = await db
        .selectFrom("users")
        .selectAll()
        .where("username", "=", username)
        .executeTakeFirst();

      if (existingUser && existingUser.id !== user.id) {
        return {
          error: "Username is already taken.",
          values: data,
        };
      }

      await db
        .updateTable("users")
        .set({ username })
        .where("id", "=", user.id)
        .execute();
    } catch (error) {
      console.error(error);
      return {
        error: "An error occurred. Please try again.",
        values: data,
      };
    }

    expirePath(links.account);

    return { success: true };
  },
);
