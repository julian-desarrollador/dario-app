export type SessionUser = {
  id: string;
  username: string;
  name: string;
  role: "tecnico" | "firmante";
};

type Account = SessionUser & { password: string };

const ACCOUNTS: Account[] = [
  {
    id: "dario",
    username: "dario",
    password: "123",
    name: "Dario",
    role: "tecnico",
  },
  {
    id: "tecnico",
    username: "tecnico",
    password: "ambito",
    name: "Técnico",
    role: "tecnico",
  },
  {
    id: "firmante",
    username: "firmante",
    password: "ambito",
    name: "Firmante",
    role: "firmante",
  },
];

export const SIGNERS: Pick<SessionUser, "id" | "name">[] = ACCOUNTS.filter(
  (account) => account.role === "firmante",
).map(({ id, name }) => ({ id, name }));

/** Demo pair Dario uses to try the operator and the owner without typing passwords. */
export function accountForRole(role: SessionUser["role"]): { username: string; password: string } {
  const account =
    role === "firmante"
      ? ACCOUNTS.find((item) => item.role === "firmante")
      : ACCOUNTS.find((item) => item.id === "dario");
  return { username: account?.username ?? "", password: account?.password ?? "" };
}

export function authenticate(username: string, password: string): SessionUser | null {
  const account = ACCOUNTS.find(
    (item) =>
      item.username === username.trim().toLowerCase() && item.password === password,
  );
  if (!account) return null;
  return {
    id: account.id,
    username: account.username,
    name: account.name,
    role: account.role,
  };
}
