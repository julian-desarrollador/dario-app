export type DocKind = "D" | "R" | "P";

export type RequirementStatus = "missing" | "expired" | "due-soon" | "ok";

export type Actor = {
  id: string;
  name: string;
  role: "tecnico" | "firmante";
};

export type HistoryAction = "uploaded" | "approved" | "replaced" | "deleted";

export type HistoryEvent = {
  id: string;
  at: string;
  actorId: string;
  actorName: string;
  action: HistoryAction;
  summary: string;
};

/** A file version of a requirement. An approved version is kept when a newer edit is pending. */
export type RecordVersion = {
  id: string;
  version: number;
  code?: string;
  docKind?: DocKind;
  fileName?: string;
  fileMime?: string;
  fileData?: string;
  documentDate?: string;
  uploaded: boolean;
  tecnico?: string;
  firmante?: string;
  firmanteId?: string;
  firmanteOk: boolean;
  createdAt: string;
};

export type Requirement = {
  id: string;
  name: string;
  kind: "file" | "task";
  detail?: string;
  href?: string;
  /** YYYY-MM-DD. Drives vencido / por vencer. */
  dueDate?: string;
  taskDone?: boolean;
  /** Catalog evidence that exists even before a file is digitized. */
  declared?: boolean;
  current?: RecordVersion;
  /** Older approved versions, newest first. */
  previous: RecordVersion[];
  history: HistoryEvent[];
};

export type Topic = {
  id: string;
  name: string;
  requirements: Requirement[];
};

export type Area = {
  id: string;
  name: string;
  kind?: "operational" | "legal";
  pillar?: "ambiente" | "hys";
  topics: Topic[];
};

export type Client = {
  id: string;
  name: string;
  industry: string;
  province: string;
  municipality: string;
  enablingYear: string;
  areas: Area[];
};
