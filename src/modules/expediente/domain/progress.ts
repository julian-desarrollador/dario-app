import type { Area, Client, Requirement, RequirementStatus } from "./model.ts";
import { deriveStatus, isFulfilled, pendingSignerOk } from "./requirement-status.ts";

export function areaRequirements(area: Area): Requirement[] {
  return area.topics.flatMap((topic) => topic.requirements);
}

export function clientRequirements(client: Client): Requirement[] {
  return client.areas.flatMap(areaRequirements);
}

export function countByStatus(requirements: Requirement[], today: string) {
  const counts: Record<RequirementStatus, number> = {
    missing: 0,
    expired: 0,
    "due-soon": 0,
    ok: 0,
  };
  for (const requirement of requirements) {
    counts[deriveStatus(requirement, today)] += 1;
  }
  return counts;
}

export function progressPercent(requirements: Requirement[], today: string): number {
  if (requirements.length === 0) return 0;
  const fulfilled = requirements.filter((requirement) =>
    isFulfilled(deriveStatus(requirement, today)),
  ).length;
  return Math.round((fulfilled / requirements.length) * 100);
}

export function pendingOkCount(requirements: Requirement[]): number {
  return requirements.filter(pendingSignerOk).length;
}

export function attentionFirst(requirements: Requirement[], today: string): Requirement[] {
  const rank: Record<RequirementStatus, number> = {
    expired: 0,
    "due-soon": 1,
    missing: 2,
    ok: 3,
  };
  return [...requirements].sort((a, b) => {
    const pending = Number(pendingSignerOk(b)) - Number(pendingSignerOk(a));
    if (pending !== 0) return pending;
    return rank[deriveStatus(a, today)] - rank[deriveStatus(b, today)];
  });
}
