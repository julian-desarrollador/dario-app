import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Client } from "./model.ts";
import { setTopicExpediente } from "./topic-expediente.ts";

const clients: Client[] = [
  {
    id: "planta-demo",
    name: "Planta demo",
    industry: "Alimenticia",
    province: "Córdoba",
    municipality: "Córdoba",
    enablingYear: "2025",
    areas: [
      {
        id: "peligrosos",
        name: "Residuos peligrosos",
        topics: [
          {
            id: "inscripcion",
            name: "Inscripción",
            requirements: [
              {
                id: "p-d1",
                name: "Inscripción provincial",
                kind: "file",
                previous: [],
                history: [],
              },
            ],
          },
        ],
      },
    ],
  },
];

describe("setTopicExpediente", () => {
  it("guarda el número y no toca los requisitos", () => {
    const next = setTopicExpediente(clients, "planta-demo", "inscripcion", " 1234-2026 ");
    const topic = next[0]?.areas[0]?.topics[0];
    const original = clients[0]?.areas[0]?.topics[0];
    assert.equal(topic?.expediente, "1234-2026");
    assert.equal(topic?.requirements, original?.requirements);
    assert.equal(original?.expediente, undefined);
  });

  it("un texto vacío deja la subárea sin expediente", () => {
    const withNumber = setTopicExpediente(clients, "planta-demo", "inscripcion", "1234-2026");
    const cleared = setTopicExpediente(withNumber, "planta-demo", "inscripcion", "   ");
    assert.equal(cleared[0]?.areas[0]?.topics[0]?.expediente, undefined);
  });
});
