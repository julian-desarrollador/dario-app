"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CalendarDays, ClipboardList, FileText, Leaf, LogOut, Menu, Newspaper, X } from "lucide-react";
import { AppStateProvider, useAppState } from "@/modules/clients/components/app-state.tsx";
import { Button } from "@/components/ui/button.tsx";

const NAV = [
  { href: "/app", label: "Novedades y Recursos", icon: Newspaper, id: "novedades" },
  { href: "/app/gestion", label: "Gestión Ambiental", icon: Leaf, id: "gestion" },
  { href: "/app/monitoreo", label: "Plan de Monitoreo", icon: CalendarDays, id: "monitoreo" },
  { href: "/app/documentacion", label: "Documentación", icon: FileText, id: "documentacion" },
  { href: "/app/reportes", label: "Reportes", icon: ClipboardList, id: "reportes" },
] as const;

const SECTION_LABEL: Record<string, string> = {
  gestion: "Gestión Ambiental",
  monitoreo: "Plan de Monitoreo",
  documentacion: "Documentación",
  reportes: "Reportes",
  firmar: "Para firmar",
};

const RESERVED = new Set(Object.keys(SECTION_LABEL));

function activeSection(pathname: string): string {
  const section = pathname.split("/").filter(Boolean)[1];
  if (!section) return "novedades";
  if (RESERVED.has(section)) return section;
  return "gestion";
}

function navClass(active: boolean) {
  return active
    ? "nav-active inline-flex h-11 items-center gap-2 rounded-full px-4 text-base font-semibold"
    : "nav-idle inline-flex h-11 items-center gap-2 rounded-full px-4 text-base font-medium";
}

function mobileNavClass(active: boolean) {
  return active
    ? "nav-active flex h-14 w-full items-center gap-3 rounded-2xl px-4 text-xl font-semibold"
    : "nav-idle flex h-14 w-full items-center gap-3 rounded-2xl px-4 text-xl font-medium";
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppStateProvider>
      <Shell>{children}</Shell>
    </AppStateProvider>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const app = useAppState();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  if (!app.ready) return <div className="min-h-screen bg-[var(--paper)]" />;
  if (!app.user) return <LoginScreen />;

  const current = activeSection(pathname);

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <header className="app-chrome border-b border-[var(--ink)]/8 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/app" className="text-2xl font-semibold tracking-tight">
            Ámbito
          </Link>
          <div className="flex items-center gap-3">
            {app.user.role === "firmante" ? (
              <Link href="/app/firmar" className="text-base font-medium text-[var(--forest)]">
                Para firmar
              </Link>
            ) : null}
            <span className="inline-flex items-center gap-2 text-base">
              <span className="size-2.5 rounded-full bg-[var(--moss)]" aria-hidden />
              {app.user.name}
            </span>
            <button
              type="button"
              onClick={app.logout}
              className="hidden text-base font-medium text-[var(--forest)] md:inline"
            >
              Salir
            </button>
            <button
              type="button"
              className="inline-flex size-12 items-center justify-center rounded-full text-[var(--ink)] md:hidden"
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="size-7" aria-hidden />
            </button>
          </div>
        </div>
        <nav
          className={`mx-auto hidden max-w-5xl flex-wrap items-center gap-1 px-4 md:flex ${pathname === "/app" ? "pb-3" : ""}`}
        >
          {NAV.map((item) => {
            const active = current === item.id;
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={navClass(active)}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="size-4" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
        {pathname === "/app" ? null : (
          <div className="mx-auto max-w-5xl px-4 pt-2 pb-3 text-sm text-[var(--muted)]">
            <Crumb />
          </div>
        )}
      </header>
      {menuOpen ? (
        <div className="app-chrome fixed inset-0 z-50 flex min-h-dvh flex-col bg-white md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-2xl font-semibold tracking-tight">Ámbito</p>
            <button
              type="button"
              className="inline-flex size-12 items-center justify-center rounded-full text-[var(--ink)]"
              aria-label="Cerrar"
              onClick={() => setMenuOpen(false)}
            >
              <X className="size-7" aria-hidden />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-2 px-4 py-2">
            {NAV.map((item) => {
              const active = current === item.id;
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={mobileNavClass(active)}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="size-6" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={app.logout}
              className="mt-auto flex h-14 w-full items-center gap-3 rounded-2xl px-4 text-xl font-medium text-[var(--forest)]"
            >
              <LogOut className="size-6" aria-hidden />
              Salir
            </button>
          </nav>
        </div>
      ) : null}
      {app.notice ? (
        <p className="app-chrome bg-[var(--mist)] px-4 py-2 text-base" role="status">
          {app.notice}
        </p>
      ) : null}
      {children}
    </div>
  );
}

function Crumb() {
  const pathname = usePathname();
  const app = useAppState();
  const parts = pathname.split("/").filter(Boolean);
  const section = parts[1];
  const items: { href: string; label: string }[] = [];

  if (!section) {
    return null;
  }
  if (RESERVED.has(section)) {
    items.push({ href: `/app/${section}`, label: SECTION_LABEL[section] ?? section });
  } else {
    const client = app.clients.find((item) => item.id === section);
    const clientHref = `/app/${section}`;
    items.push({ href: "/app/gestion", label: "Gestión Ambiental" });
    items.push({ href: clientHref, label: client?.name ?? "Cliente" });
    if (parts[2] === "inspeccion") {
      items.push({ href: `${clientHref}/inspeccion`, label: "Inspección" });
    } else if (parts[2]) {
      const area = client?.areas.find((item) => item.id === parts[2]);
      items.push({ href: `${clientHref}/${parts[2]}`, label: area?.name ?? "Área" });
    }
  }

  return (
    <p>
      {items.map((item, index) => {
        const last = index === items.length - 1;
        return (
          <span key={`${item.href}-${item.label}`}>
            {index > 0 ? " / " : null}
            {last ? item.label : <Link href={item.href}>{item.label}</Link>}
          </span>
        );
      })}
    </p>
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
        className="panel w-full max-w-sm p-6"
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
        <p className="text-2xl font-semibold tracking-tight">Ámbito</p>
        <p className="mt-2 text-base text-[var(--muted)]">
          Entrá para ver los clientes de la consultora.
        </p>
        <label className="mt-5 block text-base">
          Usuario
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            className="mt-1 w-full rounded-lg border border-[var(--ink)]/12 px-3 py-2"
          />
        </label>
        <label className="mt-3 block text-base">
          Clave
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-[var(--ink)]/12 px-3 py-2"
          />
        </label>
        {error ? <p className="mt-3 text-base text-[var(--alert)]">{error}</p> : null}
        <Button type="submit" className="mt-5 h-11 w-full text-base">
          Entrar
        </Button>
        <p className="mt-4 text-sm text-[var(--muted)]">Usuario dario · clave 123</p>
      </form>
    </div>
  );
}
