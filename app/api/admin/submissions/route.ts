import { NextRequest, NextResponse } from "next/server";
import { listSubmissions, isAdminWallet } from "../../../lib/submissions";

export const runtime = "nodejs";

// Lists CV + asesoría submissions for the admin dashboard. Gated by the
// caller's Accesly wallet (sent in x-admin-wallet) against NEXT_PUBLIC_ADMIN_WALLETS.
export async function GET(req: NextRequest) {
  const wallet = req.headers.get("x-admin-wallet");
  if (!isAdminWallet(wallet)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }
  const all = await listSubmissions();
  return NextResponse.json({
    ok: true,
    cvs: all.filter((s) => s.type === "cv"),
    asesorias: all.filter((s) => s.type === "asesoria"),
  });
}
