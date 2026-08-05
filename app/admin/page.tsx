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
  // CV intake fields
  ciudadPais?: string;
  linkedin?: string;
  objetivo?: string;
  puestoObjetivo?: string;
  linkVacante?: string;
  carrera?: string;
  universidad?: string;
  fechasEstudio?: string;
  reconocimientos?: string;
  experiencia?: string;
  skills?: string;
  idiomas?: string;
  algoMas?: string;
  fileName?: string;
}

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
  const [tab, setTab] = useState<"cvs" | "reuniones" | "vacantes">("cvs");
  const [detail, setDetail] = useState<Submission | null>(null);
  const [stats, setStats] = useState<VacStat[] | null>(null);
  const [statsErr, setStatsErr] = useState("");
  const [statsV, setStatsV] = useState(0);
  const [vacDetail, setVacDetail] = useState<VacStat | null>(null);
  const [showNewVac, setShowNewVac] = useState(false);

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

  // Load vacante click/postulante stats (Supabase) once authorized.
  useEffect(() => {
    if (!isAdmin || !addr) return;
    let cancelled = false;
    void (async () => {
      try {
        const r = await fetch("/api/admin/vacantes", { headers: { "x-admin-wallet": addr } });
        const d = await r.json();
        if (cancelled) return;
        if (d.ok) setStats(d.stats);
        else setStatsErr(d.error || "Error al cargar vacantes.");
      } catch {
        if (!cancelled) setStatsErr("No se pudieron cargar las vacantes.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin, addr, statsV]);

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
        <Tab active={tab === "vacantes"} onClick={() => setTab("vacantes")}>Vacantes {stats ? `(${stats.length})` : ""}</Tab>
      </div>

      {err && <p className="text-sm text-red-600 mb-4">{err}</p>}
      {!data && !err && <div className="w-6 h-6 border-3 border-opportuni-rosa border-t-transparent rounded-full animate-spin" />}

      {data && tab === "cvs" && (
        <SubTable
          rows={data.cvs}
          cols={["Fecha", "Nombre", "Puesto objetivo", "Email", ""]}
          render={(s) => [
            fmtDate(s.submittedAt),
            s.nombre,
            s.puestoObjetivo || "—",
            s.email,
            <button key="v" onClick={() => setDetail(s)} className="font-bold" style={{ color: "var(--rosa)", cursor: "pointer", background: "none", border: "none" }}>
              Ver detalle
            </button>,
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

      {tab === "vacantes" && (
        <>
          <button onClick={() => setShowNewVac(true)} className="btn-rosa mb-4 px-5 py-2.5 text-sm">
            ＋ Nueva vacante
          </button>
          {statsErr && <p className="text-sm text-red-600 mb-4">{statsErr}</p>}
          {!stats && !statsErr && <div className="w-6 h-6 border-3 border-opportuni-rosa border-t-transparent rounded-full animate-spin" />}
          {stats && (
            <SubTable
              rows={stats}
              cols={["Vacante", "Empresa", "Clicks", "Postulantes", "Links", ""]}
              render={(v) => [
                <span key="t">
                  {v.titulo}
                  {!v.activa && <span className="text-xs text-gray-400 ml-2">(inactiva)</span>}
                  <span className="block text-xs text-gray-400 font-mono">/v/{v.vacante_id}</span>
                </span>,
                v.empresa || "—",
                <b key="c">{v.clicks}</b>,
                <b key="p">{v.postulantes}</b>,
                <CopyLinks key="l" id={v.vacante_id} />,
                <button key="v" onClick={() => setVacDetail(v)} className="font-bold" style={{ color: "var(--rosa)", cursor: "pointer", background: "none", border: "none" }}>
                  Ver postulantes
                </button>,
              ]}
              empty="Aún no hay vacantes. Crea la primera con el botón de arriba."
            />
          )}
          <p className="text-xs text-gray-400 mt-3">
            El link corto y el form de cada vacante quedan activos al instante al crearla.
            Si la vacante no tiene URL externa, el link corto lleva a su página de detalle en Opportuni.
          </p>
        </>
      )}

      {detail && <DetailModal s={detail} adminWallet={addr!} onClose={() => setDetail(null)} />}
      {vacDetail && <PostulantesModal v={vacDetail} adminWallet={addr!} onClose={() => setVacDetail(null)} />}
      {showNewVac && (
        <NewVacanteModal
          adminWallet={addr!}
          onClose={() => setShowNewVac(false)}
          onCreated={() => setStatsV((v) => v + 1)}
        />
      )}
    </Shell>
  );
}

/* ---------- vacantes: alta, links + postulantes ---------- */

const slugify = (s: string) =>
  s.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);

function NewVacanteModal({ adminWallet, onClose, onCreated }: { adminWallet: string; onClose: () => void; onCreated: () => void }) {
  const [titulo, setTitulo] = useState("");
  const [id, setId] = useState("");
  const [idTouched, setIdTouched] = useState(false);
  const [empresa, setEmpresa] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [tipo, setTipo] = useState("remoto");
  const [salario, setSalario] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [urlDestino, setUrlDestino] = useState("");
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState("");

  const finalId = idTouched ? id : slugify(titulo);
  const valid = titulo.trim() && /^[a-z0-9][a-z0-9-]{1,39}$/.test(finalId);

  const submit = async () => {
    if (!valid) return;
    setSaving(true);
    setErr("");
    try {
      const r = await fetch("/api/admin/vacantes", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-wallet": adminWallet },
        body: JSON.stringify({ id: finalId, titulo, empresa, ubicacion, tipo, salario, descripcion, urlDestino }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error || "No se pudo crear.");
      setCreated(true);
      onCreated();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error al crear.");
    } finally {
      setSaving(false);
    }
  };

  const copy = (path: string) => {
    void navigator.clipboard.writeText(`${window.location.origin}${path}`);
    setCopied(path);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div onClick={(e) => e.stopPropagation()} className="bento" style={{ background: "var(--cream)", width: "min(94vw, 480px)", maxHeight: "90vh", overflowY: "auto", padding: 24, position: "relative" }}>
        <button onClick={onClose} aria-label="Cerrar" style={{ position: "absolute", top: 12, right: 14, border: "none", background: "transparent", fontSize: 20, cursor: "pointer", color: "var(--dark)", lineHeight: 1 }}>✕</button>

        {created ? (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div className="text-5xl mb-2">🎉</div>
            <h3 className="text-2xl font-black mb-2">¡Vacante creada!</h3>
            <p className="text-sm text-gray-500 mb-4">Comparte estos links — ya están activos:</p>
            <div className="text-left rounded-xl px-4 py-3 mb-4 space-y-2" style={{ background: "var(--cream2)", border: "2px solid var(--dark)" }}>
              <div>
                <p className="text-[11px] font-mono font-bold uppercase" style={{ color: "var(--nar)" }}>Link corto (WhatsApp)</p>
                <button onClick={() => copy(`/v/${finalId}`)} className="text-sm font-mono font-bold break-all text-left" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--rosa)" }}>
                  {copied === `/v/${finalId}` ? "✓ Copiado" : `/v/${finalId} 📋`}
                </button>
              </div>
              <div>
                <p className="text-[11px] font-mono font-bold uppercase" style={{ color: "var(--nar)" }}>Form de postulación</p>
                <button onClick={() => copy(`/postular/${finalId}`)} className="text-sm font-mono font-bold break-all text-left" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--rosa)" }}>
                  {copied === `/postular/${finalId}` ? "✓ Copiado" : `/postular/${finalId} 📋`}
                </button>
              </div>
            </div>
            <button onClick={onClose} className="btn-rosa w-full text-center">Listo</button>
          </div>
        ) : (
          <div>
            <h3 className="text-2xl font-black mb-4 text-center">Nueva vacante</h3>

            <label className="block text-xs font-bold mb-1">Título *</label>
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej. Product Manager Jr" className="input-bento w-full mb-3" />

            <label className="block text-xs font-bold mb-1">Link corto (slug) *</label>
            <div className="flex items-center gap-1 mb-3">
              <span className="text-xs font-mono text-gray-400">/v/</span>
              <input
                value={finalId}
                onChange={(e) => { setIdTouched(true); setId(slugify(e.target.value)); }}
                placeholder="pm-nubank"
                className="input-bento flex-1 font-mono text-sm"
              />
            </div>

            <label className="block text-xs font-bold mb-1">Empresa</label>
            <input value={empresa} onChange={(e) => setEmpresa(e.target.value)} placeholder="Ej. Nubank" className="input-bento w-full mb-3" />

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-xs font-bold mb-1">Tipo</label>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="input-bento w-full">
                  <option value="remoto">Remoto</option>
                  <option value="presencial">Presencial</option>
                  <option value="hibrido">Híbrido</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Ubicación</label>
                <input value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} placeholder="CDMX" className="input-bento w-full" />
              </div>
            </div>

            <label className="block text-xs font-bold mb-1">Salario</label>
            <input value={salario} onChange={(e) => setSalario(e.target.value)} placeholder="Ej. $20,000 MXN (opcional)" className="input-bento w-full mb-3" />

            <label className="block text-xs font-bold mb-1">Descripción</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} placeholder="De qué va el puesto…" className="input-bento w-full mb-3" />

            <label className="block text-xs font-bold mb-1">URL externa (opcional)</label>
            <p className="text-[11px] text-gray-400 mb-1 leading-snug">Si la llenas, el link corto manda ahí. Si la dejas vacía, manda al detalle de la vacante en Opportuni (con botón de postulación).</p>
            <input value={urlDestino} onChange={(e) => setUrlDestino(e.target.value)} placeholder="https://…" className="input-bento w-full mb-4" />

            {err && <p className="text-sm text-red-600 mb-3 text-center">{err}</p>}

            <button onClick={submit} disabled={!valid || saving} className="btn-rosa w-full text-center disabled:opacity-50">
              {saving ? "Creando…" : "Crear vacante ✦"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CopyLinks({ id }: { id: string }) {
  const [copied, setCopied] = useState<"v" | "p" | null>(null);
  const copy = (kind: "v" | "p") => {
    const path = kind === "v" ? `/v/${id}` : `/postular/${id}`;
    void navigator.clipboard.writeText(`${window.location.origin}${path}`);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1500);
  };
  const style: React.CSSProperties = {
    border: "2px solid var(--dark)",
    background: "white",
    borderRadius: 999,
    padding: "2px 10px",
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
  };
  return (
    <span className="flex gap-1.5 flex-wrap">
      <button onClick={() => copy("v")} style={style}>{copied === "v" ? "✓ Copiado" : "Link corto"}</button>
      <button onClick={() => copy("p")} style={style}>{copied === "p" ? "✓ Copiado" : "Form"}</button>
    </span>
  );
}

function PostulantesModal({ v, adminWallet, onClose }: { v: VacStat; adminWallet: string; onClose: () => void }) {
  const [rows, setRows] = useState<Postulante[] | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const r = await fetch(`/api/admin/vacantes?vacante=${encodeURIComponent(v.vacante_id)}`, {
          headers: { "x-admin-wallet": adminWallet },
        });
        const d = await r.json();
        if (cancelled) return;
        if (d.ok) setRows(d.postulantes);
        else setErr(d.error || "Error al cargar.");
      } catch {
        if (!cancelled) setErr("No se pudieron cargar los postulantes.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [v.vacante_id, adminWallet]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div onClick={(e) => e.stopPropagation()} className="bento" style={{ background: "var(--cream)", width: "min(94vw, 560px)", maxHeight: "88vh", overflowY: "auto", padding: 24, position: "relative" }}>
        <button onClick={onClose} aria-label="Cerrar" style={{ position: "absolute", top: 12, right: 14, border: "none", background: "transparent", fontSize: 20, cursor: "pointer", color: "var(--dark)", lineHeight: 1 }}>✕</button>

        <h2 className="text-2xl font-black mb-1">{v.titulo}</h2>
        <p className="text-xs text-gray-400 font-mono mb-4">
          {v.clicks} clicks · {v.postulantes} postulantes
        </p>

        {err && <p className="text-sm text-red-600">{err}</p>}
        {!rows && !err && <div className="w-6 h-6 border-3 border-opportuni-rosa border-t-transparent rounded-full animate-spin" />}
        {rows && rows.length === 0 && <p className="text-sm text-gray-500">Aún no hay postulantes.</p>}
        {rows?.map((p, i) => (
          <div key={i} className="rounded-xl px-4 py-3 mb-2" style={{ background: "var(--cream2)", border: "2px solid var(--dark)" }}>
            <p className="font-bold text-sm">{p.nombre}</p>
            <p className="text-xs text-gray-500">{p.carrera_area} · {p.whatsapp}</p>
            {p.cv_link && (
              <a href={p.cv_link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold break-all" style={{ color: "var(--rosa)" }}>
                {p.cv_link}
              </a>
            )}
            <p className="text-[11px] text-gray-400 mt-1">{fmtDate(new Date(p.created_at).getTime())}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- detail modal ---------- */

const CV_FIELDS: { key: keyof Submission; label: string }[] = [
  { key: "ciudadPais", label: "Ciudad y país" },
  { key: "linkedin", label: "LinkedIn / portafolio" },
  { key: "objetivo", label: "Objetivo del CV" },
  { key: "puestoObjetivo", label: "Puesto objetivo" },
  { key: "linkVacante", label: "Link de vacante" },
  { key: "carrera", label: "Carrera / estudios" },
  { key: "universidad", label: "Universidad (historial)" },
  { key: "fechasEstudio", label: "Fechas de estudio" },
  { key: "reconocimientos", label: "Reconocimientos" },
  { key: "experiencia", label: "Experiencia" },
  { key: "skills", label: "Skills y herramientas" },
  { key: "idiomas", label: "Idiomas" },
  { key: "algoMas", label: "Algo más" },
  { key: "mensaje", label: "Mensaje" },
];

function DetailModal({ s, adminWallet, onClose }: { s: Submission; adminWallet: string; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div onClick={(e) => e.stopPropagation()} className="bento" style={{ background: "var(--cream)", width: "min(94vw, 560px)", maxHeight: "88vh", overflowY: "auto", padding: 24, position: "relative" }}>
        <button onClick={onClose} aria-label="Cerrar" style={{ position: "absolute", top: 12, right: 14, border: "none", background: "transparent", fontSize: 20, cursor: "pointer", color: "var(--dark)", lineHeight: 1 }}>✕</button>

        <h2 className="text-2xl font-black mb-1">{s.nombre}</h2>
        <p className="text-xs text-gray-400 font-mono mb-4">{fmtDate(s.submittedAt)} · {s.source}</p>

        <Detail label="Correo" value={s.email} />
        <Detail label="WhatsApp" value={s.whatsapp} />
        {CV_FIELDS.map(({ key, label }) => {
          const v = s[key];
          return typeof v === "string" && v.trim() ? <Detail key={key} label={label} value={v} /> : null;
        })}

        {s.pdf ? (
          <a
            href={`/api/admin/download?ref=${encodeURIComponent(s.pdf)}&w=${encodeURIComponent(adminWallet)}`}
            className="inline-block mt-4 py-2.5 px-5 rounded-full font-bold text-sm text-white"
            style={{ background: "var(--rosa)", border: "2.5px solid var(--dark)", boxShadow: "2px 2px 0 var(--dark)" }}
          >
            ⬇ Descargar CV (PDF)
          </a>
        ) : (
          <p className="text-xs text-gray-400 mt-4">No adjuntó CV en PDF.</p>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3">
      <p className="text-[11px] font-mono font-bold uppercase mb-0.5" style={{ color: "var(--nar)" }}>{label}</p>
      <p className="text-sm whitespace-pre-wrap break-words">{value}</p>
    </div>
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

function SubTable<T>({
  rows,
  cols,
  render,
  empty,
}: {
  rows: T[];
  cols: string[];
  render: (s: T) => React.ReactNode[];
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
