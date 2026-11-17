"use server";

import { connection } from "next/server";
import { authenticate, type SessionUser } from "../../domain/authenticate.ts";
import { accountsForEnv } from "../../domain/passwords.ts";

export async function signIn(username: string, password: string): Promise<SessionUser | null> {
  await connection();
  const env = process.env;
  return authenticate(
    username,
    password,
    accountsForEnv({
      authPassword: env.AUTH_PASSWORD,
      nodeEnv: env.NODE_ENV,
    }),
  );
}
