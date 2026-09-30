"use client";

import type { ReactNode } from "react";
import type { RequirementStatus } from "../domain/model.ts";
import type { RequirementView } from "../domain/progress.ts";

const views: {
  id: RequirementView;
  label: string;
}[] = [
  { id: "expired", label: "Vencidos" },
  { id: "due-soon", label: "Por vencer" },
  { id: "missing", label: "Faltan" },
  { id: "unsigned", label: "Por firmar" },
];

function numberTone(id: RequirementView, total: number): string {
  if (total === 0) return "text-[var(--muted)]";
  if (id === "expired") return "text-[var(--alert)]";
  if (id === "due-soon") return "text-[#8a5a00]";
  return "text-[var(--ink)]";
}

function totalsFor(
  counts: Record<RequirementStatus, number>,
  unsigned: number,
): Record<RequirementView, number> {
  return {
    expired: counts.expired,
    "due-soon": counts["due-soon"],
    missing: counts.missing,
    unsigned,
  };
}

const gridClass =
  "grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[var(--ink)]/8 ring-1 ring-[var(--ink)]/8 sm:grid-cols-4";

function StatusFigure({
  id,
  label,
  total,
  compact,
}: {
  id: RequirementView;
  label: string;
  total: number;
  compact?: boolean;
}) {
  return (
    <>
      <span
        className={`font-[family-name:var(--font-display)] leading-none tracking-tight ${
          compact ? "text-2xl" : "text-3xl"
        } ${numberTone(id, total)}`}
      >
        {total}
      </span>
      <span className={`${compact ? "mt-1 text-xs" : "mt-2 text-sm"} ${total === 0 ? "text-[var(--muted)]" : "text-[var(--ink)]"}`}>
        {label}
      </span>
    </>
  );
}

function StatusGrid({ children }: { children: ReactNode }) {
  return <div className={gridClass}>{children}</div>;
}

export function StatusSummary({
  counts,
  unsigned,
  selected,
  onSelect,
}: {
  counts: Record<RequirementStatus, number>;
  unsigned: number;
  selected: RequirementView | null;
  onSelect: (view: RequirementView) => void;
}) {
  const totals = totalsFor(counts, unsigned);

  return (
    <StatusGrid>
      {views.map((view) => {
        const total = totals[view.id];
        const active = selected === view.id;
        return (
          <button
            key={view.id}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(view.id)}
            className={`flex flex-col items-start bg-white px-4 py-4 text-left ${
              active ? "ring-2 ring-inset ring-[var(--forest)]" : ""
            }`}
          >
            <StatusFigure id={view.id} label={view.label} total={total} />
          </button>
        );
      })}
    </StatusGrid>
  );
}

export function StatusGlance({
  counts,
  unsigned,
}: {
  counts: Record<RequirementStatus, number>;
  unsigned: number;
}) {
  const totals = totalsFor(counts, unsigned);

  return (
    <StatusGrid>
      {views.map((view) => (
        <span key={view.id} className="flex flex-col items-start bg-white px-3 py-3 text-left">
          <StatusFigure id={view.id} label={view.label} total={totals[view.id]} compact />
        </span>
      ))}
    </StatusGrid>
  );
}

export const viewTitle: Record<RequirementView, string> = {
  expired: "Vencidos",
  "due-soon": "Por vencer",
  missing: "Faltan",
  unsigned: "Por firmar",
};

export const emptyViewCopy: Record<RequirementView, string> = {
  expired: "No hay vencidos en este cliente.",
  "due-soon": "No hay requisitos por vencer en este cliente.",
  missing: "No hay requisitos que falten en este cliente.",
  unsigned: "No hay documentos por firmar en este cliente.",
};
