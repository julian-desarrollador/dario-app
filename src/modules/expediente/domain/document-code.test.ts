import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { nextDocumentSequence } from "./document-code.ts";

describe("nextDocumentSequence", () => {
  it("empieza en 1 cuando el área no tiene códigos", () => {
    assert.equal(nextDocumentSequence([]), 1);
  });

  it("toma el mayor correlativo ya usado y suma uno", () => {
    assert.equal(nextDocumentSequence(["D-ASI-001/0926", "D-ASI-004/0926"]), 5);
  });
});
