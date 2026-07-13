import { NextRequest, NextResponse } from "next/server";
import { saveSubmission } from "../../lib/submissions";

export const runtime = "nodejs";

// Asesoría request: contact form after a successful Asesoría payment, so Vianey
// has a record of who booked (the actual slot lives in her Google Calendar).
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const nombre = String(body.nombre ?? "").trim();
    const email = String(body.email ?? "").trim();
    const whatsapp = String(body.whatsapp ?? "").trim();
    const tema = String(body.tema ?? "").trim();

    if (!nombre || !email || !whatsapp) {
      return NextResponse.json({ ok: false, error: "Faltan datos de contacto." }, { status: 400 });
    }

    const storedTo = await saveSubmission("asesoria", { nombre, email, whatsapp, tema, submittedAt: Date.now() });
    return NextResponse.json({ ok: true, storedTo });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Error al guardar." },
      { status: 500 }
    );
  }
}
