"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { ConfirmDialog } from "@/components/ui/dialog.tsx";
import { ActionMenu, ActionMenuItem } from "@/components/ui/menu.tsx";
import { ClientFormDialog } from "@/modules/clients/components/client-form-dialog.tsx";
import { useAppState } from "@/modules/clients/components/app-state.tsx";
import { StatusGlance } from "@/modules/expediente/components/status-summary.tsx";
import { todayISO } from "@/modules/expediente/domain/document-code.ts";
import { TRAMITE_OPTIONS, tramiteLabel } from "@/modules/expediente/domain/labels.ts";
import { countTramites, listExpedientes } from "@/modules/expediente/domain/overview.ts";
import {
  clientRequirements,
  countByStatus,
  pendingOkCount,
} from "@/modules/expediente/domain/progress.ts";
import type { Client } from "@/modules/expediente/domain/model.ts";

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es-AR");
}

export default function GestionPage() {
  const app = useAppState();
  const today = todayISO();
  const rows = listExpedientes(app.clients);
  const tramites = countTramites(app.clients);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [removing, setRemoving] = useState<Client | null>(null);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <div className="panel px-5 py-5">
        <h1 className="text-3xl font-semibold tracking-tight">Gestión Ambiental</h1>
        <p className="mt-1 text-base text-[var(--muted)]">Expedientes de las empresas y su trámite.</p>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {TRAMITE_OPTIONS.map((option) => (
          <li key={option.id} className="panel px-4 py-4">
            <p className="text-3xl font-semibold tracking-tight">{tramites[option.id]}</p>
            <p className="mt-1 text-base">{option.label}</p>
          </li>
        ))}
      </ul>

      <section className="mt-8">
        <h2 className="text-base font-semibold">Expedientes</h2>
        {rows.length === 0 ? (
          <p className="mt-3 text-base">Todavía no hay expedientes anotados.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {rows.map((row) => (
                <li key={row.topicId}>
                <Link
                  href={`/app/${row.clientId}/${row.areaId}`}
                  className="panel block px-4 py-4 text-base"
                >
                  <span className="block font-semibold">{row.topicName}</span>
                  <span className="mt-1 block">{row.clientName}</span>
                  <span className="mt-1 block text-2xl font-semibold tracking-tight">
                    Expediente {row.expediente}
                  </span>
                  <span className="mt-1 block">{tramiteLabel(row.tramite)}</span>
                  {row.renovacion ? (
                    <span className="mt-1 block">Renueva el {formatDate(row.renovacion)}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-base font-semibold">Empresas</h2>
          <Button className="h-11 px-4 text-base" onClick={() => setOpen(true)}>
            Nuevo cliente
          </Button>
        </div>
        {app.clients.length === 0 ? (
          <p className="mt-3 text-base">Agregá tu primer cliente para armar su expediente.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {app.clients.map((client) => {
              const requirements = clientRequirements(client);
              const counts = countByStatus(requirements, today);
              return (
                <li key={client.id} className="panel relative">
                  <div className="absolute top-4 right-4 z-10">
                    <ActionMenu label="Ficha">
                      <ActionMenuItem onClick={() => setEditing(client)}>Editar ficha</ActionMenuItem>
                      <ActionMenuItem destructive onClick={() => setRemoving(client)}>
                        Eliminar cliente
                      </ActionMenuItem>
                    </ActionMenu>
                  </div>
                  <Link href={`/app/${client.id}`} className="block px-4 py-4 pr-24">
                    <span className="block text-base font-medium">{client.name}</span>
                    <span className="mt-1 block text-base text-[var(--muted)]">
                      {client.industry} · {client.province} · {client.municipality} · {client.enablingYear}
                    </span>
                    <span className="mt-4 block">
                      <StatusGlance counts={counts} unsigned={pendingOkCount(requirements)} />
                    </span>
                    <span className="mt-3 inline-flex items-center gap-0.5 text-base font-medium text-[var(--moss)]">
                      Ver expediente
                      <ChevronRight className="size-4" aria-hidden />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <ClientFormDialog
        open={open}
        onOpenChange={setOpen}
        formKey="nuevo"
        title="Nuevo cliente"
        description="El expediente arranca vacío, con las áreas de trabajo."
        submitLabel="Crear"
        onSubmit={(input) => app.addClient(input)}
      />
      <ClientFormDialog
        open={editing !== null}
        onOpenChange={(next) => {
          if (!next) setEditing(null);
        }}
        formKey={editing?.id ?? "editar"}
        title="Editar cliente"
        description="Cambia la ficha. El expediente queda igual."
        submitLabel="Guardar"
        initial={editing ?? undefined}
        onSubmit={(input) => {
          if (editing) app.updateClient(editing.id, input);
        }}
      />
      <ConfirmDialog
        open={removing !== null}
        onOpenChange={(next) => {
          if (!next) setRemoving(null);
        }}
        title="Eliminar cliente"
        description={
          removing ? `Se borra ${removing.name} y todo su expediente. No se puede deshacer.` : ""
        }
        confirmLabel="Eliminar"
        onConfirm={() => {
          if (removing) app.removeClient(removing.id);
        }}
      />
    </main>
  );
}
