"use client";

import { use } from "react";
import { BackLink } from "@/components/back-link.tsx";
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
        <BackLink href="/app">Volver a clientes</BackLink>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-5">
      <BackLink href={`/app/${client.id}`}>Volver a {client.name}</BackLink>
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
