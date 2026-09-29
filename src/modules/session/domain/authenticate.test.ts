import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { authenticate } from "./authenticate.ts";

describe("authenticate", () => {
  it("acepta la cuenta demo del técnico", () => {
    const user = authenticate("tecnico", "ambito");
    assert.equal(user?.name, "Técnico");
    assert.equal(user?.role, "tecnico");
  });

  it("acepta la cuenta de Dario", () => {
    const user = authenticate("Dario", "123");
    assert.equal(user?.name, "Dario");
    assert.equal(user?.role, "tecnico");
  });

  it("rechaza una clave incorrecta", () => {
    assert.equal(authenticate("tecnico", "otra"), null);
  });
});
