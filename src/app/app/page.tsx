"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { FormDialog } from "@/components/ui/dialog.tsx";
import { useAppState } from "@/modules/clients/components/app-state.tsx";
import { enablingYears, industryTypes, locations } from "@/modules/expediente/catalog.ts";
import { AreaProgressBar } from "@/modules/expediente/components/area-progress-bar.tsx";
import { todayISO } from "@/modules/expediente/domain/document-code.ts";
import {
  clientRequirements,
  countByStatus,
  pendingOkCount,
  progressPercent,
} from "@/modules/expediente/domain/progress.ts";

export default function ClientsPage() {
  const app = useAppState();
  const today = todayISO();
  const [open, setOpen] = useState(false);

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
              <li key={client.id}>
                <Link
                  href={`/app/${client.id}`}
                  className="block rounded-2xl bg-white px-4 py-4 ring-1 ring-[var(--ink)]/8"
                >
                  <span className="block font-medium">{client.name}</span>
                  <span className="mt-1 block text-sm text-[var(--muted)]">
                    {client.industry} · {client.province} · {client.municipality} · {client.enablingYear}
                  </span>
                  <span className="mt-3 block">
                    <AreaProgressBar percent={progressPercent(requirements, today)} label="Avance" />
                  </span>
                  <span className="mt-2 block text-xs text-[var(--muted)]">
                    {counts.expired} vencidos · {counts["due-soon"]} por vencer · {pendingOkCount(requirements)} sin OK
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <NewClientDialog open={open} onOpenChange={setOpen} />
    </main>
  );
}

function NewClientDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const app = useAppState();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState(industryTypes[0]);
  const [place, setPlace] = useState(locations[0]);
  const [year, setYear] = useState(enablingYears[3] ?? enablingYears[0]);
  const [error, setError] = useState("");

  return (
    <FormDialog open={open} onOpenChange={onOpenChange} title="Nuevo cliente" description="El expediente arranca vacío, con las áreas de trabajo.">
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (!name.trim()) {
            setError("Poné el nombre de la empresa.");
            return;
          }
          const [province, municipality] = place.split(" · ");
          app.addClient({
            name: name.trim(),
            industry,
            province: province ?? place,
            municipality: municipality ?? "",
            enablingYear: year,
          });
          setName("");
          onOpenChange(false);
        }}
      >
        <label className="block text-sm">
          Empresa
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--ink)]/12 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Industria
          <select
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--ink)]/12 px-2 py-2"
          >
            {industryTypes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Provincia y municipio
          <select
            value={place}
            onChange={(event) => setPlace(event.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--ink)]/12 px-2 py-2"
          >
            {locations.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Año habilitante
          <select
            value={year}
            onChange={(event) => setYear(event.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--ink)]/12 px-2 py-2"
          >
            {enablingYears.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        {error ? <p className="text-sm text-[var(--alert)]">{error}</p> : null}
        <div className="flex justify-end">
          <Button type="submit">Crear</Button>
        </div>
      </form>
    </FormDialog>
  );
}
