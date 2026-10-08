"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppState } from "@/modules/clients/components/app-state.tsx";
import { todayISO } from "@/modules/expediente/domain/document-code.ts";
import { statusLabel } from "@/modules/expediente/domain/labels.ts";
import { dueInYear, dueYears } from "@/modules/expediente/domain/overview.ts";
import { deriveStatus } from "@/modules/expediente/domain/requirement-status.ts";

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es-AR");
}

function monthLabel(year: string, month: number) {
  const name = new Date(Number(year), month - 1, 1).toLocaleDateString("es-AR", { month: "long" });
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export default function MonitoreoPage() {
  const app = useAppState();
  const today = todayISO();
  const years = dueYears(app.clients, today);
  const [year, setYear] = useState(today.slice(0, 4));
  const groups = dueInYear(app.clients, year);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <div className="panel px-5 py-5">
        <h1 className="text-3xl font-semibold tracking-tight">Plan de Monitoreo</h1>
        <p className="mt-1 text-base text-[var(--muted)]">Controles del año, agrupados por mes.</p>
        <label className="mt-4 block text-base" htmlFor="anio-monitoreo">
          Año
          <select
            id="anio-monitoreo"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            className="mt-2 h-11 w-full max-w-xs rounded-lg border border-[var(--ink)]/15 px-3 text-base"
          >
            {years.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      {groups.length === 0 ? (
        <p className="mt-6 text-base">No hay controles para este año.</p>
      ) : (
        <div className="mt-6 space-y-8">
          {groups.map((group) => (
            <section key={group.month}>
              <h2 className="text-2xl font-semibold tracking-tight">{monthLabel(year, group.month)}</h2>
              <ul className="mt-3 space-y-3">
                {group.items.map((item) => {
                  const due = item.requirement.dueDate ?? "";
                  return (
                    <li key={`${item.clientId}-${item.requirement.id}`}>
                      <Link
                        href={`/app/${item.clientId}/${item.areaId}`}
                        className="panel block px-4 py-4 text-base"
                      >
                        <span className="block font-semibold">{item.requirement.name}</span>
                        <span className="mt-1 block">
                          {item.clientName} · {item.areaName}
                        </span>
                        <span className="mt-1 block">Vence el {formatDate(due)}</span>
                        <span className="mt-1 block">
                          {item.requirement.kind === "task"
                            ? item.requirement.taskDone
                              ? "Hecho"
                              : "Pendiente"
                            : statusLabel(deriveStatus(item.requirement, today))}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
