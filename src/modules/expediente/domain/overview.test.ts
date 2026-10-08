import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Client } from "./model.ts";
import {
  countTramites,
  dueInYear,
  listDocuments,
  listExpedientes,
  novedadesNotes,
} from "./overview.ts";

const today = "2026-10-08";

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
            expediente: "1234-2026",
            tramite: "en-tramite",
            renovacion: "2027-03-30",
            requirements: [
              {
                id: "vencido",
                name: "Inscripción provincial",
                kind: "file",
                dueDate: "2026-08-15",
                previous: [],
                history: [],
                current: {
                  id: "v",
                  version: 1,
                  fileName: "inscripcion.png",
                  uploaded: true,
                  firmanteOk: false,
                  createdAt: today,
                },
              },
              {
                id: "tarea",
                name: "Revisión",
                kind: "task",
                dueDate: "2026-11-02",
                taskDone: false,
                previous: [],
                history: [],
              },
            ],
          },
          {
            id: "manifiestos",
            name: "Manifiestos",
            requirements: [
              {
                id: "sin-fecha",
                name: "Declaración",
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

describe("novedadesNotes", () => {
  it("arma notas de vencidos, por firmar y en trámite", () => {
    const notes = novedadesNotes(clients, today);
    assert.equal(notes.some((note) => note.id === "expired" && note.href === "/app/documentacion"), true);
    assert.equal(notes.some((note) => note.id === "unsigned"), true);
    assert.equal(notes.some((note) => note.id === "tramite" && note.href === "/app/gestion"), true);
  });

  it("sin avisos deja una bienvenida", () => {
    const notes = novedadesNotes([], today);
    assert.equal(notes.length, 1);
    assert.equal(notes[0]?.id, "welcome");
    assert.equal(notes[0]?.href, undefined);
  });
});

describe("listExpedientes", () => {
  it("lista solo la subárea que tiene número", () => {
    const rows = listExpedientes(clients);
    assert.equal(rows.length, 1);
    assert.equal(rows[0]?.expediente, "1234-2026");
    assert.equal(rows[0]?.tramite, "en-tramite");
    assert.equal(countTramites(clients)["en-tramite"], 1);
    assert.equal(countTramites(clients)["con-notificacion"], 0);
  });
});

describe("dueInYear", () => {
  it("agrupa por mes y deja afuera otro año", () => {
    const groups = dueInYear(clients, "2026");
    assert.deepEqual(
      groups.map((group) => group.month),
      [8, 11],
    );
    assert.equal(dueInYear(clients, "2025").length, 0);
  });
});

describe("listDocuments", () => {
  it("ordena los archivos por vencimiento y deja la tarea afuera", () => {
    const docs = listDocuments(clients);
    assert.deepEqual(
      docs.map((item) => item.requirement.id),
      ["vencido", "sin-fecha"],
    );
  });
});
