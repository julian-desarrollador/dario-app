import type { Actor, HistoryAction, HistoryEvent } from "./model.ts";

export function historyEvent(
  action: HistoryAction,
  actor: Actor,
  summary: string,
  at: string,
  id: string,
): HistoryEvent {
  return {
    id,
    at,
    actorId: actor.id,
    actorName: actor.name,
    action,
    summary,
  };
}
