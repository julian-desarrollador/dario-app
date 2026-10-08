import type { RequirementStatus, TramiteStatus } from "./model.ts";

export const TRAMITE_OPTIONS: { id: TramiteStatus; label: string }[] = [
  { id: "en-tramite", label: "En trámite" },
  { id: "con-notificacion", label: "Con notificación" },
  { id: "con-renovacion", label: "Con renovación" },
  { id: "finalizado-sin-renovacion", label: "Finalizado sin renovación" },
];

export function tramiteLabel(tramite: TramiteStatus | undefined): string {
  return TRAMITE_OPTIONS.find((option) => option.id === tramite)?.label ?? "Sin estado";
}

export function statusLabel(status: RequirementStatus): string {
  if (status === "ok") return "Al día";
  if (status === "due-soon") return "Por vencer";
  if (status === "expired") return "Vencido";
  return "Falta";
}

export function shortAreaName(name: string) {
  if (name.startsWith("Legal")) return "Legal";
  if (name.startsWith("Gestión")) return "Gestión";
  if (name.startsWith("Agua")) return "Agua/GEI";
  if (name.startsWith("Higiene")) return "H&S";
  const short = name
    .replace("Residuos ", "")
    .replace(" líquidos", "")
    .replace(" gaseosas", "");
  return short.charAt(0).toUpperCase() + short.slice(1);
}
