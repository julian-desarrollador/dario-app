import Link from "next/link";

const howItems = [
  {
    title: "Orden por área",
    body: "Asimilables, peligrosos, efluentes, emisiones y legal: cada tema en su lugar, con su checklist.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
      />
    ),
  },
  {
    title: "Vencimientos a la vista",
    body: "Al día, por vencer o falta: el estado se ve al instante, sin revolver carpetas.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    title: "Menos papel, más accesibilidad",
    body: "Subí PDFs, Word o Excel con código de documento, fechas y responsable. Más fácil de encontrar, listo para presentar.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    ),
  },
  {
    title: "Listo para presentar",
    body: "Un solo lugar para mostrar avances, gaps y evidencias cuando llega la inspección o el cliente.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    ),
  },
  {
    title: "Pensar en la ecología con trazabilidad",
    body: "El objetivo es pensar en la ecología con trazabilidad: qué se hizo, quién lo hizo y cuándo, listo para mostrar.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 21c4.5-4.2 7.5-7.6 7.5-11.2A7.5 7.5 0 0012 2.25 7.5 7.5 0 004.5 9.8C4.5 13.4 7.5 16.8 12 21z"
      />
    ),
  },
];

const audiences = [
  {
    title: "Empresas",
    body: "Ordená la documentación ambiental de tu planta por área. Sabé qué falta antes de que te lo pidan.",
  },
  {
    title: "Auditores",
    body: "Pedí evidencias con criterio: estados claros, historial y checklist para acelerar la revisión sin perder rigurosidad.",
  },
  {
    title: "CEO",
    body: "Visión de la gestión para decidir con información clara.",
  },
  {
    title: "Consultoras",
    body: "Acompañá a varios clientes con la misma lógica de trabajo. Más valor en la entrega, menos tiempo en planillas sueltas.",
  },
  {
    title: "Profesionales",
    body: "Herramienta para el trabajo diario, más accesibilidad, listo para presentar.",
  },
  {
    title: "Jefe, operario y gestión operacional",
    body: "Visión de cómo viene cada tema y trazabilidad, en planta y en la operación.",
  },
];

const benefits = [
  {
    title: "Alertas de vencimiento",
    body: "Lo que está por vencer o falta se destaca antes de que se vuelva un problema.",
  },
  {
    title: "Trazabilidad",
    body: "Código, vencimiento, técnico, firmante y el historial de quién hizo qué: evidencia lista para mostrar.",
  },
  {
    title: "Ahorro de tiempo",
    body: "Menos idas y vueltas buscando archivos. Todo el expediente ambiental en un solo flujo.",
  },
  {
    title: "Un solo lugar",
    body: "Industria, provincia, municipio y año habilitante quedan en la ficha del cliente, no como filtros sueltos.",
  },
];

function ProductMockup() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      {/* Laptop */}
      <div className="animate-drift relative z-10 mx-auto w-[92%] sm:w-full">
        <div className="rounded-t-xl border border-[var(--leaf)]/30 bg-[#0a1611] p-2 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-3">
          <div className="overflow-hidden rounded-lg border border-white/10 bg-[var(--paper)]">
            <div className="flex items-center gap-2 border-b border-[var(--ink)]/8 bg-white px-3 py-2">
              <span className="font-[family-name:var(--font-display)] text-sm text-[var(--ink)]">
                Ámbito
              </span>
              <div className="ml-auto flex gap-1">
                <span className="rounded-full bg-[var(--mist)] px-2 py-0.5 text-[10px] text-[var(--moss)]">
                  Asimilables
                </span>
                <span className="rounded-full bg-[var(--moss)] px-2 py-0.5 text-[10px] text-white">
                  Planta demo
                </span>
              </div>
            </div>
            <div className="grid grid-cols-[1fr_1.2fr] gap-2 p-2 sm:p-3">
              <div className="space-y-1.5">
                {[
                  { name: "Asimilables", tone: "Al día", ok: true },
                  { name: "Peligrosos", tone: "Vencido", ok: false },
                  { name: "Efluentes", tone: "Por vencer", ok: false },
                  { name: "Emisiones", tone: "Al día", ok: true },
                ].map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between rounded-md bg-white px-2 py-1.5 text-[10px] shadow-sm sm:text-xs"
                  >
                    <span className="text-[var(--ink)]">{row.name}</span>
                    <span
                      className={
                        row.ok ? "text-[var(--moss)]" : "text-[var(--alert)]"
                      }
                    >
                      {row.tone}
                    </span>
                  </div>
                ))}
              </div>
              <div className="rounded-md bg-white p-2 shadow-sm">
                <p className="text-[10px] font-semibold text-[var(--ink)] sm:text-xs">
                  Residuos peligrosos
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--mist)]">
                  <div className="h-full w-2/3 rounded-full bg-[var(--moss)]" />
                </div>
                <ul className="mt-2 space-y-1.5">
                  <li className="flex items-center gap-1.5 text-[10px] text-[var(--muted)] sm:text-xs">
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--moss)] text-[8px] text-white">
                      ✓
                    </span>
                    Inscripción provincial
                  </li>
                  <li className="flex items-center gap-1.5 text-[10px] text-[var(--ink)] sm:text-xs">
                    <span className="h-3.5 w-3.5 rounded-full border border-[var(--ink)]/25" />
                    Declaración jurada anual
                  </li>
                  <li className="mt-2 rounded border border-dashed border-[var(--leaf)]/50 bg-[var(--mist)]/60 px-2 py-1 text-[9px] text-[var(--moss)] sm:text-[10px]">
                    P-PEL-002/0325 vers.0
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto h-3 w-[108%] -translate-x-[4%] rounded-b-xl border border-t-0 border-[var(--leaf)]/20 bg-[#12281e]" />
        <div className="mx-auto h-1.5 w-1/3 rounded-b-md bg-[#0d1f18]" />
      </div>

      {/* Phone */}
      <div className="absolute -right-1 bottom-2 z-20 w-[34%] max-w-[140px] sm:right-0 sm:bottom-4 sm:max-w-[160px]">
        <div className="rounded-[1.25rem] border-2 border-[var(--leaf)]/40 bg-[#0a1611] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="overflow-hidden rounded-[1rem] bg-[var(--paper)]">
            <div className="bg-[var(--forest)] px-2 py-2 text-center text-[9px] font-medium text-[var(--mist)]">
              Ámbito
            </div>
            <div className="space-y-1.5 p-2">
              <div className="flex flex-wrap gap-1">
                {["Asim.", "Pelig.", "Eflu."].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-white px-1.5 py-0.5 text-[8px] text-[var(--ink)] shadow-sm"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <div className="rounded-md bg-white p-1.5 shadow-sm">
                <p className="text-[9px] font-semibold text-[var(--ink)]">
                  Cómo venís
                </p>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-[var(--mist)]">
                  <div className="h-full w-3/4 rounded-full bg-[var(--leaf)]" />
                </div>
              </div>
              <div className="rounded-md bg-white p-1.5 text-[8px] text-[var(--muted)] shadow-sm">
                <p className="font-medium text-[var(--ink)]">Para hacer</p>
                <p className="mt-0.5">1 vencido · 1 por vencer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Landing() {
  return (
    <div className="min-h-screen bg-[#0a1611] text-[var(--mist)]">
      <header className="sticky top-0 z-50 border-b border-white/8 bg-[#0a1611]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--moss)] text-sm font-bold text-white"
              aria-hidden
            >
              Á
            </span>
            <span className="font-[family-name:var(--font-display)] text-xl tracking-tight text-white">
              Ámbito
            </span>
          </div>
          <Link
            href="/app"
            className="btn-leaf !px-4 !py-2 !text-sm"
          >
            Ver aplicación
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-4 pb-16 pt-12 md:px-8 md:pb-24 md:pt-16">
          <div
            className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[var(--moss)]/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[var(--leaf)]/15 blur-3xl"
            aria-hidden
          />

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-10">
            <div className="animate-rise">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--leaf)]">
                Documentación ambiental online
              </p>
              <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
                Documentación ambiental,{" "}
                <span className="text-[var(--leaf)]">bajo control</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
                Ordená requisitos por área. Damos valor al trabajo de{" "}
                <strong className="font-semibold text-white">
                  empresas, auditores, CEO, consultoras y profesionales:
                </strong>{" "}
                menos papel, más fácil accesibilidad, listo para presentar.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/app" className="btn-leaf">
                  Probalo en vivo
                </Link>
                <a href="#para-quien" className="btn-secondary-light !text-sm">
                  ¿Para quién es?
                </a>
              </div>
              <p className="mt-4 text-xs text-white/45">
                Prototipo en evolución · sin instalación
              </p>
            </div>

            <div className="animate-rise-delay-1 min-h-[280px] sm:min-h-[340px]">
              <ProductMockup />
            </div>
          </div>
        </section>

        {/* Cómo ayuda */}
        <section className="border-t border-white/8 bg-[#0d1c15] px-4 py-16 md:px-8 md:py-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[var(--leaf)]">
              Menos papel. Más control.
            </p>
            <h2 className="mt-3 text-center font-[family-name:var(--font-display)] text-3xl tracking-tight text-white md:text-4xl">
              Cómo Ámbito ordena tu gestión
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {howItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-[var(--leaf)]/40 hover:bg-white/[0.05]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--moss)]/25 text-[var(--leaf)]">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden
                    >
                      {item.icon}
                    </svg>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Para quién */}
        <section
          id="para-quien"
          className="scroll-mt-20 px-4 py-16 md:px-8 md:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[var(--leaf)]">
              Valor para cada rol
            </p>
            <h2 className="mt-3 text-center font-[family-name:var(--font-display)] text-3xl tracking-tight text-white md:text-4xl">
              No solo para empresas
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-white/60 md:text-base">
              Ayudamos a quien gestiona, revisa o acompaña la documentación
              ambiental a trabajar con más claridad y menos fricción.
            </p>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {audiences.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[var(--leaf)]/20 bg-gradient-to-br from-[var(--moss)]/20 to-transparent p-6"
                >
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Beneficios */}
        <section className="border-t border-white/8 bg-[#0d1c15] px-4 py-16 md:px-8 md:py-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[var(--leaf)]">
              Beneficios que se traducen en resultados
            </p>
            <h2 className="mt-3 text-center font-[family-name:var(--font-display)] text-3xl tracking-tight text-white md:text-4xl">
              Lo que cambia el día a día
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((item, i) => (
                <div key={item.title} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--leaf)]/40 text-sm font-bold text-[var(--leaf)]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-3xl rounded-3xl border border-[var(--leaf)]/30 bg-gradient-to-b from-[var(--moss)]/30 to-[#0a1611] px-6 py-12 text-center md:px-12">
            <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-white md:text-4xl">
              Transformá cómo controlás tu documentación ambiental
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/65 md:text-base">
              Entrá al prototipo, explorá áreas, subí un documento de prueba y
              mirá cómo queda el estado de cada tema. Ámbito: información que te
              da control.
            </p>
            <Link href="/app" className="btn-leaf mt-8 !px-8 !py-3 !text-base">
              Probalo en vivo
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/8 px-4 py-6 text-center text-xs text-white/40 md:px-8">
        Ámbito · Documentación ambiental bajo control
      </footer>
    </div>
  );
}
