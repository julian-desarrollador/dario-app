/** Shape stored by the first prototype (`ambito-prototype-areas-v1`). */
export type LegacyDoc = {
  id: string;
  name: string;
  status: "ok" | "warn" | "missing";
  detail: string;
  href?: string;
  docKind?: "D" | "R" | "P";
  code?: string;
  version?: string;
  ingresoDate?: string;
  documentDate?: string;
  updateDate?: string;
  tecnico?: string;
  firmante?: string;
  firmanteId?: string;
  firmanteOk?: boolean;
  uploaded?: boolean;
  hasExpediente?: boolean;
  fileName?: string;
  fileMime?: string;
  fileData?: string;
};

export type LegacyCheck = { id: string; label: string; done: boolean };

export type LegacySubArea = {
  id: string;
  name: string;
  docs: LegacyDoc[];
  checklist: LegacyCheck[];
};

export type LegacyArea = {
  id: string;
  name: string;
  kind?: "operational" | "legal";
  pillar?: "ambiente" | "hys";
  subAreas: LegacySubArea[];
};
