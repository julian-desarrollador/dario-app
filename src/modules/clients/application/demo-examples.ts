import { historyEvent } from "../../expediente/domain/history.ts";
import type { Client, RecordVersion, Requirement } from "../../expediente/domain/model.ts";

const ON_TIME = [
  { id: "g-d1", fileName: "ejemplo-chimeneas.pdf" },
  { id: "hs-d4", fileName: "ejemplo-ruido.pdf" },
] as const;

const LATE = { id: "e-d2", fileName: "ejemplo-laboratorio.pdf" };
const DUE_SOON_TASK = "hs8";

function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T12:00:00`);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function exampleVersion(requirementId: string, fileName: string, deadline: string, created: string): RecordVersion {
  return {
    id: `ejemplo-${requirementId}`,
    version: 0,
    fileName,
    fileMime: "application/pdf",
    documentDate: created,
    deadline,
    uploaded: true,
    tecnico: "Dario",
    firmante: "Firmante",
    firmanteId: "firmante",
    firmanteOk: true,
    createdAt: `${created}T12:00:00.000Z`,
  };
}

function withExample(requirement: Requirement, today: string): Requirement {
  const yearMonth = today.slice(0, 7);
  const onTime = ON_TIME.find((item) => item.id === requirement.id);
  if (onTime && requirement.kind === "file") {
    const deadline = `${yearMonth}-28`;
    const created = addDays(deadline, -2);
    return attach(requirement, exampleVersion(requirement.id, onTime.fileName, deadline, created), "Ejemplo cargado a tiempo", created);
  }
  if (requirement.id === LATE.id && requirement.kind === "file") {
    const deadline = `${yearMonth}-10`;
    const created = addDays(deadline, 3);
    return attach(requirement, exampleVersion(requirement.id, LATE.fileName, deadline, created), "Ejemplo cargado fuera de tiempo", created);
  }
  if (requirement.id === DUE_SOON_TASK && requirement.kind === "task") {
    return { ...requirement, dueDate: addDays(today, 10), taskDone: false, doneAt: undefined };
  }
  return requirement;
}

function attach(requirement: Requirement, version: RecordVersion, summary: string, created: string): Requirement {
  return {
    ...requirement,
    previous: [version, ...requirement.previous],
    history: [
      historyEvent(
        "uploaded",
        { id: "dario", name: "Dario", role: "tecnico" },
        summary,
        `${created}T12:00:00.000Z`,
        `${version.id}-evt`,
      ),
      ...requirement.history,
    ],
  };
}

/** One-time sample rows so the monthly report is not all zeros. Leaves the live file untouched. */
export function addScheduleExamples(client: Client, today: string): Client {
  if (client.demoExamples != null) return client;
  return {
    ...client,
    demoExamples: 1,
    areas: client.areas.map((area) => ({
      ...area,
      topics: area.topics.map((topic) => ({
        ...topic,
        requirements: topic.requirements.map((requirement) => withExample(requirement, today)),
      })),
    })),
  };
}
