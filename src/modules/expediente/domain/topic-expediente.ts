import type { Client, TramiteStatus } from "./model.ts";

const TRAMITES: readonly TramiteStatus[] = [
  "en-tramite",
  "con-notificacion",
  "con-renovacion",
  "finalizado-sin-renovacion",
];

export type TopicFiling = {
  expediente: string;
  tramite?: string;
  renovacion?: string;
};

function cleanTramite(value: string | undefined): TramiteStatus | undefined {
  if (!value) return undefined;
  return TRAMITES.find((item) => item === value);
}

function cleanDate(value: string | undefined): string | undefined {
  const trimmed = value?.trim() ?? "";
  return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : undefined;
}

export function setTopicExpediente(
  clients: Client[],
  clientId: string,
  topicId: string,
  filing: TopicFiling,
): Client[] {
  const expediente = filing.expediente.trim() || undefined;
  const tramite = cleanTramite(filing.tramite);
  const renovacion = cleanDate(filing.renovacion);
  return clients.map((client) => {
    if (client.id !== clientId) return client;
    return {
      ...client,
      areas: client.areas.map((area) => ({
        ...area,
        topics: area.topics.map((topic) =>
          topic.id === topicId ? { ...topic, expediente, tramite, renovacion } : topic,
        ),
      })),
    };
  });
}
