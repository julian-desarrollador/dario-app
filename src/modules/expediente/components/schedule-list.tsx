import Link from "next/link";
import { scheduleTimingLabel, statusLabel } from "../domain/labels.ts";
import type { ScheduleItem } from "../domain/month-report.ts";
import { deriveStatus } from "../domain/requirement-status.ts";

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es-AR");
}

export function ScheduleList({
  pending,
  done,
  today,
}: {
  pending: ScheduleItem[];
  done: ScheduleItem[];
  today: string;
}) {
  if (pending.length === 0 && done.length === 0) {
    return <p className="mt-4 text-base">No hay controles en este mes.</p>;
  }
  return (
    <div>
      <ScheduleGroup title="Pendientes" items={pending} today={today} />
      <ScheduleGroup title="Realizadas" items={done} today={today} />
    </div>
  );
}

function ScheduleGroup({ title, items, today }: { title: string; items: ScheduleItem[]; today: string }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-4">
      <h3 className="text-base font-semibold">{title}</h3>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <Link href={`/app/${item.clientId}/${item.areaId}`} className="panel block px-4 py-4 text-base">
              <span className="block font-semibold">{item.requirement.name}</span>
              <span className="mt-1 block">
                {item.clientName} · {item.areaName}
              </span>
              <span className="mt-1 block">Plazo: {formatDate(item.deadline)}</span>
              <span className="mt-1 block">
                {item.done ? scheduleTimingLabel(item.timing) : statusLabel(deriveStatus(item.requirement, today))}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
