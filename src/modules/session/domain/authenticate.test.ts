import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { authenticate } from "./authenticate.ts";

describe("authenticate", () => {
  it("acepta la cuenta demo del técnico", () => {
    const user = authenticate("tecnico", "ambito");
    assert.equal(user?.name, "Técnico");
    assert.equal(user?.role, "tecnico");
  });

  it("rechaza una clave incorrecta", () => {
    assert.equal(authenticate("tecnico", "otra"), null);
  });
});
