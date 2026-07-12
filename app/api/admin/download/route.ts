import { NextRequest, NextResponse } from "next/server";
import { getPdf, isAdminWallet } from "../../../lib/submissions";

export const runtime = "nodejs";

// Streams a CV PDF for download. Gated by the admin wallet (query `w` — an
// <a href> can't set custom headers). Pilot-grade; wallet is public.
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const wallet = req.headers.get("x-admin-wallet") ?? url.searchParams.get("w");
  if (!isAdminWallet(wallet)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }
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
