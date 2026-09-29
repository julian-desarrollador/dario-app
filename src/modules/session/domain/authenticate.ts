export type SessionUser = {
  id: string;
  username: string;
  name: string;
  role: "tecnico" | "firmante";
};

type Account = SessionUser & { password: string };

const ACCOUNTS: Account[] = [
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

export function authenticate(username: string, password: string): SessionUser | null {
  const account = ACCOUNTS.find(
    (item) => item.username === username.trim() && item.password === password,
  );
  if (!account) return null;
  return {
    id: account.id,
    username: account.username,
    name: account.name,
    role: account.role,
  };
}
