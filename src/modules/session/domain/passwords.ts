import { USERS, type Account } from "./authenticate.ts";

const DEMO_PASSWORDS: Record<string, string> = {
  tecnico: "ambito",
  firmante: "ambito",
};

const DEV_DARIO_PASSWORD = "123";

/** Dario's password is AUTH_PASSWORD on the server. Dev keeps 123 when that variable is absent. */
export function accountsForEnv(env: { authPassword?: string; nodeEnv?: string }): Account[] {
  const configured = env.authPassword?.trim() ?? "";
  const darioPassword = configured || (env.nodeEnv === "production" ? "" : DEV_DARIO_PASSWORD);

  return USERS.flatMap((user) => {
    const password = user.username === "dario" ? darioPassword : (DEMO_PASSWORDS[user.username] ?? "");
    if (!password) return [];
    return [{ ...user, password }];
  });
}
