import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Requirement } from "./model.ts";
import { matchesView } from "./progress.ts";

const today = "2026-09-28";

function fileRequirement(patch: Partial<Requirement> = {}): Requirement {
  return {
    id: "req",
    name: "Permiso",
    kind: "file",
    previous: [],
    history: [],
    ...patch,
  };
}

describe("matchesView", () => {
  it("separa vencido, por vencer y falta", () => {
    const expired = fileRequirement({ dueDate: "2026-08-01", declared: true });
    const dueSoon = fileRequirement({ dueDate: "2026-10-15", declared: true });
    const missing = fileRequirement();

    assert.equal(matchesView(expired, "expired", today), true);
    assert.equal(matchesView(expired, "due-soon", today), false);
    assert.equal(matchesView(dueSoon, "due-soon", today), true);
    assert.equal(matchesView(missing, "missing", today), true);
    assert.equal(matchesView(missing, "expired", today), false);
  });

  it("sin OK es un archivo subido que el firmante todavía no aprobó", () => {
    const pending = fileRequirement({
      dueDate: "2026-12-20",
      current: {
        id: "v1",
        version: 1,
        uploaded: true,
        firmanteOk: false,
        fileName: "permiso.pdf",
        createdAt: today,
      },
    });
    const approved = fileRequirement({
      declared: true,
      dueDate: "2026-12-20",
      current: {
        id: "v1",
        version: 1,
        uploaded: true,
        firmanteOk: true,
        fileName: "permiso.pdf",
        createdAt: today,
      },
    });

    assert.equal(matchesView(pending, "unsigned", today), true);
    assert.equal(matchesView(pending, "missing", today), false);
    assert.equal(matchesView(approved, "unsigned", today), false);
  });
});
