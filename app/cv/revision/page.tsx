"use client";

import { useState } from "react";
import Link from "next/link";

const AREAS = ["Ingeniería", "Negocios", "Diseño", "Marketing", "Ciencias", "Tecnología", "Otro"];

export default function RevisionPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    area: "",
    vacanteObjetivo: "",
    comentarios: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { alert("Adjunta tu CV primero"); return; }
    setSubmitting(true);
    try {
      const body = new FormData();
      body.append("type", "revision");
      body.append("nombre", formData.nombre);
      body.append("email", formData.email);
      body.append("area", formData.area);
      body.append("vacanteObjetivo", formData.vacanteObjetivo);
      body.append("comentarios", formData.comentarios);
      body.append("cv", file);
      await fetch("/api/cv", { method: "POST", body });
      setSubmitted(true);
    } catch {
      alert("Hubo un error. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  if (submitted) {
    return (
      <div className="min-h-screen" style={{ background: "var(--cream)" }}>
        <nav className="nav-bento">
          <div className="flex items-center gap-3">
            <span className="font-gabarito text-xl font-black">Opportuni</span>
            <Link href="/" className="text-sm font-semibold text-gray-400 hover:text-opportuni-rosa transition-colors">← Inicio</Link>
          </div>
        </nav>
        <main className="pt-[90px] pb-16 px-4">
          <div className="max-w-lg mx-auto text-center pt-12">
            <div className="bento p-10">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 border-bento border-opportuni-dark" style={{ background: "var(--teal)", boxShadow: "3px 3px 0 var(--dark)" }}>
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-black mb-2">¡CV recibido!</h2>
              <p className="text-gray-500 mb-6 text-sm">Revisaremos tu CV y te enviaremos retroalimentación detallada a tu email.</p>
              <Link href="/" className="btn-primary">Volver al inicio</Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      <nav className="nav-bento">
        <div className="flex items-center gap-3">
          <span className="font-gabarito text-xl font-black">Opportuni</span>
          <Link href="/" className="text-sm font-semibold text-gray-400 hover:text-opportuni-rosa transition-colors">← Inicio</Link>
        </div>
        <Link href="/cv" className="font-mono text-xs font-bold px-4 py-2 rounded-full border-bento border-opportuni-dark transition-all" style={{ background: "var(--rosa)", color: "white", boxShadow: "2px 2px 0 var(--dark)" }}>
          CV Builder
        </Link>
      </nav>

      <main className="pt-[90px] pb-16 px-4">
        <div className="max-w-[1140px] mx-auto grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          {/* Left */}
          <div className="pt-8">
            <div className="pill mb-6" style={{ background: "var(--nar)" }}>
              <span className="dot" />
              REVISIÓN DE CV
            </div>
            <h1 className="text-3xl md:text-[clamp(36px,5vw,52px)] font-black leading-[1.1] mb-5">
              Envía tu CV y recibe{" "}
              <span className="font-playfair italic" style={{ color: "var(--rosa)" }}>feedback profesional</span>{" "}
              <span className="animate-twinkle inline-block" style={{ color: "var(--nar)" }}>✦</span>
            </h1>
            <p className="text-gray-500 mb-8 max-w-md">
              Nuestro equipo analiza tu CV y te da recomendaciones específicas para que destaque.
            </p>

            <div className="flex gap-3">
              <div className="stat">
                <span className="font-gabarito font-black text-lg" style={{ color: "var(--rosa)" }}>PDF</span>
                <span className="text-xs font-bold text-gray-400">o Word</span>
              </div>
              <div className="stat">
                <span className="font-gabarito font-black text-lg" style={{ color: "var(--nar)" }}>48h</span>
                <span className="text-xs font-bold text-gray-400">respuesta</span>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <form onSubmit={handleSubmit} className="bento p-7">
            <h3 className="text-lg font-black mb-5">Sube tu CV</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold font-mono uppercase text-gray-400 mb-1.5">Nombre completo *</label>
                <input type="text" required value={formData.nombre} onChange={(e) => update("nombre", e.target.value)} className="input-bento" />
              </div>

              <div>
                <label className="block text-xs font-bold font-mono uppercase text-gray-400 mb-1.5">Email *</label>
                <input type="email" required value={formData.email} onChange={(e) => update("email", e.target.value)} className="input-bento" />
              </div>

              <div>
                <label className="block text-xs font-bold font-mono uppercase text-gray-400 mb-2">Adjuntar CV *</label>
                <div
                  className="relative rounded-bento border-bento p-8 text-center transition-all cursor-pointer"
                  style={{
                    borderStyle: "dashed",
                    borderColor: file ? "var(--teal)" : "var(--warm)",
                    background: file ? "#d1faf1" : "var(--cream2)",
                  }}
                >
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {file ? (
                    <div>
                      <div className="text-3xl mb-2">✓</div>
                      <p className="font-bold text-sm" style={{ color: "var(--teal)" }}>{file.name}</p>
                      <p className="text-xs text-gray-400 font-mono mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-3xl mb-2">📄</div>
                      <p className="font-bold text-sm">Arrastra tu CV aquí o haz clic</p>
                      <p className="text-xs text-gray-400 font-mono mt-1">PDF o DOCX (máx. 5MB)</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold font-mono uppercase text-gray-400 mb-1.5">Área profesional *</label>
                <select required value={formData.area} onChange={(e) => update("area", e.target.value)} className="input-bento">
                  <option value="">Selecciona...</option>
                  {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold font-mono uppercase text-gray-400 mb-1.5">Vacante objetivo</label>
                <input type="text" value={formData.vacanteObjetivo} onChange={(e) => update("vacanteObjetivo", e.target.value)} placeholder="¿Para qué tipo de posición?" className="input-bento" />
              </div>

              <div>
                <label className="block text-xs font-bold font-mono uppercase text-gray-400 mb-1.5">Comentarios</label>
                <textarea rows={3} value={formData.comentarios} onChange={(e) => update("comentarios", e.target.value)} placeholder="Algo más que debamos saber..." className="textarea-bento" />
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-rosa w-full text-center mt-6 disabled:opacity-50">
              {submitting ? "Enviando..." : "Enviar CV para revisión ✦"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
