import type { Client } from "./model.ts";

export function setTopicExpediente(
  clients: Client[],
  clientId: string,
  topicId: string,
  expediente: string,
): Client[] {
  const value = expediente.trim();
  return clients.map((client) => {
    if (client.id !== clientId) return client;
    return {
      ...client,
      areas: client.areas.map((area) => ({
        ...area,
        topics: area.topics.map((topic) =>
          topic.id === topicId ? { ...topic, expediente: value || undefined } : topic,
        ),
      })),
    };
  });
}
