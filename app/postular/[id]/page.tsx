"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Status = "loading" | "notfound" | "form" | "sending" | "done";

interface VacanteInfo {
  id: string;
  titulo: string;
  empresa: string | null;
}

// Form público de postulación: /postular/{vacante_id}. El vacante_id viaja
// oculto en la URL; cada envío queda ligado a su vacante en Supabase.
export default function PostularPage({ params }: { params: { id: string } }) {
  const [status, setStatus] = useState<Status>("loading");
  const [vacante, setVacante] = useState<VacanteInfo | null>(null);
  const [nombre, setNombre] = useState("");
  const [carreraArea, setCarreraArea] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [cvLink, setCvLink] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const r = await fetch(`/api/postular?vacante=${encodeURIComponent(params.id)}`);
        const d = await r.json();
        if (cancelled) return;
        if (d.ok) {
          setVacante(d.vacante);
          setStatus("form");
        } else {
          setStatus("notfound");
        }
      } catch {
        if (!cancelled) setStatus("notfound");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const valid = nombre.trim() && carreraArea.trim() && whatsapp.trim();

  const submit = async () => {
    if (!valid) return;
    setStatus("sending");
    setErr("");
    try {
      const r = await fetch("/api/postular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vacanteId: params.id,
          nombre: nombre.trim(),
          carreraArea: carreraArea.trim(),
          whatsapp: whatsapp.trim(),
          cvLink: cvLink.trim(),
        }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error || "No se pudo enviar.");
      setStatus("done");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error al enviar.");
      setStatus("form");
    }
  };

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "var(--cream)" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div className="flex items-center gap-2 mb-6 justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-opportuni.png" alt="Opportuni" style={{ height: 34 }} />
          <span className="font-gabarito text-xl font-black">Opportuni</span>
        </div>

        {status === "loading" && (
          <div className="w-8 h-8 border-3 border-opportuni-rosa border-t-transparent rounded-full animate-spin mx-auto mt-16" />
        )}

        {status === "notfound" && (
          <div className="bento p-8 text-center" style={{ background: "var(--cream)" }}>
            <div className="text-4xl mb-2">🔍</div>
            <h1 className="text-2xl font-black mb-2">Vacante no encontrada</h1>
            <p className="text-sm text-gray-500 mb-5">Este link ya no está activo o no existe.</p>
            <Link href="/vacantes" className="btn-rosa w-full text-center block">Ver vacantes activas ✦</Link>
          </div>
        )}

        {status === "done" && (
          <div className="bento p-8 text-center" style={{ background: "var(--cream)" }}>
            <div className="text-5xl mb-2">🎉</div>
            <h1 className="text-2xl font-black mb-2">¡Postulación enviada!</h1>
            <p className="text-sm text-gray-500 mb-5">
              Quedaste registrado para <b>{vacante?.titulo}</b>. Te contactamos por WhatsApp si avanzas. ✦
            </p>
            <Link href="/" className="btn-rosa w-full text-center block">Ir al inicio</Link>
          </div>
        )}

        {(status === "form" || status === "sending") && vacante && (
          <div className="bento p-6" style={{ background: "var(--cream)" }}>
            <div className="text-center mb-5">
              <p className="text-[11px] font-mono font-bold uppercase mb-1" style={{ color: "var(--nar)" }}>
                Postúlate a
              </p>
              <h1 className="text-2xl font-black leading-tight">{vacante.titulo}</h1>
              {vacante.empresa && <p className="text-sm text-gray-500 mt-1">{vacante.empresa}</p>}
            </div>

            <label className="block text-xs font-bold mb-1">Nombre completo *</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" className="input-bento w-full mb-3" />

            <label className="block text-xs font-bold mb-1">Carrera o área *</label>
            <input value={carreraArea} onChange={(e) => setCarreraArea(e.target.value)} placeholder="Ej. Ingeniería industrial, Marketing" className="input-bento w-full mb-3" />

            <label className="block text-xs font-bold mb-1">WhatsApp *</label>
            <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+52 55 1234 5678" className="input-bento w-full mb-3" />

            <label className="block text-xs font-bold mb-1">Link a tu CV (opcional)</label>
            <input value={cvLink} onChange={(e) => setCvLink(e.target.value)} placeholder="Drive, LinkedIn, portafolio…" className="input-bento w-full mb-4" />

            {err && <p className="text-sm text-red-600 mb-3 text-center">{err}</p>}

            <button
              onClick={submit}
              disabled={!valid || status === "sending"}
              className="btn-rosa w-full text-center disabled:opacity-50"
            >
              {status === "sending" ? "Enviando…" : "Enviar postulación ✦"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
