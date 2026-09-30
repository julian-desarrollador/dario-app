"use client";

import { useState } from "react";
import { AlertTriangle, Check, CircleDashed, Clock3 } from "lucide-react";
import { ConfirmDialog, FormDialog } from "@/components/ui/dialog.tsx";
import { ActionMenu, ActionMenuItem } from "@/components/ui/menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useAppState } from "@/modules/clients/components/app-state.tsx";
import { areaCodes, docKindLabels, ACCEPT_FILES } from "@/modules/expediente/catalog.ts";
import {
  buildDocCode,
  nextDocumentSequence,
  todayISO,
} from "@/modules/expediente/domain/document-code.ts";
import { areaRequirements } from "@/modules/expediente/domain/progress.ts";
import { statusLabel } from "@/modules/expediente/domain/labels.ts";
import type { Requirement, RequirementStatus } from "@/modules/expediente/domain/model.ts";
import { deriveStatus, pendingSignerOk } from "@/modules/expediente/domain/requirement-status.ts";
import {
  canApproveVersion,
  canDeleteVersion,
} from "@/modules/expediente/domain/record-lifecycle.ts";

const statusClass: Record<RequirementStatus, string> = {
  ok: "bg-[var(--mist)] text-[var(--moss)]",
  "due-soon": "bg-[#f8efd4] text-[#8a5a00]",
  expired: "bg-[#f7e8df] text-[var(--alert)]",
  missing: "bg-white text-[var(--muted)] ring-1 ring-[var(--ink)]/12",
};

function StatusIcon({ status }: { status: RequirementStatus }) {
  if (status === "ok") return <Check className="size-3.5" aria-hidden />;
  if (status === "due-soon") return <Clock3 className="size-3.5" aria-hidden />;
  if (status === "expired") return <AlertTriangle className="size-3.5" aria-hidden />;
  return <CircleDashed className="size-3.5" aria-hidden />;
}

export function StatusBadge({ status }: { status: RequirementStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${statusClass[status]}`}
    >
      <StatusIcon status={status} />
      {statusLabel(status)}
    </span>
  );
}

export function RequirementCard({
  clientId,
  areaId,
  requirement,
}: {
  clientId: string;
  areaId: string;
  requirement: Requirement;
}) {
  const app = useAppState();
  const today = todayISO();
  const status = deriveStatus(requirement, today);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const current = requirement.current;
  const canDelete = canDeleteVersion(current);
  const canApprove = app.user ? canApproveVersion(current, app.user) : false;

  if (requirement.kind === "task") {
    return (
      <button
        type="button"
        onClick={() => app.toggle(clientId, requirement.id)}
        className="flex w-full items-start gap-3 rounded-2xl bg-white px-4 py-3 text-left ring-1 ring-[var(--ink)]/8"
      >
        <span
          className={`mt-0.5 flex size-5 items-center justify-center rounded-full text-[10px] ${
            requirement.taskDone ? "bg-[var(--moss)] text-white" : "ring-1 ring-[var(--ink)]/25"
          }`}
        >
          {requirement.taskDone ? "✓" : ""}
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block text-base ${requirement.taskDone ? "text-[var(--muted)] line-through" : ""}`}>
            {requirement.name}
          </span>
        </span>
        <StatusBadge status={status} />
      </button>
    );
  }

  const due = requirement.dueDate
    ? new Date(`${requirement.dueDate}T12:00:00`).toLocaleDateString("es-AR")
    : null;
  const loaded = Boolean(current?.fileName);

  return (
    <article className="rounded-2xl bg-white px-4 py-4 ring-1 ring-[var(--ink)]/8">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-medium">{requirement.name}</h3>
          <p className="mt-2 text-base font-semibold">
            {loaded ? "Documento cargado" : "Sin documento"}
          </p>
          {loaded ? <p className="mt-1 text-base">{current?.fileName}</p> : null}
          {due ? <p className="mt-1 text-base">Vence el {due}</p> : null}
          {current?.tecnico ? (
            <p className="mt-1 text-base text-[var(--muted)]">Técnico: {current.tecnico}</p>
          ) : null}
          {pendingSignerOk(requirement) ? (
            <p className="mt-1 text-base font-medium text-[var(--moss)]">Por firmar</p>
          ) : null}
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button className="h-11 px-4 text-base" onClick={() => setUploadOpen(true)}>
          {loaded ? "Cambiar documento" : "Cargar documento"}
        </Button>
        {loaded ? (
          <Button
            variant="secondary"
            className="h-11 px-4 text-base"
            onClick={() => app.download(requirement)}
          >
            Descargar
          </Button>
        ) : null}
        {canApprove ? (
          <Button
            variant="secondary"
            className="h-11 px-4 text-base"
            onClick={() => app.approve(clientId, requirement.id)}
          >
            Dar OK
          </Button>
        ) : null}
        {current?.firmanteOk ? (
          <span className="inline-flex items-center rounded-full bg-[var(--mist)] px-3 text-base font-medium text-[var(--moss)]">
            OK del firmante
          </span>
        ) : null}
        {canDelete ? (
          <ActionMenu label="Más">
            <ActionMenuItem destructive onClick={() => setConfirmOpen(true)}>
              Eliminar
            </ActionMenuItem>
          </ActionMenu>
        ) : null}
      </div>
      {requirement.history.length > 0 ? (
        <ul className="mt-3 space-y-1 border-t border-[var(--ink)]/8 pt-3 text-xs text-[var(--muted)]">
          {requirement.history.slice(0, 3).map((event) => (
            <li key={event.id}>
              {new Date(event.at).toLocaleString("es-AR")} · {event.actorName} · {event.summary}
            </li>
          ))}
        </ul>
      ) : null}
      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        clientId={clientId}
        areaId={areaId}
        requirement={requirement}
      />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Eliminar esta versión"
        description="Se borra la versión que todavía no tiene OK. Si había una aprobada, vuelve a quedar esa."
        confirmLabel="Eliminar"
        onConfirm={() => app.removePending(clientId, requirement.id)}
      />
    </article>
  );
}

function UploadDialog({
  open,
  onOpenChange,
  clientId,
  areaId,
  requirement,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  areaId: string;
  requirement: Requirement;
}) {
  const app = useAppState();
  const [file, setFile] = useState<File | null>(null);
  const [documentDate, setDocumentDate] = useState(todayISO());
  const [dueDate, setDueDate] = useState(requirement.dueDate ?? "");
  const [firmanteId, setFirmanteId] = useState(
    requirement.current?.firmanteId ?? app.signers[0]?.id ?? "",
  );
  const [advanced, setAdvanced] = useState(false);
  const [code, setCode] = useState(requirement.current?.code ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const area = app.clients
    .find((item) => item.id === clientId)
    ?.areas.find((item) => item.id === areaId);
  const usedCodes = area
    ? areaRequirements(area).flatMap((item) =>
        [item.current, ...item.previous].flatMap((version) => (version?.code ? [version.code] : [])),
      )
    : [];
  const autoCode = buildDocCode({
    kind: requirement.current?.docKind ?? "D",
    areaCode: areaCodes[areaId] ?? "GEN",
    sequence: nextDocumentSequence(usedCodes),
    dateISO: documentDate || todayISO(),
  });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!file && !requirement.current?.fileName) {
      setError("Elegí un archivo.");
      return;
    }
    const signer = app.signers.find((item) => item.id === firmanteId) ?? null;
    if (!signer) {
      setError("Elegí un firmante.");
      return;
    }
    setBusy(true);
    try {
      await app.upload({
        clientId,
        areaId,
        requirementId: requirement.id,
        signer,
        documentDate,
        dueDate: dueDate || undefined,
        code: advanced && code.trim() ? code.trim() : undefined,
        file: file ?? undefined,
      });
      onOpenChange(false);
    } catch {
      setError("No se pudo leer el archivo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={requirement.current?.fileName ? "Cambiar documento" : "Cargar documento"}
      description={requirement.name}
    >
      <form onSubmit={submit} className="space-y-3">
        <label className="block text-sm">
          Archivo
          <input
            type="file"
            accept={ACCEPT_FILES}
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            Fecha del documento
            <input
              type="date"
              value={documentDate}
              onChange={(event) => setDocumentDate(event.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--ink)]/12 px-2 py-1.5"
            />
          </label>
          <label className="block text-sm">
            Vencimiento
            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--ink)]/12 px-2 py-1.5"
            />
          </label>
        </div>
        <label className="block text-sm">
          Firmante
          <select
            value={firmanteId}
            onChange={(event) => setFirmanteId(event.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--ink)]/12 px-2 py-1.5"
          >
            {app.signers.map((signer) => (
              <option key={signer.id} value={signer.id}>
                {signer.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="text-sm font-medium text-[var(--moss)]"
          onClick={() => setAdvanced((value) => !value)}
        >
          {advanced ? "Ocultar opciones avanzadas" : "Opciones avanzadas"}
        </button>
        {advanced ? (
          <label className="block text-sm">
            Código ({docKindLabels.D})
            <input
              value={code || autoCode}
              onChange={(event) => setCode(event.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--ink)]/12 px-2 py-1.5 font-mono text-sm"
            />
          </label>
        ) : null}
        {error ? <p className="text-sm text-[var(--alert)]">{error}</p> : null}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" disabled={busy}>
            {busy ? "Guardando…" : "Guardar"}
          </Button>
        </div>
      </form>
    </FormDialog>
  );
}
