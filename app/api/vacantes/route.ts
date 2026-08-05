import { NextResponse } from "next/server";
import { listVacantesActivas } from "../../lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lista las vacantes activas desde Supabase (tabla `vacantes`). Las vacantes
// se crean desde /admin (pestaña Vacantes) o en el Table Editor de Supabase.
export async function GET() {
  try {
    const rows = await listVacantesActivas();
    const vacantes = rows.map((v) => ({
      id: v.id,
      titulo: v.titulo,
      empresa: v.empresa ?? "",
      ubicacion: v.ubicacion ?? "",
      tipo: v.tipo ?? "remoto",
      salario: v.salario ?? undefined,
      descripcion: v.descripcion ?? "",
      requisitos: [] as string[],
      fechaPublicacion: v.created_at,
      // Siempre al detalle interno; ahí está el botón de postular y, si
      // existe, el link a la vacante original.
      url: `/vacantes/${encodeURIComponent(v.id)}`,
    }));
    return NextResponse.json({ success: true, count: vacantes.length, vacantes });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : "Error al consultar.", vacantes: [] },
      { status: 500 }
    );
  }
}
