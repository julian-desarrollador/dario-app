import type { DocKind } from "./domain/model.ts";
import type { LegacyArea } from "./domain/legacy.ts";

const BO = "https://www.boletinoficial.gob.ar/";

export const initialAreas: LegacyArea[] = [
  {
    id: "asimilables",
    name: "Residuos asimilables",
    kind: "operational",
    subAreas: [
      {
        id: "a-transporte",
        name: "Transporte",
        docs: [
          {
            id: "a-d1",
            name: "Contrato con transportista",
            status: "ok",
            detail: "Vigente hasta 14/11/2026",
          },
        ],
        checklist: [
          { id: "a1", label: "Alta municipal", done: true },
          { id: "a2", label: "Contrato de recolección", done: true },
        ],
      },
      {
        id: "a-disposicion",
        name: "Disposición",
        docs: [
          {
            id: "a-d3",
            name: "Constancia de disposición final",
            status: "ok",
            detail: "Archivado",
          },
        ],
        checklist: [{ id: "a4", label: "Sitio de disposición habilitado", done: true }],
      },
      {
        id: "a-registro",
        name: "Registro interno",
        docs: [
          {
            id: "a-d2",
            name: "Registro de generación mensual",
            status: "ok",
            detail: "Última carga: julio 2026",
          },
        ],
        checklist: [
          { id: "a3", label: "Registro interno de volúmenes", done: true },
        ],
      },
    ],
  },
  {
    id: "peligrosos",
    name: "Residuos peligrosos",
    kind: "operational",
    subAreas: [
      {
        id: "p-inscripcion",
        name: "Inscripción",
        docs: [
          {
            id: "p-d1",
            name: "Inscripción provincial",
            status: "warn",
            detail: "Vence el 15/08/2026",
          },
          {
            id: "p-d4",
            name: "Declaración jurada anual",
            status: "missing",
            detail: "Pendiente de carga",
          },
        ],
        checklist: [
          { id: "p1", label: "Inscripción provincial vigente", done: true },
          { id: "p3", label: "Declaración jurada anual", done: false },
        ],
      },
      {
        id: "p-manifiestos",
        name: "Manifiestos",
        docs: [
          {
            id: "p-d2",
            name: "Manifiesto de transporte",
            status: "ok",
            detail: "Último: 22/07/2026",
          },
        ],
        checklist: [
          { id: "p2", label: "Manifiesto de transporte", done: true },
        ],
      },
      {
        id: "p-plan",
        name: "Plan de gestión",
        docs: [
          {
            id: "p-d3",
            name: "Plan de gestión",
            status: "ok",
            detail: "Revisión anual OK",
          },
        ],
        checklist: [
          { id: "p4", label: "Plan de gestión actualizado", done: true },
        ],
      },
    ],
  },
  {
    id: "efluentes",
    name: "Efluentes líquidos",
    kind: "operational",
    subAreas: [
      {
        id: "e-permiso",
        name: "Permiso de vuelco",
        docs: [
          {
            id: "e-d1",
            name: "Permiso de vuelco",
            status: "ok",
            detail: "Vigente",
          },
        ],
        checklist: [{ id: "e1", label: "Permiso de vuelco", done: true }],
      },
      {
        id: "e-monitoreo",
        name: "Monitoreo",
        docs: [
          {
            id: "e-d2",
            name: "Análisis de laboratorio",
            status: "ok",
            detail: "Último: 03/06/2026",
          },
          {
            id: "e-d3",
            name: "Normativa municipal aplicable",
            status: "missing",
            detail: "Sin documento cargado",
          },
        ],
        checklist: [
          { id: "e2", label: "Monitoreo periódico", done: true },
          { id: "e3", label: "Normativa municipal cargada", done: false },
        ],
      },
    ],
  },
  {
    id: "emisiones",
    name: "Emisiones gaseosas",
    kind: "operational",
    subAreas: [
      {
        id: "g-fuentes",
        name: "Fuentes",
        docs: [
          {
            id: "g-d1",
            name: "Monitoreo de chimeneas",
            status: "ok",
            detail: "Último: 18/05/2026",
          },
        ],
        checklist: [
          { id: "g1", label: "Habilitación de fuentes", done: true },
        ],
      },
      {
        id: "g-informe",
        name: "Informe anual",
        docs: [
          {
            id: "g-d2",
            name: "Informe de emisiones",
            status: "ok",
            detail: "Presentado",
          },
        ],
        checklist: [{ id: "g2", label: "Informe anual", done: true }],
      },
    ],
  },
  {
    id: "legal",
    name: "Legal / Jurídica",
    kind: "legal",
    subAreas: [
      {
        id: "l-nacional",
        name: "Nacional (BO)",
        docs: [
          {
            id: "l-d1",
            name: "Ley 25.675 — Ley General del Ambiente",
            status: "ok",
            detail: "Nacional · fuente: Boletín Oficial",
            href: BO,
          },
          {
            id: "l-d2",
            name: "Ley 24.051 — Residuos peligrosos",
            status: "ok",
            detail: "Nacional · fuente: Boletín Oficial",
            href: BO,
          },
        ],
        checklist: [
          { id: "l1", label: "Normativa nacional vinculada al BO", done: true },
        ],
      },
      {
        id: "l-provincial",
        name: "Provincial",
        docs: [
          {
            id: "l-d3",
            name: "Normativa provincial de ejemplo (Córdoba)",
            status: "warn",
            detail: "Revisar vigencia en el Boletín Oficial",
            href: BO,
          },
        ],
        checklist: [
          { id: "l2", label: "Cruce con boletín provincial", done: false },
        ],
      },
      {
        id: "l-municipal",
        name: "Municipal / ACUMAR",
        docs: [
          {
            id: "l-d4",
            name: "Resolución de ejemplo ACUMAR / municipal",
            status: "missing",
            detail: "Pendiente de vincular a fuente oficial",
            href: BO,
          },
        ],
        checklist: [
          { id: "l3", label: "Norma municipal o de cuenca vinculada", done: false },
        ],
      },
    ],
  },
  {
    id: "gestion",
    name: "Gestión ambiental",
    kind: "operational",
    pillar: "ambiente",
    subAreas: [
      {
        id: "ga-iso",
        name: "ISO 14001",
        docs: [
          {
            id: "ga-d1",
            name: "Manual del sistema de gestión",
            status: "ok",
            detail: "Versión vigente",
          },
          {
            id: "ga-d2",
            name: "Informe de auditoría interna",
            status: "missing",
            detail: "Pendiente del ciclo 2026",
          },
        ],
        checklist: [
          { id: "ga1", label: "Alcance del sistema definido", done: true },
          { id: "ga2", label: "Auditoría interna del año", done: false },
        ],
      },
      {
        id: "ga-eia",
        name: "Estudio de impacto",
        docs: [
          {
            id: "ga-d3",
            name: "Estudio de impacto ambiental",
            status: "warn",
            detail: "Revisión pendiente ante el organismo",
          },
        ],
        checklist: [
          { id: "ga3", label: "EIA presentado", done: true },
          { id: "ga4", label: "Declaración de impacto obtenida", done: false },
        ],
      },
      {
        id: "ga-cnca",
        name: "Categorización (CNCA / NCA)",
        docs: [
          {
            id: "ga-d4",
            name: "Certificado CNCA",
            status: "ok",
            detail: "Categoría vigente",
          },
          {
            id: "ga-d5",
            name: "Nivel de complejidad ambiental (NCA)",
            status: "missing",
            detail: "Sin constancia cargada",
          },
        ],
        checklist: [
          { id: "ga5", label: "Categorización industrial actualizada", done: false },
        ],
      },
      {
        id: "ga-girsu",
        name: "Planes / GIRSU",
        docs: [
          {
            id: "ga-d6",
            name: "Plan de gestión ambiental",
            status: "ok",
            detail: "En seguimiento",
          },
        ],
        checklist: [
          { id: "ga6", label: "Plan GIRSU con responsable", done: true },
          { id: "ga7", label: "Seguimiento del plan al día", done: false },
        ],
      },
    ],
  },
  {
    id: "agua-gei",
    name: "Agua y GEI",
    kind: "operational",
    pillar: "ambiente",
    subAreas: [
      {
        id: "ag-agua",
        name: "Agua",
        docs: [
          {
            id: "ag-d1",
            name: "Permiso de explotación de agua",
            status: "ok",
            detail: "Vigente",
          },
          {
            id: "ag-d2",
            name: "Monitoreo de agua",
            status: "warn",
            detail: "Próximo análisis: 12/10/2026",
          },
        ],
        checklist: [
          { id: "ag1", label: "Aptitud hidráulica revisada", done: true },
          { id: "ag2", label: "Monitoreo de agua en fecha", done: false },
        ],
      },
      {
        id: "ag-gei",
        name: "GEI",
        docs: [
          {
            id: "ag-d3",
            name: "Inventario de emisiones GEI",
            status: "missing",
            detail: "Sin carga del último período",
          },
          {
            id: "ag-d4",
            name: "Monitoreo GEI",
            status: "warn",
            detail: "Próximo análisis: 30/11/2026",
          },
        ],
        checklist: [
          { id: "ag3", label: "Fuentes de emisión identificadas", done: true },
          { id: "ag4", label: "Inventario del período cerrado", done: false },
        ],
      },
    ],
  },
  {
    id: "hys",
    name: "Higiene y Seguridad",
    kind: "operational",
    pillar: "hys",
    subAreas: [
      {
        id: "hs-riesgos",
        name: "Riesgos",
        docs: [
          {
            id: "hs-d1",
            name: "Matriz de identificación de peligros",
            status: "ok",
            detail: "Actualizada",
          },
        ],
        checklist: [
          { id: "hs1", label: "Peligros identificados", done: true },
          { id: "hs2", label: "Evaluación de riesgos cerrada", done: false },
        ],
      },
      {
        id: "hs-incendios",
        name: "Incendios",
        docs: [
          {
            id: "hs-d2",
            name: "Estudio de carga de fuego",
            status: "warn",
            detail: "Vence la revisión el 20/12/2026",
          },
        ],
        checklist: [
          { id: "hs3", label: "Sistema de extinción verificado", done: true },
          { id: "hs4", label: "Carga de fuego vigente", done: false },
        ],
      },
      {
        id: "hs-crisis",
        name: "Plan de crisis",
        docs: [
          {
            id: "hs-d3",
            name: "Plan de crisis",
            status: "missing",
            detail: "Pendiente de carga",
          },
        ],
        checklist: [
          { id: "hs5", label: "Plan de crisis aprobado", done: false },
          { id: "hs6", label: "Roles de emergencia asignados", done: false },
        ],
      },
      {
        id: "hs-monitoreos",
        name: "Monitoreos",
        docs: [
          {
            id: "hs-d4",
            name: "Medición de ruido laboral",
            status: "ok",
            detail: "Última: 02/08/2026",
          },
          {
            id: "hs-d5",
            name: "Medición de iluminación",
            status: "missing",
            detail: "Sin medición cargada",
          },
        ],
        checklist: [
          { id: "hs7", label: "Monitoreo de ruido al día", done: true },
          { id: "hs8", label: "Monitoreo de iluminación al día", done: false },
        ],
      },
    ],
  },
];

export const industryTypes = [
  "Alimenticia",
  "Automotriz",
  "Química",
  "Minería",
  "Agroindustria",
];

export const locations = [
  "Córdoba · Córdoba",
  "Buenos Aires · ACUMAR",
  "Buenos Aires · La Plata",
  "Santa Fe · Rosario",
];

export const enablingYears = ["2022", "2023", "2024", "2025", "2026"];

export const areaCodes: Record<string, string> = {
  asimilables: "ASI",
  peligrosos: "PEL",
  efluentes: "EFL",
  emisiones: "EMI",
  legal: "LEG",
  gestion: "GES",
  "agua-gei": "AGI",
  hys: "HYS",
};

export const docKindLabels: Record<DocKind, string> = {
  D: "Documento",
  R: "Registro",
  P: "Procedimiento",
};

export const ACCEPT_FILES =
  ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/png,image/jpeg";
