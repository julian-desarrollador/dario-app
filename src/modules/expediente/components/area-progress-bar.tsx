function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function lerpColor(from: string, to: string, t: number) {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const mix = (x: number, y: number) => Math.round(x + (y - x) * t);
  return `rgb(${mix(a.r, b.r)}, ${mix(a.g, b.g)}, ${mix(a.b, b.b)})`;
}

export function AreaProgressBar({
  percent,
  label = "Cómo venís",
}: {
  percent: number;
  label?: string;
}) {
  const p = Math.max(0, Math.min(100, percent));
  const color = lerpColor("#c45c2a", "#2f6b4f", p / 100);

  return (
    <div className="min-w-[10rem] flex-1 md:max-w-xs">
      <div className="mb-1 flex items-baseline justify-between gap-3 text-xs text-[var(--muted)]">
        <span>{label}</span>
        <span className="font-semibold" style={{ color }}>
          {p}%
        </span>
      </div>
      <div
        className="h-2.5 overflow-hidden rounded-full bg-[var(--ink)]/10"
        role="progressbar"
        aria-valuenow={p}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progreso del área"
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${Math.max(p, p === 0 ? 0 : 4)}%`, background: color }}
        />
      </div>
    </div>
  );
}
