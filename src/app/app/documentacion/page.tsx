"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppState } from "@/modules/clients/components/app-state.tsx";
import { todayISO } from "@/modules/expediente/domain/document-code.ts";
import { statusLabel } from "@/modules/expediente/domain/labels.ts";
import { listDocuments } from "@/modules/expediente/domain/overview.ts";
import type { RequirementStatus } from "@/modules/expediente/domain/model.ts";
import { deriveStatus, pendingSignerOk } from "@/modules/expediente/domain/requirement-status.ts";

const ESTADOS: { id: "" | RequirementStatus | "unsigned"; label: string }[] = [
  { id: "", label: "Todos" },
  { id: "expired", label: "Vencido" },
  { id: "due-soon", label: "Por vencer" },
  { id: "missing", label: "Falta" },
  { id: "ok", label: "Al día" },
  { id: "unsigned", label: "Por firmar" },
];

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es-AR");
}

export default function DocumentacionPage() {
  const app = useAppState();
  const today = todayISO();
  const documents = listDocuments(app.clients);
  const [clientId, setClientId] = useState("");
  const [estado, setEstado] = useState<(typeof ESTADOS)[number]["id"]>("");
  const visible = documents.filter((item) => {
    if (clientId && item.clientId !== clientId) return false;
    if (!estado) return true;
    if (estado === "unsigned") return pendingSignerOk(item.requirement);
    return deriveStatus(item.requirement, today) === estado;
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <div className="panel px-5 py-5">
        <h1 className="text-3xl font-semibold tracking-tight">Documentación</h1>
        <p className="mt-1 text-base text-[var(--muted)]">Archivos ordenados por vencimiento.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-base" htmlFor="filtro-empresa">
            Empresa
            <select
              id="filtro-empresa"
              value={clientId}
              onChange={(event) => setClientId(event.target.value)}
              className="mt-2 h-11 w-full rounded-lg border border-[var(--ink)]/15 px-3 text-base"
            >
              <option value="">Todas</option>
              {app.clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-base" htmlFor="filtro-estado">
            Estado
            <select
              id="filtro-estado"
              value={estado}
              onChange={(event) => setEstado(event.target.value as (typeof ESTADOS)[number]["id"])}
              className="mt-2 h-11 w-full rounded-lg border border-[var(--ink)]/15 px-3 text-base"
            >
              {ESTADOS.map((option) => (
                <option key={option.label} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="mt-6 text-base">No hay documentos con ese filtro.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {visible.map((item) => {
            const loaded = Boolean(item.requirement.current?.fileName);
            const status = deriveStatus(item.requirement, today);
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
                  <span className="mt-1 block font-semibold">
                    {loaded ? "Documento cargado" : "Sin documento"}
                  </span>
                  {item.requirement.dueDate ? (
                    <span className="mt-1 block">Vence el {formatDate(item.requirement.dueDate)}</span>
                  ) : null}
                  <span className="mt-1 block">{statusLabel(status)}</span>
                  {pendingSignerOk(item.requirement) ? (
                    <span className="mt-1 block">Por firmar</span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
