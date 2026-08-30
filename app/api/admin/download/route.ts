import { NextRequest, NextResponse } from "next/server";
import { getPdf, ADMIN_API_ENABLED } from "../../../lib/submissions";

export const runtime = "nodejs";

// Descarga el PDF de un CV. Desactivada junto con el dashboard: sin gate, esto
// serviría CVs a cualquiera con la URL (ver ADMIN_API_ENABLED).
export async function GET(req: NextRequest) {
  if (!ADMIN_API_ENABLED) {
    return NextResponse.json(
      { ok: false, error: "El dashboard está desactivado." },
      { status: 503 }
    );
  }
  const url = new URL(req.url);
  const ref = url.searchParams.get("ref") ?? "";
  const pdf = await getPdf(ref);
  if (!pdf) {
    return NextResponse.json({ ok: false, error: "No encontrado." }, { status: 404 });
  }
  return new NextResponse(pdf.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${pdf.filename}"`,
    },
  });
}
