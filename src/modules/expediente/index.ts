export type { Actor, Area, Client, Requirement, RequirementStatus } from "./domain/model.ts";
export { deriveStatus, pendingSignerOk } from "./domain/requirement-status.ts";
export {
  approveVersion,
  canApproveVersion,
  canDeleteVersion,
  deletePendingVersion,
  keepsBinary,
  uploadVersion,
} from "./domain/record-lifecycle.ts";
export { progressPercent, clientRequirements, areaRequirements } from "./domain/progress.ts";
export { statusLabel, shortAreaName } from "./domain/labels.ts";
export { AreaProgressBar } from "./components/area-progress-bar.tsx";
export { RequirementCard, StatusBadge } from "./components/requirement-card.tsx";
