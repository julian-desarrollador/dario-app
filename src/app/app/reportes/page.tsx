"use client";

import Link from "next/link";
import { useAppState } from "@/modules/clients/components/app-state.tsx";
import { StatusGlance } from "@/modules/expediente/components/status-summary.tsx";
import { todayISO } from "@/modules/expediente/domain/document-code.ts";
import { clientRequirements, countByStatus, pendingOkCount } from "@/modules/expediente/domain/progress.ts";

export default function ReportesPage() {
  const app = useAppState();
  const today = todayISO();

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <div className="panel px-5 py-5">
        <h1 className="text-3xl font-semibold tracking-tight">Reportes</h1>
        <p className="mt-1 text-base text-[var(--muted)]">Estado de cada empresa, listo para presentar.</p>
      </div>

      {app.clients.length === 0 ? (
        <p className="mt-6 text-base">Todavía no hay empresas.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {app.clients.map((client) => {
            const requirements = clientRequirements(client);
            return (
              <li key={client.id} className="panel px-4 py-4">
                <h2 className="text-2xl font-semibold tracking-tight">{client.name}</h2>
                <p className="mt-1 text-base text-[var(--muted)]">
                  {client.industry} · {client.province} · {client.municipality}
                </p>
                <div className="mt-4">
                  <StatusGlance
                    counts={countByStatus(requirements, today)}
                    unsigned={pendingOkCount(requirements)}
                  />
                </div>
                <Link
                  href={`/app/${client.id}/inspeccion`}
                  className="mt-4 inline-flex h-11 items-center rounded-full bg-[var(--moss)] px-4 text-base font-semibold text-white"
                >
                  Ver para la inspección
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
