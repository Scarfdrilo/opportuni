import { NextRequest, NextResponse } from "next/server";
import { getVacanteById, sbInsert } from "../../lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Link corto por vacante: /v/{id} → 302 registrando el click en
// `vacante_clicks`. Va al url_destino si la vacante tiene uno (vacante
// externa); si no, al detalle interno /vacantes/{id}. Un fallo al registrar
// nunca rompe el redirect.
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  let dest = new URL("/vacantes", req.url).toString();
  try {
    const v = await getVacanteById(params.id);
    if (v?.activa) {
      dest = v.url_destino || new URL(`/vacantes/${encodeURIComponent(v.id)}`, req.url).toString();
      try {
        await sbInsert("vacante_clicks", { vacante_id: v.id });
      } catch {
        /* click no registrado; el usuario llega igual */
      }
    }
  } catch {
    /* Supabase inalcanzable → manda a /vacantes */
  }
  return NextResponse.redirect(dest, 302);
}
