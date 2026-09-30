"use client";

import { BackLink } from "@/components/back-link.tsx";
import { useAppState } from "@/modules/clients/components/app-state.tsx";
import { RequirementCard } from "@/modules/expediente/components/requirement-card.tsx";
import { pendingSignerOk } from "@/modules/expediente/domain/requirement-status.ts";

export default function SignPage() {
  const app = useAppState();
  const items = app.clients.flatMap((client) =>
    client.areas.flatMap((area) =>
      area.topics.flatMap((topic) =>
        topic.requirements
          .filter(
            (requirement) =>
              pendingSignerOk(requirement) &&
              requirement.current?.firmanteId === app.user?.id,
          )
          .map((requirement) => ({ client, area, requirement })),
      ),
    ),
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-5">
      <BackLink href="/app">Volver a clientes</BackLink>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-tight">
        Para firmar
      </h1>
      {items.length === 0 ? (
        <p className="mt-6 text-base text-[var(--muted)]">No tenés documentos por firmar.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map((item) => (
            <li key={item.requirement.id}>
              <p className="mb-1 text-xs text-[var(--muted)]">
                {item.client.name} · {item.area.name}
              </p>
              <RequirementCard
                clientId={item.client.id}
                areaId={item.area.id}
                requirement={item.requirement}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
