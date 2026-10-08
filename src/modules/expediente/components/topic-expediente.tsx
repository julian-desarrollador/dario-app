"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { useAppState } from "@/modules/clients/components/app-state.tsx";
import { TRAMITE_OPTIONS, tramiteLabel } from "@/modules/expediente/domain/labels.ts";
import type { Topic } from "@/modules/expediente/domain/model.ts";

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es-AR");
}

const fieldClass = "mt-2 w-full rounded-lg border border-[var(--ink)]/15 px-3 py-2 text-base";

export function TopicExpediente({ clientId, topic }: { clientId: string; topic: Topic }) {
  const app = useAppState();
  const [editing, setEditing] = useState(false);
  const [number, setNumber] = useState(topic.expediente ?? "");
  const [tramite, setTramite] = useState(topic.tramite ?? "");
  const [renovacion, setRenovacion] = useState(topic.renovacion ?? "");
  const filed = topic.expediente?.trim() ?? "";
  const hasFiling = Boolean(filed || topic.tramite || topic.renovacion);

  function openEditor() {
    setNumber(filed);
    setTramite(topic.tramite ?? "");
    setRenovacion(topic.renovacion ?? "");
    setEditing(true);
  }

  function save() {
    app.setTopicExpediente(clientId, topic.id, {
      expediente: number,
      tramite,
      renovacion,
    });
    setEditing(false);
  }

  if (editing) {
    return (
      <form
        className="panel px-4 py-4"
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <label className="block text-base" htmlFor={`expediente-${topic.id}`}>
          Número de expediente
          <input
            id={`expediente-${topic.id}`}
            value={number}
            onChange={(event) => setNumber(event.target.value)}
            className={fieldClass}
            autoFocus
          />
        </label>
        <label className="mt-3 block text-base" htmlFor={`tramite-${topic.id}`}>
          Estado del trámite
          <select
            id={`tramite-${topic.id}`}
            value={tramite}
            onChange={(event) => setTramite(event.target.value)}
            className={fieldClass}
          >
            <option value="">Sin estado</option>
            {TRAMITE_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-3 block text-base" htmlFor={`renovacion-${topic.id}`}>
          Renovación
          <input
            id={`renovacion-${topic.id}`}
            type="date"
            value={renovacion}
            onChange={(event) => setRenovacion(event.target.value)}
            className={fieldClass}
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
    <div className="panel px-4 py-4">
      {filed ? (
        <p className="text-2xl font-semibold tracking-tight">Expediente {filed}</p>
      ) : (
        <p className="text-base font-semibold">Sin expediente</p>
      )}
      {hasFiling ? (
        <p className="mt-2 text-base">{tramiteLabel(topic.tramite)}</p>
      ) : null}
      {topic.renovacion ? (
        <p className="mt-1 text-base">Renueva el {formatDate(topic.renovacion)}</p>
      ) : null}
      <Button
        type="button"
        variant={hasFiling ? "secondary" : "default"}
        className="mt-3 h-11 px-4 text-base"
        onClick={openEditor}
      >
        {hasFiling ? "Cambiar" : "Anotar expediente"}
      </Button>
    </div>
  );
}
