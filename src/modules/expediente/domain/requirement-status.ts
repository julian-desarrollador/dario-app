import type { Requirement, RequirementStatus } from "./model.ts";

export const DUE_SOON_DAYS = 30;

function daysUntil(today: string, due: string): number {
  const start = new Date(`${today}T12:00:00`);
  const end = new Date(`${due}T12:00:00`);
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}

function hasVigentFile(requirement: Requirement): boolean {
  if (requirement.declared) return true;
  const current = requirement.current;
  if (current && (current.fileName || current.fileData)) return true;
  return requirement.previous.some(
    (version) => version.firmanteOk && (version.fileName || version.fileData),
  );
}

/** Status comes from the due date and whether there is evidence. It is not chosen by hand. */
export function deriveStatus(requirement: Requirement, today: string): RequirementStatus {
  if (requirement.kind === "task") {
    if (!requirement.taskDone) {
      if (requirement.dueDate && requirement.dueDate < today) return "expired";
      return "missing";
    }
    return "ok";
  }

  if (!hasVigentFile(requirement)) {
    if (requirement.dueDate && requirement.dueDate < today) return "expired";
    return "missing";
  }

  if (!requirement.dueDate) return "ok";
  if (requirement.dueDate < today) return "expired";
  if (daysUntil(today, requirement.dueDate) <= DUE_SOON_DAYS) return "due-soon";
  return "ok";
}

export function isFulfilled(status: RequirementStatus): boolean {
  return status === "ok" || status === "due-soon";
}

export function pendingSignerOk(requirement: Requirement): boolean {
  const current = requirement.current;
  return Boolean(current?.uploaded && !current.firmanteOk);
}
