import { areaCodes, initialAreas } from "../../expediente/catalog.ts";
import type { LegacyArea, LegacyCheck, LegacyDoc } from "../../expediente/domain/legacy.ts";
import type { Client, Requirement, Topic } from "../../expediente/domain/model.ts";

export type ClientProfile = {
  id: string;
  name: string;
  industry: string;
  province: string;
  municipality: string;
  enablingYear: string;
};

export const DEMO_CLIENT: ClientProfile = {
  id: "planta-demo",
  name: "Planta demo",
  industry: "Alimenticia",
  province: "Córdoba",
  municipality: "Córdoba",
  enablingYear: "2025",
};

const DATE_IN_TEXT = /(\d{2})\/(\d{2})\/(\d{4})/;

export function dueDateFromText(detail: string): string | undefined {
  const match = detail.match(DATE_IN_TEXT);
  if (!match) return undefined;
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\b(vigente|al dia|actualizado|actualizada)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function checklistDuplicatesDoc(check: LegacyCheck, docs: LegacyDoc[]) {
  const label = normalize(check.label);
  return docs.some((doc) => {
    const name = normalize(doc.name);
    return label.includes(name) || name.includes(label);
  });
}

function fileRequirement(doc: LegacyDoc): Requirement {
  const dueDate = dueDateFromText(doc.detail);
  const versionNumber = Number(doc.version?.replace(/\D/g, "") ?? "0") + 1;
  const hasFile = Boolean(doc.fileName || doc.fileData || doc.uploaded);
  return {
    id: doc.id,
    name: doc.code ? doc.name : doc.name,
    kind: "file",
    detail: doc.detail,
    href: doc.href,
    dueDate,
    declared: doc.status !== "missing" || hasFile,
    current: hasFile || doc.code || doc.uploaded
      ? {
          id: `${doc.id}-v`,
          version: Number.isFinite(versionNumber) ? versionNumber : 1,
          code: doc.code,
          docKind: doc.docKind,
          fileName: doc.fileName,
          fileMime: doc.fileMime,
          fileData: doc.fileData,
          documentDate: doc.documentDate,
          uploaded: doc.uploaded === true,
          tecnico: doc.tecnico,
          firmante: doc.firmante,
          firmanteId: doc.firmanteId,
          firmanteOk: doc.firmanteOk === true,
          createdAt: doc.updateDate ?? doc.documentDate ?? "2026-09-01",
        }
      : undefined,
    previous: [],
    history: [],
  };
}

function taskRequirement(check: LegacyCheck): Requirement {
  return {
    id: check.id,
    name: check.label,
    kind: "task",
    taskDone: check.done,
    previous: [],
    history: [],
  };
}

export function legacyAreasToClient(areas: LegacyArea[], profile: ClientProfile): Client {
  return {
    ...profile,
    areas: areas.map((area) => ({
      id: area.id,
      name: area.name,
      kind: area.kind,
      pillar: area.pillar,
      topics: area.subAreas.map((sub): Topic => ({
        id: sub.id,
        name: sub.name,
        requirements: [
          ...sub.docs.map((doc) => fileRequirement(doc)),
          ...sub.checklist
            .filter((check) => !checklistDuplicatesDoc(check, sub.docs))
            .map(taskRequirement),
        ],
      })),
    })),
  };
}

export function seedClients(): Client[] {
  return [legacyAreasToClient(initialAreas, DEMO_CLIENT)];
}

export function areaCodeFor(areaId: string) {
  return areaCodes[areaId] ?? "GEN";
}

export function templateAreas(clientId: string): Client["areas"] {
  const seed = legacyAreasToClient(initialAreas, { ...DEMO_CLIENT, id: clientId });
  return seed.areas.map((area) => ({
    ...area,
    topics: area.topics.map((topic) => ({
      ...topic,
      id: `${clientId}__${topic.id}`,
      requirements: topic.requirements.map((requirement) => ({
        id: `${clientId}__${requirement.id}`,
        name: requirement.name,
        kind: requirement.kind,
        href: requirement.href,
        taskDone: false,
        declared: false,
        previous: [],
        history: [],
      })),
    })),
  }));
}

export function createClient(
  clients: Client[],
  input: Omit<Client, "areas">,
): Client[] {
  return [...clients, { ...input, areas: templateAreas(input.id) }];
}

export function updateClient(
  clients: Client[],
  id: string,
  input: Omit<Client, "id" | "areas">,
): Client[] {
  return clients.map((client) => (client.id === id ? { ...client, ...input } : client));
}

export function deleteClient(clients: Client[], id: string): Client[] {
  return clients.filter((client) => client.id !== id);
}
