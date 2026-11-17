export type SessionUser = {
  id: string;
  username: string;
  name: string;
  role: "tecnico" | "firmante";
};

export type Account = SessionUser & { password: string };

export const USERS: SessionUser[] = [
  {
    id: "dario",
    username: "dario",
    name: "Dario",
    role: "tecnico",
  },
  {
    id: "tecnico",
    username: "tecnico",
    name: "Técnico",
    role: "tecnico",
  },
  {
    id: "firmante",
    username: "firmante",
    name: "Firmante",
    role: "firmante",
  },
];

export const SIGNERS: Pick<SessionUser, "id" | "name">[] = USERS.filter(
  (account) => account.role === "firmante",
).map(({ id, name }) => ({ id, name }));

/** Operario is Dario. Dueño is the signer. The header switches these without a password. */
export function userForRole(role: SessionUser["role"]): SessionUser {
  const account =
    role === "firmante"
      ? USERS.find((item) => item.role === "firmante")
      : USERS.find((item) => item.id === "dario");
  return account ?? USERS[0];
}

export function authenticate(
  username: string,
  password: string,
  accounts: Account[],
): SessionUser | null {
  const normalized = username.trim().toLowerCase();
  if (!password) return null;
  const account = accounts.find(
    (item) => item.username === normalized && item.password === password,
  );
  if (!account) return null;
  return {
    id: account.id,
    username: account.username,
    name: account.name,
    role: account.role,
  };
}
