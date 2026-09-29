"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { FormDialog } from "@/components/ui/dialog.tsx";
import { enablingYears, industryTypes, locations } from "@/modules/expediente/catalog.ts";
import type { Client } from "@/modules/expediente/domain/model.ts";

type Profile = Omit<Client, "id" | "areas">;

function placeOf(client: Pick<Client, "province" | "municipality">) {
  const joined = `${client.province} · ${client.municipality}`;
  return locations.includes(joined) ? joined : locations[0];
}

export function ClientFormDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  formKey,
  initial,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  submitLabel: string;
  formKey: string;
  initial?: Profile;
  onSubmit: (input: Profile) => void;
}) {
  return (
    <FormDialog open={open} onOpenChange={onOpenChange} title={title} description={description}>
      {open ? (
        <ClientForm
          key={formKey}
          initial={initial}
          submitLabel={submitLabel}
          onSubmit={(input) => {
            onSubmit(input);
            onOpenChange(false);
          }}
        />
      ) : null}
    </FormDialog>
  );
}

function ClientForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Profile;
  submitLabel: string;
  onSubmit: (input: Profile) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [industry, setIndustry] = useState(initial?.industry ?? industryTypes[0]);
  const [place, setPlace] = useState(initial ? placeOf(initial) : locations[0]);
  const [year, setYear] = useState(initial?.enablingYear ?? enablingYears[3] ?? enablingYears[0]);
  const [error, setError] = useState("");

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (!name.trim()) {
          setError("Poné el nombre de la empresa.");
          return;
        }
        const [province, municipality] = place.split(" · ");
        onSubmit({
          name: name.trim(),
          industry,
          province: province ?? place,
          municipality: municipality ?? "",
          enablingYear: year,
        });
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
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
