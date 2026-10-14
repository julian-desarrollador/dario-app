import type { MonthFigures as Figures } from "../domain/month-report.ts";

const rows = [
  {
    title: "Hechas",
    cells: [
      { key: "done", label: "Realizadas" },
      { key: "onTime", label: "Dentro de tiempo" },
      { key: "late", label: "Fuera de tiempo" },
    ],
  },
  {
    title: "Quedan",
    cells: [
      { key: "pending", label: "Pendientes" },
      { key: "dueSoon", label: "Por vencerse" },
      { key: "expired", label: "Vencidas" },
    ],
  },
] as const;

type FigureKey = (typeof rows)[number]["cells"][number]["key"];

function tone(key: FigureKey, total: number): string {
  if (total === 0) return "text-[var(--muted)]";
  if (key === "late" || key === "expired") return "text-[var(--alert)]";
  if (key === "dueSoon") return "text-[#8a5a00]";
  return "text-[var(--ink)]";
}

export function MonthFigures({ figures }: { figures: Figures }) {
  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.title}>
          <p className="text-base font-semibold">{row.title}</p>
          <div className="mt-2 grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-[var(--ink)]/8 ring-1 ring-[var(--ink)]/8">
            {row.cells.map((cell) => {
              const total = figures[cell.key];
              return (
                <div key={cell.key} className="bg-white px-2 py-4 text-center">
                  <p className={`text-3xl font-semibold leading-none tracking-tight ${tone(cell.key, total)}`}>
                    {total}
                  </p>
                  <p className={`mt-2 text-base ${total === 0 ? "text-[var(--muted)]" : ""}`}>{cell.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
