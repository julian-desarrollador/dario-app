"use client";

import Link from "next/link";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { BackLink } from "@/components/back-link.tsx";
import { ConfirmDialog } from "@/components/ui/dialog.tsx";
import { ActionMenu, ActionMenuItem } from "@/components/ui/menu.tsx";
import { ClientFormDialog } from "@/modules/clients/components/client-form-dialog.tsx";
import { useAppState } from "@/modules/clients/components/app-state.tsx";
import { AreaProgressBar } from "@/modules/expediente/components/area-progress-bar.tsx";
import { RequirementCard } from "@/modules/expediente/components/requirement-card.tsx";
import { emptyViewCopy, StatusSummary, viewTitle } from "@/modules/expediente/components/status-summary.tsx";
import { todayISO } from "@/modules/expediente/domain/document-code.ts";
import {
  areaRequirements,
  attentionFirst,
  clientRequirements,
  countByStatus,
  matchesView,
  pendingOkCount,
  progressPercent,
  type RequirementView,
} from "@/modules/expediente/domain/progress.ts";
import { deriveStatus, pendingSignerOk } from "@/modules/expediente/domain/requirement-status.ts";

const PREVIEW = 5;

export default function ClientPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const app = useAppState();
  const client = app.clients.find((item) => item.id === clientId);
  const today = todayISO();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [removing, setRemoving] = useState(false);

  const [view, setView] = useState<RequirementView | null>(null);
  const [showAll, setShowAll] = useState(false);

  if (!client) {
    return (
      <main className="px-4 py-8">
        <p>No encontramos ese cliente.</p>
        <BackLink href="/app">Volver a clientes</BackLink>
      </main>
    );
  }

  const located = client.areas.flatMap((area) =>
    areaRequirements(area).map((requirement) => ({ requirement, area })),
  );
  const actionable = attentionFirst(
    located
      .filter(
        (item) =>
          deriveStatus(item.requirement, today) !== "ok" || pendingSignerOk(item.requirement),
      )
      .map((item) => item.requirement),
    today,
  )
    .map((requirement) => located.find((item) => item.requirement.id === requirement.id))
    .filter((item) => item !== undefined);
  const filtered = view
    ? attentionFirst(
        located
          .filter((item) => matchesView(item.requirement, view, today))
          .map((item) => item.requirement),
        today,
      )
        .map((requirement) => located.find((item) => item.requirement.id === requirement.id))
        .filter((item) => item !== undefined)
    : [];
  const visible = view ? filtered : showAll ? actionable : actionable.slice(0, PREVIEW);
  const requirements = clientRequirements(client);

  return (
    <main className="mx-auto max-w-3xl px-4 py-5">
      <BackLink href="/app">Volver a clientes</BackLink>
      <div className="mt-2 flex items-start justify-between gap-3">
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          {client.name}
        </h1>
        <ActionMenu label="Ficha">
          <ActionMenuItem onClick={() => setEditing(true)}>Editar ficha</ActionMenuItem>
          <ActionMenuItem destructive onClick={() => setRemoving(true)}>
            Eliminar cliente
          </ActionMenuItem>
        </ActionMenu>
      </div>
      <p className="mt-1 text-sm text-[var(--muted)]">
        {client.industry} · {client.province} · {client.municipality} · {client.enablingYear}
      </p>

      <div className="mt-4">
        <StatusSummary
          counts={countByStatus(requirements, today)}
          unsigned={pendingOkCount(requirements)}
          selected={view}
          onSelect={(next) => setView((current) => (current === next ? null : next))}
        />
      </div>

      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          {view ? viewTitle[view] : "Para hacer"}
        </h2>
        {visible.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--muted)]">
            {view ? emptyViewCopy[view] : "No hay pendientes en este cliente."}
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {visible.map((item) => (
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
        {!view && actionable.length > PREVIEW ? (
          <button
            type="button"
            onClick={() => setShowAll((value) => !value)}
            className="mt-3 text-sm font-medium text-[var(--moss)]"
          >
            {showAll ? "Ver menos" : `Ver todos (${actionable.length})`}
          </button>
        ) : null}
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
                <span className="block text-lg font-medium">{area.name}</span>
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
      <ClientFormDialog
        open={editing}
        onOpenChange={setEditing}
        formKey={client.id}
        title="Editar cliente"
        description="Cambia la ficha. El expediente queda igual."
        submitLabel="Guardar"
        initial={client}
        onSubmit={(input) => app.updateClient(client.id, input)}
      />
      <ConfirmDialog
        open={removing}
        onOpenChange={setRemoving}
        title="Eliminar cliente"
        description={`Se borra ${client.name} y todo su expediente. No se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={() => {
          app.removeClient(client.id);
          router.push("/app");
        }}
      />
    </main>
  );
}
