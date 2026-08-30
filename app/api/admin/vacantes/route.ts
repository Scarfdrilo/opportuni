import { NextRequest, NextResponse } from "next/server";
import { ADMIN_API_ENABLED } from "../../../lib/submissions";
import { sbRpc } from "../../../lib/supabase";

export const runtime = "nodejs";

interface VacStat {
  vacante_id: string;
  titulo: string;
  empresa: string | null;
  activa: boolean;
  clicks: number;
  postulantes: number;
  created_at: string;
}

interface Postulante {
  nombre: string;
  carrera_area: string;
  whatsapp: string;
  cv_link: string | null;
  created_at: string;
}

// Conteos de clicks/postulantes por vacante para el dashboard admin.
// Con ?vacante={id} devuelve el detalle de postulantes de esa vacante.
// Desactivada junto con el resto del dashboard (ver ADMIN_API_ENABLED).
export async function GET(req: NextRequest) {
  if (!ADMIN_API_ENABLED) {
    return NextResponse.json(
      { ok: false, error: "El dashboard está desactivado." },
      { status: 503 }
    );
  }
  const vacanteId = new URL(req.url).searchParams.get("vacante");
  try {
    if (vacanteId) {
      const postulantes = await sbRpc<Postulante[]>("postulantes_por_vacante", { vid: vacanteId });
      return NextResponse.json({ ok: true, postulantes });
    }
    const stats = await sbRpc<VacStat[]>("vacante_stats");
    return NextResponse.json({ ok: true, stats });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Error al consultar." },
      { status: 500 }
    );
  }
}

// POST — crea una vacante nueva desde el dashboard admin.
export async function POST(req: NextRequest) {
  if (!ADMIN_API_ENABLED) {
    return NextResponse.json(
      { ok: false, error: "El dashboard está desactivado." },
      { status: 503 }
    );
  }
  try {
    const body = await req.json();
    const id = String(body.id ?? "").trim().toLowerCase();
    const titulo = String(body.titulo ?? "").trim();
    const tipo = String(body.tipo ?? "").trim();

    if (!/^[a-z0-9][a-z0-9-]{1,39}$/.test(id)) {
      return NextResponse.json(
        { ok: false, error: "El id debe ser un slug corto: letras, números y guiones (ej. pm-nubank)." },
        { status: 400 }
      );
    }
    if (!titulo) {
      return NextResponse.json({ ok: false, error: "Falta el título." }, { status: 400 });
    }
    if (tipo && !["remoto", "presencial", "hibrido"].includes(tipo)) {
      return NextResponse.json({ ok: false, error: "Tipo inválido." }, { status: 400 });
    }

    await sbRpc("crear_vacante", {
      p_id: id,
      p_titulo: titulo,
      p_empresa: String(body.empresa ?? "").trim(),
      p_ubicacion: String(body.ubicacion ?? "").trim(),
      p_tipo: tipo,
      p_salario: String(body.salario ?? "").trim(),
      p_descripcion: String(body.descripcion ?? "").trim(),
      p_url_destino: String(body.urlDestino ?? "").trim(),
    });

    return NextResponse.json({ ok: true, id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error al crear.";
    const friendly = msg.includes("duplicate key")
      ? "Ya existe una vacante con ese id. Usa otro slug."
      : msg;
    return NextResponse.json({ ok: false, error: friendly }, { status: 500 });
  }
}
