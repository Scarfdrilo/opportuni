"use client";

import { useState } from "react";

type Status = "idle" | "uploading" | "done" | "error";

const REQUIRED = [
  "nombre", "email", "whatsapp", "ciudadPais", "objetivo", "puestoObjetivo",
  "carrera", "universidad", "fechasEstudio", "experiencia", "skills", "idiomas",
] as const;

export default function CvUploadModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    whatsapp: "",
    ciudadPais: "",
    linkedin: "",
    objetivo: "",
    puestoObjetivo: "",
    linkVacante: "",
    carrera: "",
    universidad: "",
    fechasEstudio: "",
    reconocimientos: "",
    experiencia: "",
    skills: "",
    idiomas: "",
    algoMas: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const valid = REQUIRED.every((k) => form[k].trim());

  const submit = async () => {
    if (!valid) {
      setErr("Completa los campos marcados con *.");
      setStatus("error");
      return;
    }
    setStatus("uploading");
    setErr("");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v.trim()));
      if (file) fd.append("file", file);
      const r = await fetch("/api/upload", { method: "POST", body: fd, signal: controller.signal });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error || "No se pudo enviar tu información.");
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
      <div onClick={(e) => e.stopPropagation()} className="bento" style={{ background: "var(--cream)", width: "min(94vw, 500px)", maxHeight: "90vh", overflowY: "auto", padding: 24, position: "relative" }}>
        <button onClick={onClose} aria-label="Cerrar" style={{ position: "absolute", top: 12, right: 14, border: "none", background: "transparent", fontSize: 20, cursor: "pointer", color: "var(--dark)", lineHeight: 1, zIndex: 2 }}>✕</button>

        {status === "done" ? (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div className="text-5xl mb-2">🎉</div>
            <h3 className="text-2xl font-black mb-2">¡Recibido!</h3>
            <p className="text-sm text-gray-500 mb-5">Con esta info armamos tu CV. Vianey te contactará por WhatsApp o correo. Entrega en 2 días hábiles. ✦</p>
            <button onClick={onClose} className="btn-rosa w-full text-center">Listo</button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-4">
              <div className="text-4xl mb-1">📝</div>
              <h3 className="text-2xl font-black mb-1">Armemos tu CV</h3>
              <p className="text-xs text-gray-500 leading-snug">
                Sé lo más transparente y honesto posible para ayudarte de verdad. No temas contarnos tus áreas de oportunidad — eso nos ayuda a venderte mejor. Te toma unos 10 minutos. ✦
              </p>
            </div>

            <Section title="Contacto">
              <TextField label="Nombre completo" help="Como quieres que aparezca en tu CV." value={form.nombre} onChange={set("nombre")} required />
              <TextField label="Correo" type="email" help="El que va en tu CV. Aquí te contactan los reclutadores." value={form.email} onChange={set("email")} required />
              <TextField label="WhatsApp" help="El que va en tu CV. Aquí te contactan los reclutadores." value={form.whatsapp} onChange={set("whatsapp")} required />
              <TextField label="Ciudad y país" help="Donde radicas. Si buscas chamba en otro estado, pon el de donde buscas." value={form.ciudadPais} onChange={set("ciudadPais")} required />
              <TextField label="LinkedIn o portafolio" help="Pega el link si tienes. Te recomendamos alinearlo con tu CV." value={form.linkedin} onChange={set("linkedin")} />
            </Section>

            <Section title="Objetivo">
              <AreaField label="¿Qué quieres lograr con tu CV?" help="Ej: conseguir mi primer empleo, cambiar de área, aplicar a un posgrado, subir de puesto." value={form.objetivo} onChange={set("objetivo")} required />
              <TextField label="Puesto o vacante objetivo" help="A qué tipo de puesto vas a mandar este CV. Ej: Analista de datos, Marketing digital. Sé específico." value={form.puestoObjetivo} onChange={set("puestoObjetivo")} required />
              <TextField label="Link de vacante" help="Si ya tienes una vacante en mente, pégala y alineamos tu CV. Si no, déjalo vacío." value={form.linkVacante} onChange={set("linkVacante")} />
            </Section>

            <Section title="Estudios">
              <TextField label="Carrera o estudios" help="Nombre completo tal cual viene en tu título. Si estudias, dinos en qué semestre vas." value={form.carrera} onChange={set("carrera")} required />
              <AreaField label="Universidad o escuela (historial)" help="Tu historial académico completo: universidad/escuela, carrera, fechas. Incluye seminarios, diplomados y certificaciones (con link si tienes)." value={form.universidad} onChange={set("universidad")} required />
              <TextField label="Fechas de estudio" help='Mes y año de inicio y fin. Ej: Agosto 2020 a Junio 2024. Si sigues, pon "en curso".' value={form.fechasEstudio} onChange={set("fechasEstudio")} required />
              <AreaField label="Reconocimientos" help="Premios, becas, menciones honoríficas, concursos ganados. Todo lo que te haga destacar, aunque parezca pequeño." value={form.reconocimientos} onChange={set("reconocimientos")} />
            </Section>

            <Section title="Experiencia y habilidades">
              <AreaField label="Experiencia" help="Por cada trabajo/práctica/servicio/proyecto: puesto, lugar, fechas y 2-3 logros. Usa números (ej: aumenté ventas 20%). Sepáralos si tienes varios." value={form.experiencia} onChange={set("experiencia")} required />
              <AreaField label="Skills y herramientas" help="Herramientas que manejas bien. Ej: Excel, Canva, Figma, Python, Notion. Sé específico: aquí los filtros de IA buscan coincidencias." value={form.skills} onChange={set("skills")} required />
              <TextField label="Idiomas" help="Idiomas y nivel. Ej: Inglés B2, Francés básico. Si tienes certificación (TOEFL, IELTS), ponla." value={form.idiomas} onChange={set("idiomas")} required />
            </Section>

            <Section title="Extras">
              <div className="mb-3">
                <label className="block text-xs font-bold mb-1">CV actual (PDF)</label>
                <p className="text-[11px] text-gray-400 mb-1 leading-snug">Si ya tienes uno, súbelo aunque esté desactualizado. Lo usamos de base para no dejar nada fuera. Opcional.</p>
                <label className="block rounded-2xl px-4 py-4 cursor-pointer text-center" style={{ border: "2.5px dashed var(--dark)", background: "var(--cream2)" }}>
                  <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                  <span className="font-bold text-sm">{file ? `📎 ${file.name}` : "Toca para elegir tu PDF (opcional)"}</span>
                </label>
              </div>
              <AreaField label="Algo más" help="¿Algo que no preguntamos y suma a tu CV? Certificaciones, disponibilidad para viajar o mudarte, lo que sea. Opcional." value={form.algoMas} onChange={set("algoMas")} />
            </Section>

            <p className="text-[11px] text-gray-400 mb-3 text-center">Nunca compartas información confidencial como contraseñas.</p>

            {status === "error" && <p className="text-sm text-red-600 mb-3 text-center">{err}</p>}

            <button onClick={submit} disabled={status === "uploading"} className="btn-rosa w-full text-center disabled:opacity-50">
              {status === "uploading" ? "Enviando…" : "Enviar mi información ✦"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- field helpers ---------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="font-gabarito font-black text-sm mb-2 uppercase tracking-wide" style={{ color: "var(--rosa)" }}>{title}</p>
      {children}
    </div>
  );
}

function TextField({
  label, help, value, onChange, required, type = "text",
}: {
  label: string; help?: string; value: string; required?: boolean; type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-bold mb-0.5">{label}{required ? " *" : ""}</label>
      {help && <p className="text-[11px] text-gray-400 mb-1 leading-snug">{help}</p>}
      <input type={type} value={value} onChange={onChange} className="input-bento w-full" />
    </div>
  );
}

function AreaField({
  label, help, value, onChange, required,
}: {
  label: string; help?: string; value: string; required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-bold mb-0.5">{label}{required ? " *" : ""}</label>
      {help && <p className="text-[11px] text-gray-400 mb-1 leading-snug">{help}</p>}
      <textarea value={value} onChange={onChange} rows={3} className="input-bento w-full" />
    </div>
  );
}
