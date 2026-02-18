export interface Vacante {
  id: string;
  titulo: string;
  empresa: string;
  ubicacion: string;
  tipo: "remoto" | "presencial" | "hibrido";
  salario?: string;
  descripcion: string;
  requisitos: string[];
  fechaPublicacion: string;
  url?: string;
}

export const vacantes: Vacante[] = [
  {
    id: "1",
    titulo: "Senior Frontend Developer",
    empresa: "TechCorp LATAM",
    ubicacion: "México (Remoto)",
    tipo: "remoto",
    salario: "$3,000 - $5,000 USD",
    descripcion: "Buscamos un desarrollador frontend con experiencia en React y TypeScript para liderar proyectos de alto impacto.",
    requisitos: ["React", "TypeScript", "Next.js", "Tailwind CSS", "3+ años experiencia"],
    fechaPublicacion: new Date().toISOString(),
    url: "https://example.com/apply",
  },
  {
    id: "2",
    titulo: "Product Manager",
    empresa: "Startup Innovadora",
    ubicacion: "Bogotá, Colombia",
    tipo: "hibrido",
    salario: "$2,500 - $4,000 USD",
    descripcion: "Únete a nuestro equipo de producto para definir la visión y roadmap de nuestra plataforma.",
    requisitos: ["Product Management", "Scrum", "SQL", "User Research", "2+ años experiencia"],
    fechaPublicacion: new Date().toISOString(),
  },
];

export function getVacantes(): Vacante[] {
  return vacantes.sort((a, b) =>
    new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime()
  );
}

export function addVacante(vacante: Vacante): void {
  vacantes.push(vacante);
}

export function removeVacante(id: string): boolean {
  const index = vacantes.findIndex(v => v.id === id);
  if (index === -1) return false;
  vacantes.splice(index, 1);
  return true;
}
