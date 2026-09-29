"use client";

import Link from "next/link";
import { useState } from "react";
import { AppStateProvider, useAppState } from "@/modules/clients/components/app-state.tsx";
import { Button } from "@/components/ui/button.tsx";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppStateProvider>
      <Shell>{children}</Shell>
    </AppStateProvider>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const app = useAppState();
  if (!app.ready) return <div className="min-h-screen bg-[var(--paper)]" />;
  if (!app.user) return <LoginScreen />;

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <header className="flex items-center justify-between gap-3 border-b border-[var(--ink)]/8 bg-white px-4 py-3">
        <Link href="/app" className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
          Ámbito
        </Link>
        <div className="flex items-center gap-2">
          {app.user.role === "firmante" ? (
            <Link href="/app/firmar" className="text-sm font-medium text-[var(--moss)]">
              Para firmar
            </Link>
          ) : null}
          <span className="text-sm text-[var(--muted)]">{app.user.name}</span>
          <button
            type="button"
            onClick={app.logout}
            className="rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-[var(--ink)]/12"
          >
            Salir
          </button>
        </div>
      </header>
      {app.notice ? (
        <p className="bg-[var(--mist)] px-4 py-2 text-sm" role="status">
          {app.notice}
        </p>
      ) : null}
      {children}
    </div>
  );
}

function LoginScreen() {
  const app = useAppState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--paper)] px-4">
      <form
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm"
        onSubmit={(event) => {
          event.preventDefault();
          if (!app.login(username, password)) {
            setError("Usuario o clave incorrectos.");
            return;
          }
          setError("");
          setPassword("");
        }}
      >
        <p className="font-[family-name:var(--font-display)] text-2xl">Ámbito</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Entrá para ver los clientes de la consultora.
        </p>
        <label className="mt-5 block text-sm">
          Usuario
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            className="mt-1 w-full rounded-lg border border-[var(--ink)]/12 px-3 py-2"
          />
        </label>
        <label className="mt-3 block text-sm">
          Clave
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-[var(--ink)]/12 px-3 py-2"
          />
        </label>
        {error ? <p className="mt-3 text-sm text-[var(--alert)]">{error}</p> : null}
        <Button type="submit" className="mt-5 w-full">
          Entrar
        </Button>
        <p className="mt-4 text-xs text-[var(--muted)]">Demo: tecnico o firmante · clave ambito</p>
      </form>
    </div>
  );
}
