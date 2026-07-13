import { NextRequest, NextResponse } from "next/server";
import { saveSubmission } from "../../lib/submissions";

export const runtime = "nodejs";

// CV submission: contact form + PDF, after a successful CV payment.
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    const nombre = String(form.get("nombre") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const whatsapp = String(form.get("whatsapp") ?? "").trim();
    const mensaje = String(form.get("mensaje") ?? "").trim();

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "No se recibió ningún archivo." }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ ok: false, error: "El archivo debe ser un PDF." }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "El PDF supera los 10 MB." }, { status: 400 });
    }
    if (!nombre || !email || !whatsapp) {
      return NextResponse.json({ ok: false, error: "Faltan datos de contacto." }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const storedTo = await saveSubmission(
      "cv",
      { nombre, email, whatsapp, mensaje, fileName: file.name, submittedAt: Date.now() },
      bytes
    );
    return NextResponse.json({ ok: true, storedTo });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Error al guardar el archivo." },
      { status: 500 }
    );
  }
}
