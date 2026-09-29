import type { RequirementStatus } from "./model.ts";

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
