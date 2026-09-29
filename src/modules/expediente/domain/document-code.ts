import type { DocKind } from "./model.ts";

export function todayISO(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

/** /0125 = month (01) + year (25). */
export function monthYearCode(dateISO: string) {
  const date = new Date(`${dateISO}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "0100";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${month}${year}`;
}

export function buildDocCode(opts: {
  kind: DocKind;
  areaCode: string;
  sequence: number;
  dateISO: string;
}) {
  const sequence = String(opts.sequence).padStart(3, "0");
  const monthYear = monthYearCode(opts.dateISO);
  return `${opts.kind}-${opts.areaCode}-${sequence}/${monthYear}`;
}

export function formatVersionLabel(version: number) {
  return `vers.${version - 1}`;
}

/** Next `001` segment from codes already used in the area. */
export function nextDocumentSequence(codes: readonly string[]) {
  let highest = 0;
  for (const code of codes) {
    const match = /-(\d{3})\//.exec(code);
    if (match) highest = Math.max(highest, Number(match[1]));
  }
  return highest + 1;
}
