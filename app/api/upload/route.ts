import { NextRequest, NextResponse } from "next/server";
import { saveSubmission } from "../../lib/submissions";

export const runtime = "nodejs";

const FIELDS = [
  "nombre", "email", "whatsapp", "ciudadPais", "linkedin", "objetivo",
  "puestoObjetivo", "linkVacante", "carrera", "universidad", "fechasEstudio",
  "reconocimientos", "experiencia", "skills", "idiomas", "algoMas",
] as const;

const REQUIRED = [
  "nombre", "email", "whatsapp", "ciudadPais", "objetivo", "puestoObjetivo",
  "carrera", "universidad", "fechasEstudio", "experiencia", "skills", "idiomas",
] as const;

// CV intake form (+ optional PDF), after a successful CV payment.
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const meta: Record<string, string> = {};
    for (const f of FIELDS) meta[f] = String(form.get(f) ?? "").trim();

    for (const f of REQUIRED) {
      if (!meta[f]) return NextResponse.json({ ok: false, error: `Falta el campo: ${f}` }, { status: 400 });
    }

    // PDF is now OPTIONAL.
    let bytes: Buffer | undefined;
    const file = form.get("file");
    if (file instanceof File && file.size > 0) {
      if (file.type !== "application/pdf") {
        return NextResponse.json({ ok: false, error: "El archivo debe ser un PDF." }, { status: 400 });
      }
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ ok: false, error: "El PDF supera los 10 MB." }, { status: 400 });
      }
      bytes = Buffer.from(await file.arrayBuffer());
      meta.fileName = file.name;
    }

    const storedTo = await saveSubmission("cv", { ...meta, submittedAt: Date.now() }, bytes);
    return NextResponse.json({ ok: true, storedTo });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Error al guardar." },
      { status: 500 }
    );
  }
}
