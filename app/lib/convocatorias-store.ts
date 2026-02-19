import convocatoriasData from "./convocatorias.json";

export interface Convocatoria {
  id: string;
  nombre: string;
  organizacion: string;
  tipo: "Programa" | "Aceleradora" | "Competencia" | "Financiamiento" | "Fellowship" | "Incubación" | "Red/Mentoría" | "Herramientas" | "Festival" | "Capacitación" | "Programa + Premio" | "Innovación social" | "Fondo";
  perfilArea: string;
  paisDestino: string;
  descripcion: string;
  beneficios: string;
  fechaCierre: string;
  url: string;
}

export const convocatorias: Convocatoria[] = convocatoriasData as Convocatoria[];

export function getConvocatorias(): Convocatoria[] {
  return convocatorias;
}

export function getConvocatoriasByTipo(tipo: string): Convocatoria[] {
  return convocatorias.filter(c => c.tipo === tipo);
}

export function getConvocatoriasByPais(pais: string): Convocatoria[] {
  return convocatorias.filter(c => c.paisDestino.toLowerCase().includes(pais.toLowerCase()));
}
