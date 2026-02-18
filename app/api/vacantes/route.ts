import { NextRequest, NextResponse } from "next/server";
import { Vacante, getVacantes, addVacante, removeVacante, vacantes } from "../../lib/vacantes-store";

// GET - List all vacantes
export async function GET() {
  return NextResponse.json({
    success: true,
    count: vacantes.length,
    vacantes: getVacantes(),
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

    addVacante(newVacante);

    return NextResponse.json({
      success: true,
      message: "Vacante created successfully",
      vacante: newVacante,
    }, { status: 201 });
  } catch {
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

    const removed = removeVacante(id);
    if (!removed) {
      return NextResponse.json(
        { success: false, error: "Vacante not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Vacante deleted successfully",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
