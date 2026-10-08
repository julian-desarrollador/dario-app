import type { Client, Requirement, TramiteStatus } from "./model.ts";
import { clientRequirements } from "./progress.ts";
import { deriveStatus, pendingSignerOk } from "./requirement-status.ts";

export type ConsultoraNote = {
  id: string;
  title: string;
  body: string;
  href?: string;
};

export type ExpedienteRow = {
  clientId: string;
  clientName: string;
  areaId: string;
  areaName: string;
  topicId: string;
  topicName: string;
  expediente: string;
  tramite?: TramiteStatus;
  renovacion?: string;
};

export type DueItem = {
  clientId: string;
  clientName: string;
  areaId: string;
  areaName: string;
  requirement: Requirement;
};

export type MonthGroup = {
  month: number;
  items: DueItem[];
};

const TRAMITE_KEYS: TramiteStatus[] = [
  "en-tramite",
  "con-notificacion",
  "con-renovacion",
  "finalizado-sin-renovacion",
];

function walk(clients: Client[], include: (requirement: Requirement) => boolean): DueItem[] {
  const items: DueItem[] = [];
  for (const client of clients) {
    for (const area of client.areas) {
      for (const topic of area.topics) {
        for (const requirement of topic.requirements) {
          if (!include(requirement)) continue;
          items.push({
            clientId: client.id,
            clientName: client.name,
            areaId: area.id,
            areaName: area.name,
            requirement,
          });
        }
      }
    }
  }
  return items;
}

export function novedadesNotes(clients: Client[], today: string): ConsultoraNote[] {
  const requirements = clients.flatMap(clientRequirements);
  const expired = requirements.filter((item) => deriveStatus(item, today) === "expired").length;
  const unsigned = requirements.filter(pendingSignerOk).length;
  const enTramite = listExpedientes(clients).filter((row) => row.tramite === "en-tramite").length;
  const notes: ConsultoraNote[] = [];

  if (expired > 0) {
    notes.push({
      id: "expired",
      title: "Vencidos",
      body: expired === 1 ? "Hay 1 documento vencido." : `Hay ${expired} documentos vencidos.`,
      href: "/app/documentacion",
    });
  }
  if (unsigned > 0) {
    notes.push({
      id: "unsigned",
      title: "Por firmar",
      body: unsigned === 1 ? "Hay 1 documento por firmar." : `Hay ${unsigned} documentos por firmar.`,
      href: "/app/documentacion",
    });
  }
  if (enTramite > 0) {
    notes.push({
      id: "tramite",
      title: "En trámite",
      body: enTramite === 1 ? "Hay 1 expediente en trámite." : `Hay ${enTramite} expedientes en trámite.`,
      href: "/app/gestion",
    });
  }
  if (notes.length === 0) {
    notes.push({
      id: "welcome",
      title: "Bienvenida",
      body: "No hay avisos. Desde acá se entra a los expedientes y a la hoja de inspección.",
    });
  }
  return notes;
}

export function listExpedientes(clients: Client[]): ExpedienteRow[] {
  const rows: ExpedienteRow[] = [];
  for (const client of clients) {
    for (const area of client.areas) {
      for (const topic of area.topics) {
        const expediente = topic.expediente?.trim();
        if (!expediente) continue;
        rows.push({
          clientId: client.id,
          clientName: client.name,
          areaId: area.id,
          areaName: area.name,
          topicId: topic.id,
          topicName: topic.name,
          expediente,
          tramite: topic.tramite,
          renovacion: topic.renovacion,
        });
      }
    }
  }
  return rows;
}

export function countTramites(clients: Client[]): Record<TramiteStatus, number> {
  const counts: Record<TramiteStatus, number> = {
    "en-tramite": 0,
    "con-notificacion": 0,
    "con-renovacion": 0,
    "finalizado-sin-renovacion": 0,
  };
  for (const row of listExpedientes(clients)) {
    if (row.tramite && TRAMITE_KEYS.includes(row.tramite)) counts[row.tramite] += 1;
  }
  return counts;
}

export function dueYears(clients: Client[], today: string): string[] {
  const years = new Set<string>([today.slice(0, 4)]);
  for (const item of walk(clients, (requirement) => Boolean(requirement.dueDate))) {
    const year = item.requirement.dueDate?.slice(0, 4);
    if (year) years.add(year);
  }
  return [...years].sort();
}

export function dueInYear(clients: Client[], year: string): MonthGroup[] {
  const items = walk(clients, (requirement) => Boolean(requirement.dueDate?.startsWith(`${year}-`)));
  items.sort((a, b) => (a.requirement.dueDate ?? "").localeCompare(b.requirement.dueDate ?? ""));
  const groups = new Map<number, DueItem[]>();
  for (const item of items) {
    const month = Number(item.requirement.dueDate?.slice(5, 7));
    const list = groups.get(month) ?? [];
    list.push(item);
    groups.set(month, list);
  }
  return [...groups.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([month, group]) => ({ month, items: group }));
}

export function listDocuments(clients: Client[]): DueItem[] {
  return walk(clients, (requirement) => requirement.kind === "file").sort((a, b) => {
    const left = a.requirement.dueDate ?? "9999-99-99";
    const right = b.requirement.dueDate ?? "9999-99-99";
    if (left !== right) return left.localeCompare(right);
    return a.requirement.name.localeCompare(b.requirement.name, "es");
  });
}
