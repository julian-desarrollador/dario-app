import { historyEvent } from "./history.ts";
import type { Actor, Client, RecordVersion, Requirement } from "./model.ts";

export type LifecycleError = "not-found" | "not-deletable" | "not-allowed" | "signer-required";

export type LifecycleResult =
  | { ok: true; clients: Client[] }
  | { ok: false; reason: LifecycleError };

export type FileInput = {
  name: string;
  mime: string;
  dataUrl: string;
  byteLength: number;
};

export type UploadInput = {
  clientId: string;
  requirementId: string;
  actor: Actor;
  signer: { id: string; name: string } | null;
  documentDate: string;
  dueDate?: string;
  code?: string;
  file?: FileInput;
  now: string;
  id: string;
};

const MAX_PERSIST_BYTES = 1.5 * 1024 * 1024;

export function keepsBinary(byteLength: number): boolean {
  return byteLength <= MAX_PERSIST_BYTES;
}

function mapRequirement(
  clients: Client[],
  clientId: string,
  requirementId: string,
  map: (requirement: Requirement) => Requirement,
): { clients: Client[]; found: boolean } {
  let found = false;
  const next = clients.map((client) => {
    if (client.id !== clientId) return client;
    return {
      ...client,
      areas: client.areas.map((area) => ({
        ...area,
        topics: area.topics.map((topic) => ({
          ...topic,
          requirements: topic.requirements.map((requirement) => {
            if (requirement.id !== requirementId) return requirement;
            found = true;
            return map(requirement);
          }),
        })),
      })),
    };
  });
  return { clients: next, found };
}

export function findRequirement(
  clients: Client[],
  clientId: string,
  requirementId: string,
): Requirement | undefined {
  const client = clients.find((item) => item.id === clientId);
  if (!client) return undefined;
  for (const area of client.areas) {
    for (const topic of area.topics) {
      const requirement = topic.requirements.find((item) => item.id === requirementId);
      if (requirement) return requirement;
    }
  }
  return undefined;
}

function nextVersionNumber(requirement: Requirement): number {
  const numbers = [
    requirement.current?.version ?? 0,
    ...requirement.previous.map((version) => version.version),
  ];
  return Math.max(0, ...numbers) + 1;
}

export function canDeleteVersion(version: RecordVersion | undefined): boolean {
  return Boolean(version?.uploaded && !version.firmanteOk);
}

export function canApproveVersion(version: RecordVersion | undefined, actor: Actor): boolean {
  return Boolean(
    actor.role === "firmante" &&
      version?.uploaded &&
      version.firmanteId === actor.id &&
      !version.firmanteOk,
  );
}

/** Uploading onto an approved file opens a new version. The approved one stays in history. */
export function uploadVersion(clients: Client[], input: UploadInput): LifecycleResult {
  const requirement = findRequirement(clients, input.clientId, input.requirementId);
  if (!requirement || requirement.kind !== "file") {
    return { ok: false, reason: "not-found" };
  }
  if (!input.signer && !requirement.current?.firmanteId) {
    return { ok: false, reason: "signer-required" };
  }

  const openingNewVersion = Boolean(requirement.current?.firmanteOk);
  const version: RecordVersion = {
    id: input.id,
    version: openingNewVersion ? nextVersionNumber(requirement) : (requirement.current?.version ?? 1),
    code: input.code ?? requirement.current?.code,
    docKind: requirement.current?.docKind,
    fileName: input.file?.name ?? requirement.current?.fileName,
    fileMime: input.file?.mime ?? requirement.current?.fileMime,
    fileData:
      input.file && keepsBinary(input.file.byteLength)
        ? input.file.dataUrl
        : input.file
          ? undefined
          : requirement.current?.fileData,
    documentDate: input.documentDate,
    uploaded: true,
    tecnico: input.actor.name,
    firmante: input.signer?.name ?? requirement.current?.firmante,
    firmanteId: input.signer?.id ?? requirement.current?.firmanteId,
    firmanteOk: false,
    createdAt: input.now,
  };

  const mapped = mapRequirement(clients, input.clientId, input.requirementId, (current) => ({
    ...current,
    dueDate: input.dueDate || current.dueDate,
    declared: true,
    current: version,
    previous:
      openingNewVersion && current.current
        ? [current.current, ...current.previous]
        : current.previous,
    history: [
      historyEvent(
        openingNewVersion ? "replaced" : "uploaded",
        input.actor,
        openingNewVersion
          ? `Nueva versión ${version.version} por firmar`
          : `Archivo cargado${version.fileName ? `: ${version.fileName}` : ""}`,
        input.now,
        `${input.id}-evt`,
      ),
      ...current.history,
    ],
  }));

  return mapped.found
    ? { ok: true, clients: mapped.clients }
    : { ok: false, reason: "not-found" };
}

export function approveVersion(
  clients: Client[],
  clientId: string,
  requirementId: string,
  actor: Actor,
  now: string,
): LifecycleResult {
  const requirement = findRequirement(clients, clientId, requirementId);
  if (!requirement?.current) return { ok: false, reason: "not-found" };
  if (!canApproveVersion(requirement.current, actor)) {
    return { ok: false, reason: "not-allowed" };
  }

  const mapped = mapRequirement(clients, clientId, requirementId, (current) => ({
    ...current,
    current: current.current ? { ...current.current, firmanteOk: true } : current.current,
    history: [
      historyEvent("approved", actor, "OK del firmante", now, `${current.current?.id ?? requirementId}-ok`),
      ...current.history,
    ],
  }));
  return { ok: true, clients: mapped.clients };
}

export function deletePendingVersion(
  clients: Client[],
  clientId: string,
  requirementId: string,
  actor: Actor,
  now: string,
): LifecycleResult {
  const requirement = findRequirement(clients, clientId, requirementId);
  if (!requirement) return { ok: false, reason: "not-found" };
  if (!canDeleteVersion(requirement.current)) return { ok: false, reason: "not-deletable" };

  const mapped = mapRequirement(clients, clientId, requirementId, (current) => {
    const [restored, ...older] = current.previous;
    return {
      ...current,
      current: restored,
      previous: older,
      history: [
        historyEvent("deleted", actor, "Versión pendiente eliminada", now, `${current.current?.id ?? requirementId}-del`),
        ...current.history,
      ],
    };
  });
  return { ok: true, clients: mapped.clients };
}

export function toggleTask(clients: Client[], clientId: string, requirementId: string): Client[] {
  return mapRequirement(clients, clientId, requirementId, (requirement) =>
    requirement.kind === "task"
      ? { ...requirement, taskDone: !requirement.taskDone }
      : requirement,
  ).clients;
}
