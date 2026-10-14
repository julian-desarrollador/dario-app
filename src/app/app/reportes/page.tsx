"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppState } from "@/modules/clients/components/app-state.tsx";
import { MonthFigures } from "@/modules/expediente/components/month-figures.tsx";
import { ScheduleList } from "@/modules/expediente/components/schedule-list.tsx";
import { todayISO } from "@/modules/expediente/domain/document-code.ts";
import { figuresForClient, scheduleForClientMonth, scheduleMonths } from "@/modules/expediente/domain/month-report.ts";

function monthTitle(yearMonth: string) {
  const [year, month] = yearMonth.split("-");
  const name = new Date(Number(year), Number(month) - 1, 1).toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export default function ReportesPage() {
  const app = useAppState();
  const today = todayISO();
  const months = scheduleMonths(app.clients, today);
  const [month, setMonth] = useState(today.slice(0, 7));

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <div className="panel px-5 py-5">
        <h1 className="text-3xl font-semibold tracking-tight">Reportes</h1>
        <p className="mt-1 text-base text-[var(--muted)]">Informe del mes para el supervisor.</p>
        <label className="mt-4 flex max-w-xs flex-col gap-4 text-base" htmlFor="mes-reporte">
          Mes
          <select
            id="mes-reporte"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            className="h-11 w-full rounded-lg border border-[var(--ink)]/15 px-3 text-base"
          >
            {months.map((item) => (
              <option key={item} value={item}>
                {monthTitle(item)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {app.clients.length === 0 ? (
        <p className="mt-6 text-base">Todavía no hay empresas.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {app.clients.map((client) => (
            <li key={client.id} className="panel px-4 py-4">
              <h2 className="text-2xl font-semibold tracking-tight">{client.name}</h2>
              <p className="mt-1 text-base text-[var(--muted)]">
                {client.industry} · {client.province} · {client.municipality}
              </p>
              <div className="mt-4">
                <MonthFigures figures={figuresForClient(app.clients, client.id, month, today)} />
              </div>
              <ScheduleList {...scheduleForClientMonth(app.clients, client.id, month)} today={today} />
              <Link href={`/app/${client.id}/inspeccion`} className="btn-app mt-4 h-11 text-base">
                Ver para la inspección
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
