"use client";

import Link from "next/link";
import { use } from "react";
import { useAppState } from "@/modules/clients/components/app-state.tsx";
import { AreaProgressBar } from "@/modules/expediente/components/area-progress-bar.tsx";
import { RequirementCard } from "@/modules/expediente/components/requirement-card.tsx";
import { todayISO } from "@/modules/expediente/domain/document-code.ts";
import { shortAreaName } from "@/modules/expediente/domain/labels.ts";
import {
  areaRequirements,
  attentionFirst,
  progressPercent,
} from "@/modules/expediente/domain/progress.ts";
import { deriveStatus } from "@/modules/expediente/domain/requirement-status.ts";

export default function ClientPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const app = useAppState();
  const client = app.clients.find((item) => item.id === clientId);
  const today = todayISO();

  if (!client) {
    return (
      <main className="px-4 py-8">
        <p>No encontramos ese cliente.</p>
        <Link href="/app" className="mt-3 inline-block text-sm font-medium text-[var(--moss)]">
          Volver a clientes
        </Link>
      </main>
    );
  }

  const pending = client.areas.flatMap((area) =>
    areaRequirements(area)
      .filter((requirement) => deriveStatus(requirement, today) !== "ok")
      .map((requirement) => ({ requirement, area })),
  );
  const ordered = attentionFirst(
    pending.map((item) => item.requirement),
    today,
  )
    .slice(0, 5)
    .map((requirement) => pending.find((item) => item.requirement.id === requirement.id))
    .filter((item) => item !== undefined);

  return (
    <main className="mx-auto max-w-3xl px-4 py-5">
      <Link href="/app" className="text-sm text-[var(--muted)]">
        Clientes
      </Link>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-tight">
        {client.name}
      </h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        {client.industry} · {client.province} · {client.municipality} · {client.enablingYear}
      </p>

      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Para hacer
        </h2>
        {ordered.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--muted)]">No hay pendientes en este cliente.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {ordered.map((item) => (
              <li key={item.requirement.id}>
                <p className="mb-1 text-xs text-[var(--muted)]">{item.area.name}</p>
                <RequirementCard
                  clientId={client.id}
                  areaId={item.area.id}
                  requirement={item.requirement}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Áreas
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {client.areas.map((area) => (
            <li key={area.id}>
              <Link
                href={`/app/${client.id}/${area.id}`}
                className="block rounded-2xl bg-white px-4 py-3 ring-1 ring-[var(--ink)]/8"
              >
                <span className="block font-medium">{shortAreaName(area.name)}</span>
                <span className="mt-2 block">
                  <AreaProgressBar
                    percent={progressPercent(areaRequirements(area), today)}
                    label="Avance"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
