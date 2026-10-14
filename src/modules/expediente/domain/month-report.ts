import type { Client, RecordVersion, Requirement } from "./model.ts";
import { DUE_SOON_DAYS, daysUntil } from "./requirement-status.ts";

export type ScheduleTiming = "on-time" | "late" | "unspecified";

export type ScheduleItem = {
  id: string;
  clientId: string;
  clientName: string;
  areaId: string;
  areaName: string;
  requirement: Requirement;
  /** YYYY-MM-DD. The deadline this row is about. */
  deadline: string;
  done: boolean;
  timing?: ScheduleTiming;
};

export type MonthFigures = {
  done: number;
  onTime: number;
  late: number;
  pending: number;
  dueSoon: number;
  expired: number;
};

export type MonthSchedule = {
  month: number;
  pending: ScheduleItem[];
  done: ScheduleItem[];
};

function dayOf(value: string): string {
  return value.slice(0, 10);
}

function timingOf(doneOn: string, deadline: string): Exclude<ScheduleTiming, "unspecified"> {
  return dayOf(doneOn) <= deadline ? "on-time" : "late";
}

function filedVersions(requirement: Requirement): RecordVersion[] {
  return [requirement.current, ...requirement.previous].flatMap((version) =>
    version?.uploaded && version.deadline ? [version] : [],
  );
}

/** Every control that belongs on the calendar, grouped later by its deadline month. */
export function scheduleItems(clients: Client[]): ScheduleItem[] {
  const items: ScheduleItem[] = [];
  for (const client of clients) {
    for (const area of client.areas) {
      for (const topic of area.topics) {
        for (const requirement of topic.requirements) {
          const base = {
            clientId: client.id,
            clientName: client.name,
            areaId: area.id,
            areaName: area.name,
            requirement,
          };
          if (requirement.kind === "task") {
            if (!requirement.dueDate) continue;
            const done = Boolean(requirement.taskDone);
            items.push({
              ...base,
              id: `task-${requirement.id}`,
              deadline: requirement.dueDate,
              done,
              timing: done
                ? requirement.doneAt
                  ? timingOf(requirement.doneAt, requirement.dueDate)
                  : "unspecified"
                : undefined,
            });
            continue;
          }

          const versions = filedVersions(requirement);
          for (const version of versions) {
            if (!version.deadline) continue;
            items.push({
              ...base,
              id: version.id,
              deadline: version.deadline,
              done: true,
              timing: timingOf(version.createdAt, version.deadline),
            });
          }
          if (!requirement.dueDate) continue;
          if (versions.some((version) => version.deadline === requirement.dueDate)) continue;
          const legacy = requirement.current;
          const legacyDone = Boolean(legacy?.uploaded && !legacy.deadline);
          items.push({
            ...base,
            id: legacyDone ? legacy!.id : `pending-${requirement.id}`,
            deadline: requirement.dueDate,
            done: legacyDone,
            timing: legacyDone ? "unspecified" : undefined,
          });
        }
      }
    }
  }
  items.sort((a, b) => {
    if (a.deadline !== b.deadline) return a.deadline.localeCompare(b.deadline);
    return a.requirement.name.localeCompare(b.requirement.name, "es");
  });
  return items;
}

export function scheduleMonths(clients: Client[], today: string): string[] {
  const months = new Set<string>([today.slice(0, 7)]);
  for (const item of scheduleItems(clients)) months.add(item.deadline.slice(0, 7));
  return [...months].sort();
}

export function scheduleYears(clients: Client[], today: string): string[] {
  const years = new Set(scheduleMonths(clients, today).map((month) => month.slice(0, 4)));
  return [...years].sort();
}

export function scheduleInYear(clients: Client[], year: string): MonthSchedule[] {
  const groups = new Map<number, { pending: ScheduleItem[]; done: ScheduleItem[] }>();
  for (const item of scheduleItems(clients)) {
    if (!item.deadline.startsWith(`${year}-`)) continue;
    const month = Number(item.deadline.slice(5, 7));
    const group = groups.get(month) ?? { pending: [], done: [] };
    if (item.done) group.done.push(item);
    else group.pending.push(item);
    groups.set(month, group);
  }
  return [...groups.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([month, group]) => ({ month, pending: group.pending, done: group.done }));
}

export function monthFigures(items: ScheduleItem[], today: string): MonthFigures {
  const figures: MonthFigures = { done: 0, onTime: 0, late: 0, pending: 0, dueSoon: 0, expired: 0 };
  for (const item of items) {
    if (item.done) {
      figures.done += 1;
      if (item.timing === "on-time") figures.onTime += 1;
      if (item.timing === "late") figures.late += 1;
      continue;
    }
    figures.pending += 1;
    if (item.deadline < today) figures.expired += 1;
    else if (daysUntil(today, item.deadline) <= DUE_SOON_DAYS) figures.dueSoon += 1;
  }
  return figures;
}

export function scheduleForClientMonth(
  clients: Client[],
  clientId: string,
  yearMonth: string,
): { pending: ScheduleItem[]; done: ScheduleItem[] } {
  const pending: ScheduleItem[] = [];
  const done: ScheduleItem[] = [];
  for (const item of scheduleItems(clients)) {
    if (item.clientId !== clientId || !item.deadline.startsWith(yearMonth)) continue;
    if (item.done) done.push(item);
    else pending.push(item);
  }
  return { pending, done };
}

export function figuresForClient(
  clients: Client[],
  clientId: string,
  yearMonth: string,
  today: string,
): MonthFigures {
  const items = scheduleItems(clients).filter(
    (item) => item.clientId === clientId && item.deadline.startsWith(yearMonth),
  );
  return monthFigures(items, today);
}
