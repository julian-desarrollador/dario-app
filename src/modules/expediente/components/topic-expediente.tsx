"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { useAppState } from "@/modules/clients/components/app-state.tsx";
import type { Topic } from "@/modules/expediente/domain/model.ts";

export function TopicExpediente({ clientId, topic }: { clientId: string; topic: Topic }) {
  const app = useAppState();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(topic.expediente ?? "");
  const filed = topic.expediente?.trim() ?? "";

  function openEditor() {
    setValue(filed);
    setEditing(true);
  }

  function save() {
    app.setTopicExpediente(clientId, topic.id, value);
    setEditing(false);
  }

  if (editing) {
    return (
      <form
        className="rounded-2xl bg-white px-4 py-4 ring-1 ring-[var(--ink)]/8"
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <label className="block text-base" htmlFor={`expediente-${topic.id}`}>
          Número de expediente
          <input
            id={`expediente-${topic.id}`}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="mt-2 w-full rounded-lg border border-[var(--ink)]/15 px-3 py-2 text-base"
            autoFocus
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="submit" className="h-11 px-4 text-base">
            Guardar
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="h-11 px-4 text-base"
            onClick={() => setEditing(false)}
          >
            Cancelar
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-2xl bg-white px-4 py-4 ring-1 ring-[var(--ink)]/8">
      {filed ? (
        <p className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
          Expediente {filed}
        </p>
      ) : (
        <p className="text-base font-semibold">Sin expediente</p>
      )}
      <Button
        type="button"
        variant={filed ? "secondary" : "default"}
        className="mt-3 h-11 px-4 text-base"
        onClick={openEditor}
      >
        {filed ? "Cambiar" : "Anotar expediente"}
      </Button>
    </div>
  );
}
