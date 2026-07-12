"use client";

import { useAccesly } from "@accesly/react";
import { useState } from "react";

type Status = "idle" | "uploading" | "done" | "error";

export default function CvUploadModal({ onClose }: { onClose: () => void }) {
  const { auth } = useAccesly();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState(auth.username ?? "");
  const [whatsapp, setWhatsapp] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState("");

  const valid = nombre.trim() && email.trim() && whatsapp.trim() && file;

  const submit = async () => {
    if (!valid || !file) return;
    setStatus("uploading");
    setErr("");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("nombre", nombre.trim());
      fd.append("email", email.trim());
      fd.append("whatsapp", whatsapp.trim());
      fd.append("mensaje", mensaje.trim());
      const r = await fetch("/api/upload", { method: "POST", body: fd, signal: controller.signal });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error || "No se pudo enviar tu CV.");
      setStatus("done");
    } catch (e) {
      const msg =
        e instanceof Error && e.name === "AbortError"
          ? "La subida tardó demasiado. Revisa tu conexión e inténtalo de nuevo."
          : e instanceof Error
          ? e.message
          : "Error al enviar.";
      setErr(msg);
      setStatus("error");
    } finally {
      clearTimeout(timer);
    }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div onClick={(e) => e.stopPropagation()} className="bento" style={{ background: "var(--cream)", width: "min(92vw, 440px)", maxHeight: "88vh", overflowY: "auto", padding: 24, position: "relative" }}>
        <button onClick={onClose} aria-label="Cerrar" style={{ position: "absolute", top: 12, right: 14, border: "none", background: "transparent", fontSize: 20, cursor: "pointer", color: "var(--dark)", lineHeight: 1 }}>✕</button>

        {status === "done" ? (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div className="text-5xl mb-2">🎉</div>
            <h3 className="text-2xl font-black mb-2">¡CV recibido!</h3>
            <p className="text-sm text-gray-500 mb-5">Vianey revisará tu CV y te contactará por WhatsApp o correo con tu feedback.</p>
            <button onClick={onClose} className="btn-rosa w-full text-center">Listo</button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-4">
              <div className="text-4xl mb-1">📄</div>
              <h3 className="text-2xl font-black mb-1">Envía tu CV</h3>
              <p className="text-sm text-gray-500">Cuéntanos a dónde mandarte tu review. ✦</p>
            </div>

            <label className="block text-xs font-bold mb-1">Nombre completo *</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" className="input-bento w-full mb-3" />

            <label className="block text-xs font-bold mb-1">Email *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" className="input-bento w-full mb-3" />

            <label className="block text-xs font-bold mb-1">WhatsApp *</label>
            <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+52 55 1234 5678" className="input-bento w-full mb-3" />

            <label className="block text-xs font-bold mb-1">Mensaje (opcional)</label>
            <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder="Ej. busco vacantes de diseño…" rows={2} className="input-bento w-full mb-3" />

            <label
              className="block rounded-2xl px-4 py-6 mb-4 cursor-pointer text-center"
              style={{ border: "2.5px dashed var(--dark)", background: "var(--cream2)" }}
            >
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => { setFile(e.target.files?.[0] ?? null); setStatus("idle"); }}
              />
              <span className="font-bold text-sm">{file ? `📎 ${file.name}` : "Toca para elegir tu PDF *"}</span>
            </label>

            {status === "error" && <p className="text-sm text-red-600 mb-3 text-center">{err}</p>}

            <button
              onClick={submit}
              disabled={!valid || status === "uploading"}
              className="btn-rosa w-full text-center disabled:opacity-50"
            >
              {status === "uploading" ? "Enviando…" : "Enviar mi CV ✦"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
