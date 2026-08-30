"use client";

import { useState } from "react";

const RAW = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "";
const EMBED =
  RAW.includes("calendar.google.com") && !/[?&]gv=true/.test(RAW)
    ? RAW + (RAW.includes("?") ? "&" : "?") + "gv=true"
    : RAW;

// After paying for Asesoría: capture a contact form (so Vianey has the record
// in the dashboard), then show the Google Calendar to book the slot.
export default function AsesoriaModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"form" | "calendar">("form");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [tema, setTema] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const valid = nombre.trim() && email.trim() && whatsapp.trim();

  const submit = async () => {
    if (!valid) return;
    setSaving(true);
    setErr("");
    try {
      const r = await fetch("/api/asesoria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombre.trim(), email: email.trim(), whatsapp: whatsapp.trim(), tema: tema.trim() }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error || "No se pudo registrar.");
      setStep("calendar");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error al registrar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bento"
        style={{
          background: "var(--cream)",
          width: step === "calendar" ? "min(94vw, 720px)" : "min(92vw, 440px)",
          height: step === "calendar" ? "min(88vh, 760px)" : "auto",
          maxHeight: "88vh",
          overflowY: step === "calendar" ? "hidden" : "auto",
          padding: step === "calendar" ? 0 : 24,
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {step === "form" ? (
          <>
            <button onClick={onClose} aria-label="Cerrar" style={{ position: "absolute", top: 12, right: 14, border: "none", background: "transparent", fontSize: 20, cursor: "pointer", color: "var(--dark)", lineHeight: 1 }}>✕</button>
            <div className="text-center mb-4">
              <div className="text-4xl mb-1">🗓️</div>
              <h3 className="text-2xl font-black mb-1">Agenda tu asesoría</h3>
              <p className="text-sm text-gray-500">Déjanos tus datos y luego eliges el horario. ✦</p>
            </div>

            <label className="block text-xs font-bold mb-1">Nombre completo *</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" className="input-bento w-full mb-3" />

            <label className="block text-xs font-bold mb-1">Email *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" className="input-bento w-full mb-3" />

            <label className="block text-xs font-bold mb-1">WhatsApp *</label>
            <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+52 55 1234 5678" className="input-bento w-full mb-3" />

            <label className="block text-xs font-bold mb-1">¿Qué quieres trabajar? (opcional)</label>
            <textarea value={tema} onChange={(e) => setTema(e.target.value)} placeholder="Ej. estrategia de carrera, cambio de área…" rows={2} className="input-bento w-full mb-3" />

            {err && <p className="text-sm text-red-600 mb-3 text-center">{err}</p>}

            <button onClick={submit} disabled={!valid || saving} className="btn-rosa w-full text-center disabled:opacity-50">
              {saving ? "Guardando…" : "Continuar al calendario ✦"}
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "2.5px solid var(--dark)" }}>
              <span className="font-gabarito font-black">Elige tu horario</span>
              <button onClick={onClose} aria-label="Cerrar" style={{ border: "none", background: "transparent", fontSize: 20, cursor: "pointer", color: "var(--dark)", lineHeight: 1 }}>✕</button>
            </div>
            {EMBED ? (
              <>
                <iframe src={EMBED} title="Agenda con Vianey" style={{ flex: 1, width: "100%", border: "none" }} />
                <a href={EMBED} target="_blank" rel="noopener noreferrer" className="text-center text-xs font-bold py-2" style={{ borderTop: "2px solid var(--dark)", color: "var(--rosa)", background: "var(--cream2)" }}>
                  ¿No carga el calendario? Ábrelo en una pestaña →
                </a>
              </>
            ) : (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24 }}>
                <p className="text-sm text-gray-500">Configura <code>NEXT_PUBLIC_CALENDLY_URL</code> para el calendario.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
