"use client";

import { useState } from "react";
import { useAppState } from "@/modules/clients/components/app-state.tsx";
import { ScheduleList } from "@/modules/expediente/components/schedule-list.tsx";
import { todayISO } from "@/modules/expediente/domain/document-code.ts";
import { scheduleInYear, scheduleYears } from "@/modules/expediente/domain/month-report.ts";

function monthLabel(year: string, month: number) {
  const name = new Date(Number(year), month - 1, 1).toLocaleDateString("es-AR", { month: "long" });
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export default function MonitoreoPage() {
  const app = useAppState();
  const today = todayISO();
  const years = scheduleYears(app.clients, today);
  const [year, setYear] = useState(today.slice(0, 4));
  const groups = scheduleInYear(app.clients, year);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <div className="panel px-5 py-5">
        <h1 className="text-3xl font-semibold tracking-tight">Plan de Monitoreo</h1>
        <p className="mt-1 text-base text-[var(--muted)]">
          El mismo cronograma para el operario y el supervisor. Cada mes, lo pendiente y lo realizado.
        </p>
        <label className="mt-4 flex max-w-xs flex-col gap-4 text-base" htmlFor="anio-monitoreo">
          Año
          <select
            id="anio-monitoreo"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            className="h-11 w-full rounded-lg border border-[var(--ink)]/15 px-3 text-base"
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
              <ScheduleList pending={group.pending} done={group.done} today={today} />
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
