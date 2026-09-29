import type { LegacyArea } from "../../../expediente/domain/legacy.ts";
import type { Client } from "../../../expediente/domain/model.ts";
import {
  DEMO_CLIENT,
  legacyAreasToClient,
  seedClients,
} from "../../application/legacy-migration.ts";

const STORAGE_KEY = "ambito-clients-v1";
const LEGACY_KEY = "ambito-prototype-areas-v1";

function mergeMissingAreas(client: Client, seed: Client): Client {
  const savedIds = new Set(client.areas.map((area) => area.id));
  const missing = seed.areas.filter((area) => !savedIds.has(area.id));
  return missing.length > 0 ? { ...client, areas: [...client.areas, ...missing] } : client;
}

export function loadClients(): Client[] {
  const seed = seedClients();
  if (typeof window === "undefined") return seed;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Client[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((client) =>
          client.id === DEMO_CLIENT.id ? mergeMissingAreas(client, seed[0]) : client,
        );
      }
    }
    const legacy = window.localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const areas = JSON.parse(legacy) as LegacyArea[];
      if (Array.isArray(areas) && areas.length > 0) {
        return [mergeMissingAreas(legacyAreasToClient(areas, DEMO_CLIENT), seed[0])];
      }
    }
  } catch {
    return seed;
  }
  return seed;
}

export function saveClients(clients: Client[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  } catch {
    // Quota exceeded: keep the in-memory copy for this session.
  }
}

export function downloadDataUrl(dataUrl: string, fileName: string) {
  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = fileName;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

