import { env } from "@/lib/env";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { promisify } from "util";
import { randomBytes } from "crypto";

import { UserRole } from "./db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isDev() {
  return env.NODE_ENV === "development";
}

export function isAdmin(role: UserRole) {
  return role === "admin";
}

export async function generateId(length: number = 16) {
  const randomString = (await promisify(randomBytes)(Math.ceil(length / 2)))
    .toString("hex")
    .slice(0, length);
  return randomString;
}

export function absoluteUrl(path: string) {
  const protocol = isDev() ? "http" : "https";
  return `${protocol}://${env.VERCEL_URL}${path}`;
}
