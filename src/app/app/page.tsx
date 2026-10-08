"use client";

import Link from "next/link";
import { Printer } from "lucide-react";
import { useAppState } from "@/modules/clients/components/app-state.tsx";
import { todayISO } from "@/modules/expediente/domain/document-code.ts";
import { novedadesNotes } from "@/modules/expediente/domain/overview.ts";

function formatDay(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es-AR");
}

export default function NovedadesPage() {
  const app = useAppState();
  const today = todayISO();
  const notes = novedadesNotes(app.clients, today);
  const day = formatDay(today);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <div className="panel px-5 py-5">
        <h1 className="text-3xl font-semibold tracking-tight">Novedades y Recursos Ambientales</h1>
        <p className="mt-2 text-base text-[var(--muted)]">
          Comunicados, alertas normativas y biblioteca de documentos descargables.
        </p>
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
        <section>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="inline-flex items-center gap-2 text-base font-semibold">
              <span className="size-2.5 shrink-0 rounded-full bg-[var(--moss)]" aria-hidden />
              Notas y Comunicados
            </h2>
            <p className="text-base text-[var(--muted)]">{notes.length} publicación(es)</p>
          </div>
          <ul className="mt-3 space-y-3">
            {notes.map((note) => (
              <li key={note.id} className="panel px-5 py-5 text-base">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center rounded-md bg-[var(--mist)] px-2 py-0.5 text-sm font-semibold text-[var(--forest)]">
                    Novedad
                  </span>
                  <span className="text-base text-[var(--muted)]">{day}</span>
                </div>
                <p className="mt-4 text-xl font-semibold">{note.title}</p>
                <p className="mt-3">{note.body}</p>
                {note.href ? (
                  <Link href={note.href} className="link-moss mt-4 inline-flex text-base font-medium">
                    Ver
                  </Link>
                ) : null}
                <p className="mt-4 text-base text-[var(--muted)]">Última actualización: {day}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="inline-flex items-center gap-2 text-base font-semibold">
              <span className="size-2.5 shrink-0 rounded-full bg-[#2f6cb0]" aria-hidden />
              Recursos y Archivos
            </h2>
            <p className="text-base text-[var(--muted)]">{app.clients.length} recurso(s)</p>
          </div>
          {app.clients.length === 0 ? (
            <p className="panel mt-3 px-5 py-5 text-base">Todavía no hay empresas.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {app.clients.map((client) => (
                <li key={client.id} className="panel px-5 py-5 text-base">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center rounded-md border border-[#2f6cb0] px-2 py-0.5 text-sm font-semibold tracking-wide text-[#2f6cb0]">
                      ENLACE
                    </span>
                    <span className="text-base text-[var(--muted)]">Inspección</span>
                  </div>
                  <p className="mt-4 text-xl font-semibold">Inspección de {client.name}</p>
                  <p className="mt-3">La hoja que se imprime para presentar el expediente.</p>
                  <Link
                    href={`/app/${client.id}/inspeccion`}
                    className="link-moss mt-4 inline-flex items-center gap-2 text-base font-medium"
                  >
                    <Printer className="size-4" aria-hidden />
                    Ver / Imprimir
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
