"use client";

import { use } from "react";
import { BackLink } from "@/components/back-link.tsx";
import { useAppState } from "@/modules/clients/components/app-state.tsx";
import { InspectionSheet } from "@/modules/expediente/components/inspection-sheet.tsx";

export default function InspectionPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const app = useAppState();
  const client = app.clients.find((item) => item.id === clientId);

  if (!client) {
    return (
      <main className="px-4 py-8">
        <p className="text-base">No encontramos ese cliente.</p>
        <div className="no-print mt-3">
          <BackLink href="/app/gestion">Volver a Gestión Ambiental</BackLink>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-5">
      <div className="no-print">
        <BackLink href={`/app/${client.id}`}>Volver a {client.name}</BackLink>
      </div>
      <div className="mt-3">
        <InspectionSheet client={client} />
      </div>
    </main>
  );
}
