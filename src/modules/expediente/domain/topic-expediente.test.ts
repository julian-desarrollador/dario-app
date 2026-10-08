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
  it("guarda el número, el trámite y la renovación, y no toca los requisitos", () => {
    const next = setTopicExpediente(clients, "planta-demo", "inscripcion", {
      expediente: " 1234-2026 ",
      tramite: "en-tramite",
      renovacion: "2027-03-30",
    });
    const topic = next[0]?.areas[0]?.topics[0];
    const original = clients[0]?.areas[0]?.topics[0];
    assert.equal(topic?.expediente, "1234-2026");
    assert.equal(topic?.tramite, "en-tramite");
    assert.equal(topic?.renovacion, "2027-03-30");
    assert.equal(topic?.requirements, original?.requirements);
    assert.equal(original?.expediente, undefined);
    assert.equal(original?.tramite, undefined);
  });

  it("un texto vacío y sin trámite deja la subárea sin expediente", () => {
    const withNumber = setTopicExpediente(clients, "planta-demo", "inscripcion", {
      expediente: "1234-2026",
      tramite: "con-notificacion",
      renovacion: "2027-03-30",
    });
    const cleared = setTopicExpediente(withNumber, "planta-demo", "inscripcion", {
      expediente: "   ",
      tramite: "",
      renovacion: "",
    });
    const topic = cleared[0]?.areas[0]?.topics[0];
    assert.equal(topic?.expediente, undefined);
    assert.equal(topic?.tramite, undefined);
    assert.equal(topic?.renovacion, undefined);
  });

  it("ignora un trámite desconocido y una fecha mal formada", () => {
    const next = setTopicExpediente(clients, "planta-demo", "inscripcion", {
      expediente: "1234-2026",
      tramite: "certificate-withdrawal",
      renovacion: "30/03/2027",
    });
    const topic = next[0]?.areas[0]?.topics[0];
    assert.equal(topic?.tramite, undefined);
    assert.equal(topic?.renovacion, undefined);
  });
});
