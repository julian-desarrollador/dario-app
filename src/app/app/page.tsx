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
import {
  clientRequirements,
  countByStatus,
  pendingOkCount,
} from "@/modules/expediente/domain/progress.ts";
import type { Client } from "@/modules/expediente/domain/model.ts";

export default function ClientsPage() {
  const app = useAppState();
  const today = todayISO();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [removing, setRemoving] = useState<Client | null>(null);

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            Consultora
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">Clientes</h1>
        </div>
        <Button onClick={() => setOpen(true)}>Nuevo cliente</Button>
      </div>
      {app.clients.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-[var(--ink)]/15 px-4 py-10 text-center text-sm text-[var(--muted)]">
          Agregá tu primer cliente para armar su expediente.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {app.clients.map((client) => {
            const requirements = clientRequirements(client);
            const counts = countByStatus(requirements, today);
            return (
              <li key={client.id} className="relative rounded-2xl bg-white ring-1 ring-[var(--ink)]/8">
                <div className="absolute top-4 right-4 z-10">
                  <ActionMenu label="Ficha">
                    <ActionMenuItem onClick={() => setEditing(client)}>Editar ficha</ActionMenuItem>
                    <ActionMenuItem destructive onClick={() => setRemoving(client)}>
                      Eliminar cliente
                    </ActionMenuItem>
                  </ActionMenu>
                </div>
                <Link href={`/app/${client.id}`} className="block px-4 py-4 pr-24">
                  <span className="block font-medium">{client.name}</span>
                  <span className="mt-1 block text-sm text-[var(--muted)]">
                    {client.industry} · {client.province} · {client.municipality} · {client.enablingYear}
                  </span>
                  <span className="mt-4 block">
                    <StatusGlance counts={counts} unsigned={pendingOkCount(requirements)} />
                  </span>
                  <span className="mt-3 inline-flex items-center gap-0.5 text-sm font-medium text-[var(--moss)]">
                    Ver expediente
                    <ChevronRight className="size-4" aria-hidden />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
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
          removing
            ? `Se borra ${removing.name} y todo su expediente. No se puede deshacer.`
            : ""
        }
        confirmLabel="Eliminar"
        onConfirm={() => {
          if (removing) app.removeClient(removing.id);
        }}
      />
    </main>
  );
}
