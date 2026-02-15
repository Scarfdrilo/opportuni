import { NextRequest, NextResponse } from "next/server";

// In-memory storage (resets on deploy - use database for production)
let vacantes: Vacante[] = [
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

interface Vacante {
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

// GET - List all vacantes
export async function GET() {
  return NextResponse.json({
    success: true,
    count: vacantes.length,
    vacantes: vacantes.sort((a, b) => 
      new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime()
    ),
  });
}

// POST - Create new vacante
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const required = ["titulo", "empresa", "ubicacion", "tipo", "descripcion"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate tipo
    if (!["remoto", "presencial", "hibrido"].includes(body.tipo)) {
      return NextResponse.json(
        { success: false, error: "tipo must be: remoto, presencial, or hibrido" },
        { status: 400 }
      );
    }

    const newVacante: Vacante = {
      id: Date.now().toString(),
      titulo: body.titulo,
      empresa: body.empresa,
      ubicacion: body.ubicacion,
      tipo: body.tipo,
      salario: body.salario,
      descripcion: body.descripcion,
      requisitos: body.requisitos || [],
      fechaPublicacion: new Date().toISOString(),
      url: body.url,
    };

    vacantes.push(newVacante);

    return NextResponse.json({
      success: true,
      message: "Vacante created successfully",
      vacante: newVacante,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }
}

// DELETE - Remove a vacante by ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing id parameter" },
        { status: 400 }
      );
    }

    const index = vacantes.findIndex(v => v.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Vacante not found" },
        { status: 404 }
      );
    }

    vacantes.splice(index, 1);

    return NextResponse.json({
      success: true,
      message: "Vacante deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
