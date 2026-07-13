"use client";

import { useAccesly } from "@accesly/react";
import { useEffect, useState } from "react";

const ADMIN_WALLETS = (process.env.NEXT_PUBLIC_ADMIN_WALLETS ?? "")
  .split(",")
  .map((w) => w.trim())
  .filter(Boolean);

const RAW_CAL = process.env.NEXT_PUBLIC_ADMIN_CALENDAR_URL ?? process.env.NEXT_PUBLIC_CALENDLY_URL ?? "";
const CAL_EMBED =
  RAW_CAL.includes("calendar.google.com") && !/[?&]gv=true/.test(RAW_CAL)
    ? RAW_CAL + (RAW_CAL.includes("?") ? "&" : "?") + "gv=true"
    : RAW_CAL;

interface Submission {
  type: "cv" | "asesoria";
  nombre: string;
  email: string;
  whatsapp: string;
  mensaje?: string;
  tema?: string;
  pdf?: string;
  submittedAt: number;
  source: "blob" | "local";
}

const fmtDate = (ms: number) => {
  try {
    return new Date(ms).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return "—";
  }
};

export default function AdminPage() {
  const { auth, wallet } = useAccesly();
  const loggedIn = auth.status === "authenticated";

  const [addr, setAddr] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<{ cvs: Submission[]; asesorias: Submission[] } | null>(null);
  const [err, setErr] = useState("");
  const [tab, setTab] = useState<"cvs" | "reuniones">("cvs");

  // Resolve the logged-in wallet.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!loggedIn) {
        setReady(true);
        return;
      }
      try {
        const r = await wallet.fetchRemote();
        if (!cancelled) setAddr(r?.walletAddress ?? null);
      } catch {
        /* no wallet */
      }
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [loggedIn, wallet]);

  const isAdmin = !!addr && ADMIN_WALLETS.includes(addr);

  // Load submissions once authorized.
  useEffect(() => {
    if (!isAdmin || !addr) return;
    let cancelled = false;
    void (async () => {
      try {
        const r = await fetch("/api/admin/submissions", { headers: { "x-admin-wallet": addr } });
        const d = await r.json();
        if (cancelled) return;
        if (d.ok) setData({ cvs: d.cvs, asesorias: d.asesorias });
        else setErr(d.error || "Error al cargar.");
      } catch {
        if (!cancelled) setErr("No se pudieron cargar los datos.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin, addr]);

  // ---- States ----
  if (!ready) {
    return (
      <Shell>
        <div className="w-8 h-8 border-3 border-opportuni-rosa border-t-transparent rounded-full animate-spin mx-auto mt-20" />
      </Shell>
    );
  }

  if (!loggedIn) {
    return (
      <Shell>
        <Card>
          <h1 className="text-2xl font-black mb-2">Dashboard privado</h1>
          <p className="text-sm text-gray-500 mb-5">Inicia sesión para acceder.</p>
          <button onClick={() => auth.signInWithGoogle()} className="btn-rosa w-full text-center">Iniciar sesión ✦</button>
        </Card>
      </Shell>
    );
  }

  if (!isAdmin) {
    return (
      <Shell>
        <Card>
          <div className="text-4xl mb-2 text-center">🔒</div>
          <h1 className="text-2xl font-black mb-2 text-center">Sin acceso</h1>
          <p className="text-sm text-gray-500 mb-4 text-center">Esta cuenta no está autorizada para el dashboard.</p>
          <p className="text-[11px] font-mono font-bold uppercase mb-1" style={{ color: "var(--nar)" }}>Tu wallet</p>
          <code className="block text-[11px] font-mono px-2 py-2 rounded-lg break-all mb-4" style={{ background: "var(--cream2)" }}>
            {addr ?? "sin wallet"}
          </code>
          <p className="text-xs text-gray-500 mb-4">Para dar acceso, agrega esta dirección a <code>NEXT_PUBLIC_ADMIN_WALLETS</code> en el env.</p>
          <button onClick={() => auth.signOut()} className="w-full py-2.5 rounded-full font-bold text-sm" style={{ background: "white", border: "2.5px solid var(--dark)", boxShadow: "2px 2px 0 var(--dark)", cursor: "pointer" }}>
            Cerrar sesión
          </button>
        </Card>
      </Shell>
    );
  }

  // ---- Admin dashboard ----
  return (
    <Shell wide>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-opportuni.png" alt="" style={{ height: 32 }} />
          <h1 className="font-gabarito text-xl font-black">Dashboard</h1>
        </div>
        <button onClick={() => auth.signOut()} className="text-sm font-bold px-4 py-2 rounded-full" style={{ border: "2px solid var(--dark)", background: "white", cursor: "pointer" }}>
          Salir
        </button>
      </div>

      <div className="flex gap-2 mb-5">
        <Tab active={tab === "cvs"} onClick={() => setTab("cvs")}>CVs {data ? `(${data.cvs.length})` : ""}</Tab>
        <Tab active={tab === "reuniones"} onClick={() => setTab("reuniones")}>Reuniones {data ? `(${data.asesorias.length})` : ""}</Tab>
      </div>

      {err && <p className="text-sm text-red-600 mb-4">{err}</p>}
      {!data && !err && <div className="w-6 h-6 border-3 border-opportuni-rosa border-t-transparent rounded-full animate-spin" />}

      {data && tab === "cvs" && (
        <SubTable
          rows={data.cvs}
          cols={["Fecha", "Nombre", "Email", "WhatsApp", "Mensaje", "CV"]}
          render={(s) => [
            fmtDate(s.submittedAt),
            s.nombre,
            s.email,
            s.whatsapp,
            s.mensaje || "—",
            s.pdf ? (
              <a href={`/api/admin/download?ref=${encodeURIComponent(s.pdf)}&w=${encodeURIComponent(addr!)}`} className="font-bold" style={{ color: "var(--rosa)" }}>
                Descargar
              </a>
            ) : ("—"),
          ]}
          empty="Aún no hay CVs."
        />
      )}

      {data && tab === "reuniones" && (
        <>
          <SubTable
            rows={data.asesorias}
            cols={["Fecha", "Nombre", "Email", "WhatsApp", "Tema"]}
            render={(s) => [fmtDate(s.submittedAt), s.nombre, s.email, s.whatsapp, s.tema || "—"]}
            empty="Aún no hay solicitudes de asesoría."
          />
          <h2 className="font-gabarito font-black mt-8 mb-3">Agenda</h2>
          {CAL_EMBED ? (
            <div className="bento overflow-hidden" style={{ height: 640 }}>
              <iframe src={CAL_EMBED} title="Agenda de Vianey" style={{ width: "100%", height: "100%", border: "none" }} />
            </div>
          ) : (
            <p className="text-sm text-gray-500">Configura <code>NEXT_PUBLIC_ADMIN_CALENDAR_URL</code> para ver la agenda embebida.</p>
          )}
        </>
      )}
    </Shell>
  );
}

/* ---------- presentational ---------- */

function Shell({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "var(--cream)" }}>
      <div style={{ maxWidth: wide ? 1100 : 420, margin: "0 auto" }}>{children}</div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bento p-8" style={{ background: "var(--cream)", marginTop: 60 }}>{children}</div>;
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full text-sm font-bold"
      style={{
        border: "2.5px solid var(--dark)",
        background: active ? "var(--rosa)" : "white",
        color: active ? "white" : "var(--dark)",
        boxShadow: active ? "2px 2px 0 var(--dark)" : "none",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function SubTable({
  rows,
  cols,
  render,
  empty,
}: {
  rows: Submission[];
  cols: string[];
  render: (s: Submission) => React.ReactNode[];
  empty: string;
}) {
  if (!rows.length) return <p className="text-sm text-gray-500 py-8 text-center">{empty}</p>;
  return (
    <div className="bento overflow-x-auto" style={{ background: "white", padding: 0 }}>
      <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "var(--cream2)" }}>
            {cols.map((c) => (
              <th key={c} className="text-left font-mono text-[11px] uppercase px-3 py-2" style={{ color: "var(--nar)" }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((s, i) => (
            <tr key={i} style={{ borderTop: "1px solid #eee" }}>
              {render(s).map((cell, j) => (
                <td key={j} className="px-3 py-2 align-top">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
