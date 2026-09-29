"use client";

import Link from "next/link";
import { use } from "react";
import { useAppState } from "@/modules/clients/components/app-state.tsx";
import { RequirementCard } from "@/modules/expediente/components/requirement-card.tsx";

export default function AreaPage({
  params,
}: {
  params: Promise<{ clientId: string; areaId: string }>;
}) {
  const { clientId, areaId } = use(params);
  const app = useAppState();
  const client = app.clients.find((item) => item.id === clientId);
  const area = client?.areas.find((item) => item.id === areaId);

  if (!client || !area) {
    return (
      <main className="px-4 py-8">
        <Link href="/app" className="text-sm text-[var(--moss)]">
          Volver a clientes
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-5">
      <Link href={`/app/${client.id}`} className="text-sm text-[var(--muted)]">
        {client.name}
      </Link>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-tight">{area.name}</h1>
      <div className="mt-6 space-y-8">
        {area.topics.map((topic) => (
          <section key={topic.id}>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              {topic.name}
            </h2>
            <ul className="mt-3 space-y-3">
              {topic.requirements.map((requirement) => (
                <li key={requirement.id}>
                  <RequirementCard
                    clientId={client.id}
                    areaId={area.id}
                    requirement={requirement}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
