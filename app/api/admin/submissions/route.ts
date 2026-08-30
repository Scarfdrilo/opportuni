import { NextResponse } from "next/server";
import { listSubmissions, ADMIN_API_ENABLED } from "../../../lib/submissions";

export const runtime = "nodejs";

// Lista los CVs + asesorías del dashboard admin. Desactivada: el gate por
// wallet Accesly se retiró y todavía no hay uno nuevo (ver ADMIN_API_ENABLED).
export async function GET() {
  if (!ADMIN_API_ENABLED) {
    return NextResponse.json(
      { ok: false, error: "El dashboard está desactivado." },
      { status: 503 }
    );
  }
  const all = await listSubmissions();
  return NextResponse.json({
    ok: true,
    cvs: all.filter((s) => s.type === "cv"),
    asesorias: all.filter((s) => s.type === "asesoria"),
  });
}
