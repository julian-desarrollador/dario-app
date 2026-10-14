"use client";

import { useState } from "react";
import { BackLink } from "@/components/back-link.tsx";
import { Button } from "@/components/ui/button.tsx";
import { FormDialog } from "@/components/ui/dialog.tsx";
import { useAppState } from "@/modules/clients/components/app-state.tsx";
import { MonthFigures } from "@/modules/expediente/components/month-figures.tsx";
import { todayISO } from "@/modules/expediente/domain/document-code.ts";
import { figuresForClient } from "@/modules/expediente/domain/month-report.ts";
import { dueDistance, pendingSignerOk } from "@/modules/expediente/domain/requirement-status.ts";
import type { Requirement } from "@/modules/expediente/domain/model.ts";

function formatDay(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es-AR");
}

function monthTitle(yearMonth: string) {
  const [year, month] = yearMonth.split("-");
  const name = new Date(Number(year), Number(month) - 1, 1).toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export default function SignPage() {
  const app = useAppState();
  const today = todayISO();
  const [openId, setOpenId] = useState<string | null>(null);
  const items = app.clients.flatMap((client) =>
    client.areas.flatMap((area) =>
      area.topics.flatMap((topic) =>
        topic.requirements
          .filter(
            (requirement) =>
              pendingSignerOk(requirement) && requirement.current?.firmanteId === app.user?.id,
          )
          .map((requirement) => ({ client, area, requirement })),
      ),
    ),
  );
  const selected = items.find((item) => item.requirement.id === openId) ?? null;

  return (
    <main className="mx-auto max-w-5xl px-4 py-5">
      <BackLink href="/app/gestion">Volver a Gestión Ambiental</BackLink>
      <div className="panel mt-3 px-5 py-5">
        <h1 className="text-3xl font-semibold tracking-tight">Para firmar</h1>
        <p className="mt-1 text-base text-[var(--muted)]">Lo que subió el operario, para validar.</p>
      </div>
      {items.length === 0 ? (
        <p className="mt-6 text-base text-[var(--muted)]">No tenés documentos para validar.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map((item) => (
            <li key={item.requirement.id} className="panel px-4 py-4 text-base">
              <p className="text-[var(--muted)]">
                {item.client.name} · {item.area.name}
              </p>
              <p className="mt-1 text-xl font-semibold">{item.requirement.name}</p>
              <p className="mt-2">Operario: {item.requirement.current?.tecnico ?? "Sin nombre"}</p>
              <Button className="mt-4 h-11 px-4 text-base" onClick={() => setOpenId(item.requirement.id)}>
                Ver y validar
              </Button>
            </li>
          ))}
        </ul>
      )}
      {selected ? (
        <ReviewDialog
          open
          clientId={selected.client.id}
          clientName={selected.client.name}
          requirement={selected.requirement}
          today={today}
          onOpenChange={(open) => {
            if (!open) setOpenId(null);
          }}
          onValidate={() => {
            app.approve(selected.client.id, selected.requirement.id);
            setOpenId(null);
          }}
        />
      ) : null}
    </main>
  );
}

function ReviewDialog({
  open,
  clientId,
  clientName,
  requirement,
  today,
  onOpenChange,
  onValidate,
}: {
  open: boolean;
  clientId: string;
  clientName: string;
  requirement: Requirement;
  today: string;
  onOpenChange: (open: boolean) => void;
  onValidate: () => void;
}) {
  const app = useAppState();
  const current = requirement.current;
  const due = requirement.dueDate;
  const month = (current?.deadline ?? due)?.slice(0, 7);
  const figures = month ? figuresForClient(app.clients, clientId, month, today) : null;
  const vigencia =
    current?.documentDate && due
      ? `Del ${formatDay(current.documentDate)} al ${formatDay(due)}.`
      : due
        ? `Hasta el ${formatDay(due)}.`
        : "Sin fecha de vigencia.";

  return (
    <FormDialog open={open} title={requirement.name} onOpenChange={onOpenChange}>
      <div className="space-y-2 text-base">
        <p>{clientName}</p>
        <p>Operario: {current?.tecnico ?? "Sin nombre"}</p>
        <p>Archivo: {current?.fileName ?? "Sin documento"}</p>
        <p>Vigencia: {vigencia}</p>
        {due ? <p>Vence el {formatDay(due)}. {dueDistance(today, due)}.</p> : <p>Sin fecha de vencimiento.</p>}
        {current?.deadline && current.deadline !== due ? (
          <p>Plazo de esta carga: {formatDay(current.deadline)}.</p>
        ) : null}
      </div>
      {figures && month ? (
        <div className="mt-5">
          <p className="text-base font-semibold">{monthTitle(month)}</p>
          <div className="mt-3">
            <MonthFigures figures={figures} />
          </div>
        </div>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-2">
        <Button className="h-11 px-4 text-base" onClick={onValidate}>
          Validar
        </Button>
        <Button variant="secondary" className="h-11 px-4 text-base" onClick={() => onOpenChange(false)}>
          Cerrar
        </Button>
      </div>
    </FormDialog>
  );
}
