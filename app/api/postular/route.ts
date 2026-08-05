import { NextRequest, NextResponse } from "next/server";
import { getVacanteById, sbInsert } from "../../lib/supabase";

export const runtime = "nodejs";

// GET ?vacante={id} — info de la vacante para el encabezado del form.
export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("vacante") ?? "";
  if (!id) return NextResponse.json({ ok: false, error: "Falta vacante." }, { status: 400 });
  try {
    const v = await getVacanteById(id);
    if (!v || !v.activa) {
      return NextResponse.json({ ok: false, error: "Vacante no encontrada." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, vacante: { id: v.id, titulo: v.titulo, empresa: v.empresa } });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Error al consultar." },
      { status: 500 }
    );
  }
}

// POST — registra un postulante ligado a su vacante.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const vacanteId = String(body.vacanteId ?? "").trim();
    const nombre = String(body.nombre ?? "").trim();
    const carreraArea = String(body.carreraArea ?? "").trim();
    const whatsapp = String(body.whatsapp ?? "").trim();
    const cvLink = String(body.cvLink ?? "").trim();

    if (!vacanteId || !nombre || !carreraArea || !whatsapp) {
      return NextResponse.json({ ok: false, error: "Faltan campos requeridos." }, { status: 400 });
    }

    const v = await getVacanteById(vacanteId);
    if (!v || !v.activa) {
      return NextResponse.json({ ok: false, error: "Vacante no encontrada." }, { status: 404 });
    }

    await sbInsert("postulantes", {
      vacante_id: vacanteId,
      nombre,
      carrera_area: carreraArea,
      whatsapp,
      cv_link: cvLink || null,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Error al registrar." },
      { status: 500 }
    );
  }
}
