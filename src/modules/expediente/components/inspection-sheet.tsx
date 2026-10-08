"use client";

import { Button } from "@/components/ui/button.tsx";
import { StatusGlance } from "@/modules/expediente/components/status-summary.tsx";
import { todayISO } from "@/modules/expediente/domain/document-code.ts";
import { statusLabel, tramiteLabel } from "@/modules/expediente/domain/labels.ts";
import type { Client, Requirement } from "@/modules/expediente/domain/model.ts";
import {
  clientRequirements,
  countByStatus,
  pendingOkCount,
} from "@/modules/expediente/domain/progress.ts";
import { deriveStatus, dueDistance, pendingSignerOk } from "@/modules/expediente/domain/requirement-status.ts";

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es-AR");
}

function DocumentLine({ requirement, today }: { requirement: Requirement; today: string }) {
  if (requirement.kind === "task") {
    return (
      <div className="panel text-base px-4 py-4">
        <p className="font-medium">{requirement.name}</p>
        <p className="mt-1">{requirement.taskDone ? "Hecho" : "Pendiente"}</p>
      </div>
    );
  }

  const loaded = Boolean(requirement.current?.fileName);
  const status = deriveStatus(requirement, today);
  const signed = requirement.current?.firmanteOk
    ? "Firmado"
    : pendingSignerOk(requirement)
      ? "Por firmar"
      : null;

  return (
    <div className="panel text-base px-4 py-4">
      <p className="font-medium">{requirement.name}</p>
      <p className="mt-1 font-semibold">{loaded ? "Documento cargado" : "Sin documento"}</p>
      {loaded ? <p className="mt-1">{requirement.current?.fileName}</p> : null}
      {requirement.dueDate ? (
        <p className="mt-1">
          Vence el {formatDate(requirement.dueDate)} · {dueDistance(today, requirement.dueDate)}
        </p>
      ) : null}
      <p className="mt-1">{statusLabel(status)}</p>
      {signed ? <p className="mt-1">{signed}</p> : null}
    </div>
  );
}

export function InspectionSheet({ client }: { client: Client }) {
  const today = todayISO();
  const requirements = clientRequirements(client);

  return (
    <article>
      <div className="panel flex flex-wrap items-start justify-between gap-3 px-5 py-5">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{client.name}</h1>
          <p className="mt-1 text-base text-[var(--muted)]">
            {client.industry} · {client.province} · {client.municipality} · {client.enablingYear}
          </p>
          <p className="mt-1 text-base font-semibold">Estado al {formatDate(today)}</p>
        </div>
        <Button type="button" className="no-print h-11 px-4 text-base" onClick={() => window.print()}>
          Imprimir
        </Button>
      </div>

      <div className="mt-4">
        <StatusGlance
          counts={countByStatus(requirements, today)}
          unsigned={pendingOkCount(requirements)}
        />
      </div>

      <div className="mt-8 space-y-10">
        {client.areas.map((area, index) => (
          <section key={area.id} className={index === 0 ? undefined : "print-break"}>
            <h2 className="text-2xl font-semibold tracking-tight">{area.name}</h2>
            <div className="mt-4 space-y-8">
              {area.topics.map((topic) => {
                const filed = topic.expediente?.trim() ?? "";
                return (
                  <div key={topic.id}>
                    <h3 className="text-2xl font-semibold tracking-tight">{topic.name}</h3>
                    {filed ? (
                      <p className="mt-2 text-2xl font-semibold tracking-tight">Expediente {filed}</p>
                    ) : (
                      <p className="mt-2 text-base font-semibold">Sin expediente</p>
                    )}
                    {filed || topic.tramite || topic.renovacion ? (
                      <p className="mt-1 text-base">{tramiteLabel(topic.tramite)}</p>
                    ) : null}
                    {topic.renovacion ? (
                      <p className="mt-1 text-base">Renueva el {formatDate(topic.renovacion)}</p>
                    ) : null}
                    <ul className="mt-3 space-y-4">
                      {topic.requirements.map((requirement) => (
                        <li key={requirement.id}>
                          <DocumentLine requirement={requirement} today={today} />
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
