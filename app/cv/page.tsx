"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const CANVA_LINKS = {
  corporativo: "https://www.canva.com/design/DAHBmeQZ-SM/kfRjtDkciJNMr2bPwgu-Qg/edit",
  creativo: "https://www.canva.com/design/DAHBmef9DHo/peMan_KFOQWHiBJ62C_e8Q/edit",
};

const STEP_LABELS = ["Estilo", "Personal", "Educación", "Experiencia", "Habilidades", "Resultado"];

interface EduEntry { inst: string; carrera: string; promedio: string; periodo: string; ubicacion: string; cursos: string; }
interface ExpEntry { empresa: string; puesto: string; periodo: string; ubicacion: string; logros: string; }

export default function CVBuilderPage() {
  const [copied, setCopied] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [step, setStep] = useState(0);
  const [style, setStyle] = useState<"corporativo" | "creativo" | "">("");
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  // Personal
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [perfil, setPerfil] = useState("");
  // Corporativo extras
  const [edad, setEdad] = useState("");
  const [estadoCivil, setEstadoCivil] = useState("");
  const [direccion, setDireccion] = useState("");
  // Creativo extras
  const [intereses, setIntereses] = useState("");

  // Education
  const [eduEntries, setEduEntries] = useState<EduEntry[]>([
    { inst: "", carrera: "", promedio: "", periodo: "", ubicacion: "", cursos: "" },
  ]);

  // Experience
  const [expEntries, setExpEntries] = useState<ExpEntry[]>([
    { empresa: "", puesto: "", periodo: "", ubicacion: "", logros: "" },
  ]);

  // Skills
  const [habilidades, setHabilidades] = useState("");
  const [software, setSoftware] = useState("");
  const [idiomas, setIdiomas] = useState("");
  const [certificaciones, setCertificaciones] = useState("");
  const [logrosDestacados, setLogrosDestacados] = useState("");

  const wizardRef = useRef<HTMLDivElement>(null);

  const copyClabe = () => {
    navigator.clipboard.writeText("638180000155390737");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const unlock = () => {
    setUnlocked(true);
    setTimeout(() => wizardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const selectStyle = (s: "corporativo" | "creativo") => {
    setStyle(s);
    setTimeout(() => goStep(1), 300);
  };

  const goStep = (n: number) => {
    if (n === 1 && !style) { alert("Selecciona un estilo primero"); return; }
    setStep(n);
    setTimeout(() => wizardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const updateEdu = (i: number, field: keyof EduEntry, val: string) => {
    const copy = [...eduEntries];
    copy[i] = { ...copy[i], [field]: val };
    setEduEntries(copy);
  };

  const updateExp = (i: number, field: keyof ExpEntry, val: string) => {
    const copy = [...expEntries];
    copy[i] = { ...copy[i], [field]: val };
    setExpEntries(copy);
  };

  const addEdu = () => setEduEntries([...eduEntries, { inst: "", carrera: "", promedio: "", periodo: "", ubicacion: "", cursos: "" }]);
  const addExp = () => setExpEntries([...expEntries, { empresa: "", puesto: "", periodo: "", ubicacion: "", logros: "" }]);

  const generateCV = () => {
    if (!nombre || !apellidos) { alert("Llena al menos tu nombre y apellidos"); return; }
    setStep(5);
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setDone(true); }, 2000);
  };

  const resetWizard = () => {
    setStep(0);
    setStyle("");
    setDone(false);
    setGenerating(false);
    setNombre(""); setApellidos(""); setEmail(""); setTelefono("");
    setUbicacion(""); setLinkedin(""); setPerfil("");
    setEdad(""); setEstadoCivil(""); setDireccion(""); setIntereses("");
    setEduEntries([{ inst: "", carrera: "", promedio: "", periodo: "", ubicacion: "", cursos: "" }]);
    setExpEntries([{ empresa: "", puesto: "", periodo: "", ubicacion: "", logros: "" }]);
    setHabilidades(""); setSoftware(""); setIdiomas(""); setCertificaciones(""); setLogrosDestacados("");
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      <nav className="nav-bento">
        <div className="flex items-center gap-3">
          <span className="font-gabarito text-xl font-black">Opportuni</span>
          <Link href="/" className="text-sm font-semibold text-gray-400 hover:text-opportuni-rosa transition-colors">← Inicio</Link>
        </div>
        <Link href="/cv/asesoria" className="font-mono text-xs font-bold px-4 py-2 rounded-full border-bento border-opportuni-dark hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all" style={{ background: "var(--nar)", color: "white", boxShadow: "2px 2px 0 var(--dark)" }}>
          Asesoría 1:1
        </Link>
      </nav>

      <main className="pt-[90px] pb-16 px-4">
        <div className="max-w-[1140px] mx-auto grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          {/* Left — Hero */}
          <div className="pt-8">
            <div className="pill mb-6" style={{ background: "var(--rosa)" }}>
              <span className="dot" />
              CV BUILDER
            </div>
            <h1 className="text-3xl md:text-[clamp(36px,5vw,52px)] font-black leading-[1.1] mb-5">
              Crea tu CV{" "}
              <span className="font-playfair italic" style={{ color: "var(--rosa)" }}>profesional</span>{" "}
              <span className="animate-twinkle inline-block" style={{ color: "var(--nar)" }}>✦</span>
            </h1>
            <p className="text-gray-500 mb-8 max-w-md">
              Elige un estilo, llena tus datos y obtén tu CV listo para personalizar en Canva. Sin plantillas genéricas.
            </p>

            <div className="flex gap-3 mb-6">
              <div className="stat">
                <span className="font-gabarito font-black text-lg" style={{ color: "var(--rosa)" }}>2</span>
                <span className="text-xs font-bold text-gray-400">estilos</span>
              </div>
              <div className="stat">
                <span className="font-gabarito font-black text-lg" style={{ color: "var(--nar)" }}>5 min</span>
                <span className="text-xs font-bold text-gray-400">para llenar</span>
              </div>
              <div className="stat">
                <span className="font-gabarito font-black text-lg" style={{ color: "var(--lila)" }}>Canva</span>
                <span className="text-xs font-bold text-gray-400">editable</span>
              </div>
            </div>

            {/* Style preview cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bento p-4 text-center">
                <div className="w-full aspect-[3/4] rounded-bento mb-3 flex items-center justify-center" style={{ background: "var(--cream2)" }}>
                  <svg width="48" height="60" viewBox="0 0 48 60" fill="none">
                    <rect x="2" y="2" width="44" height="56" rx="4" stroke="var(--rosa)" strokeWidth="2.5" fill="white" />
                    <circle cx="24" cy="18" r="8" fill="var(--rosa)" opacity="0.2" />
                    <rect x="10" y="30" width="28" height="3" rx="1.5" fill="var(--rosa)" opacity="0.3" />
                    <rect x="10" y="36" width="20" height="3" rx="1.5" fill="var(--rosa)" opacity="0.2" />
                    <rect x="10" y="42" width="28" height="3" rx="1.5" fill="var(--rosa)" opacity="0.15" />
                    <rect x="10" y="48" width="16" height="3" rx="1.5" fill="var(--rosa)" opacity="0.1" />
                  </svg>
                </div>
                <p className="font-bold text-sm">Corporativo</p>
                <p className="text-xs text-gray-400 font-mono">2 pág · Con foto</p>
              </div>
              <div className="bento p-4 text-center">
                <div className="w-full aspect-[3/4] rounded-bento mb-3 flex items-center justify-center" style={{ background: "var(--cream2)" }}>
                  <svg width="48" height="60" viewBox="0 0 48 60" fill="none">
                    <rect x="2" y="2" width="44" height="56" rx="4" stroke="var(--lila)" strokeWidth="2.5" fill="white" />
                    <rect x="10" y="10" width="28" height="5" rx="2.5" fill="var(--lila)" opacity="0.3" />
                    <rect x="10" y="20" width="28" height="3" rx="1.5" fill="var(--lila)" opacity="0.2" />
                    <rect x="10" y="26" width="20" height="3" rx="1.5" fill="var(--lila)" opacity="0.15" />
                    <rect x="10" y="34" width="28" height="3" rx="1.5" fill="var(--lila)" opacity="0.2" />
                    <rect x="10" y="40" width="24" height="3" rx="1.5" fill="var(--lila)" opacity="0.15" />
                    <rect x="10" y="48" width="28" height="3" rx="1.5" fill="var(--lila)" opacity="0.1" />
                  </svg>
                </div>
                <p className="font-bold text-sm">Creativo / Tech</p>
                <p className="text-xs text-gray-400 font-mono">1 pág · Ejecutivo</p>
              </div>
            </div>
          </div>

          {/* Right — Payment */}
          <div className="bento overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4" style={{ background: "var(--rosa)" }}>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-bold" style={{ color: "var(--rosa)" }}>$</div>
              <span className="text-white font-bold font-gabarito">Desbloquea tu CV Builder</span>
              <span className="ml-auto text-white font-gabarito font-black text-2xl">$150</span>
              <span className="text-white/70 text-sm font-mono">MXN</span>
            </div>

            <div className="p-6">
              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between pb-3" style={{ borderBottom: "1.5px dashed var(--warm)" }}>
                  <span className="text-gray-400 font-mono text-xs uppercase">Banco</span>
                  <span className="font-bold">Nu</span>
                </div>
                <div className="flex justify-between pb-3" style={{ borderBottom: "1.5px dashed var(--warm)" }}>
                  <span className="text-gray-400 font-mono text-xs uppercase">Beneficiario</span>
                  <span className="font-bold text-xs text-right max-w-[200px]">Vianey Alejandra Alvarez Alvarado</span>
                </div>
                <div className="flex justify-between pb-3" style={{ borderBottom: "1.5px dashed var(--warm)" }}>
                  <span className="text-gray-400 font-mono text-xs uppercase">CLABE</span>
                  <span className="font-bold font-mono text-xs">638180000155390737</span>
                </div>
                <div className="flex justify-between pb-3" style={{ borderBottom: "1.5px dashed var(--warm)" }}>
                  <span className="text-gray-400 font-mono text-xs uppercase">Concepto</span>
                  <span className="font-bold text-xs">CV Opportuni</span>
                </div>
              </div>

              <button
                onClick={copyClabe}
                className="w-full py-3 rounded-full text-sm font-bold border-bento border-opportuni-dark cursor-pointer transition-all text-center mb-4"
                style={{
                  background: copied ? "var(--teal)" : "var(--dark)",
                  color: "white",
                  boxShadow: copied ? "3px 3px 0 var(--teal)" : "3px 3px 0 var(--rosa)",
                }}
              >
                {copied ? "¡Copiada! ✓" : "Copiar CLABE 📋"}
              </button>

              <button
                onClick={unlock}
                className="w-full py-4 rounded-full text-sm font-bold border-bento border-opportuni-dark cursor-pointer transition-all text-center"
                style={{
                  background: "var(--teal)",
                  color: "white",
                  boxShadow: "4px 4px 0 var(--dark)",
                }}
              >
                Ya pagué · Crear mi CV ✦
              </button>

              <p className="text-xs text-gray-400 text-center mt-3 font-mono">
                Envía tu comprobante a <strong>opportuniopportuni@gmail.com</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Scallop divider */}
        {unlocked && (
          <svg className="scallop-down my-12 max-w-[1140px] mx-auto" viewBox="0 0 1200 40" preserveAspectRatio="none">
            <path d={Array.from({ length: 24 }, (_, i) => `${i === 0 ? "M" : ""}${i * 50},0 Q${i * 50 + 25},40 ${(i + 1) * 50},0`).join(" ")} fill="var(--dark)" />
          </svg>
        )}

        {/* Wizard */}
        {unlocked && (
          <div ref={wizardRef} className="max-w-[720px] mx-auto animate-slide-up">
            {/* Progress */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {STEP_LABELS.map((label, i) => (
                <button
                  key={label}
                  onClick={() => goStep(i)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold font-mono border-bento border-opportuni-dark transition-all cursor-pointer"
                  style={{
                    background: step === i ? "var(--rosa)" : i < step ? "var(--teal)" : "white",
                    color: step === i || i < step ? "white" : "var(--dark)",
                    boxShadow: step === i ? "3px 3px 0 var(--dark)" : "2px 2px 0 var(--dark)",
                  }}
                >
                  {i < step ? "✓" : i + 1} <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* Step 0: Style Selection */}
            {step === 0 && (
              <div className="animate-slide-up">
                <h2 className="text-2xl font-black mb-2 text-center">Elige tu estilo</h2>
                <p className="text-gray-400 text-sm text-center mb-6 font-mono">El formato define la estructura de tu CV</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <button
                    onClick={() => selectStyle("corporativo")}
                    className="p-6 rounded-bento-lg border-bento text-left cursor-pointer transition-all"
                    style={{
                      background: style === "corporativo" ? "var(--cream2)" : "white",
                      borderColor: style === "corporativo" ? "var(--rosa)" : "var(--dark)",
                      boxShadow: style === "corporativo" ? "5px 5px 0 var(--rosa)" : "4px 4px 0 var(--dark)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "var(--rosa)", color: "white" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="2" />
                          <circle cx="12" cy="9" r="3" fill="white" opacity="0.6" />
                          <rect x="7" y="14" width="10" height="2" rx="1" fill="white" opacity="0.4" />
                          <rect x="7" y="18" width="7" height="2" rx="1" fill="white" opacity="0.3" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-black">Corporativo</p>
                        <span className="badge badge-rosa">2 pág · Vertical</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Formato clásico con foto. Ideal para empresas tradicionales y gobierno.</p>
                  </button>

                  <button
                    onClick={() => selectStyle("creativo")}
                    className="p-6 rounded-bento-lg border-bento text-left cursor-pointer transition-all"
                    style={{
                      background: style === "creativo" ? "var(--cream2)" : "white",
                      borderColor: style === "creativo" ? "var(--lila)" : "var(--dark)",
                      boxShadow: style === "creativo" ? "5px 5px 0 var(--lila)" : "4px 4px 0 var(--dark)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "var(--lila)", color: "white" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="2" />
                          <rect x="7" y="7" width="10" height="3" rx="1.5" fill="white" opacity="0.5" />
                          <rect x="7" y="12" width="10" height="2" rx="1" fill="white" opacity="0.3" />
                          <rect x="7" y="16" width="7" height="2" rx="1" fill="white" opacity="0.2" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-black">Creativo / Tech</p>
                        <span className="badge badge-lila">1 pág · Vertical</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Formato ejecutivo con bullets de impacto. Para startups y roles internacionales.</p>
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Personal */}
            {step === 1 && (
              <div className="animate-slide-up">
                <h2 className="text-2xl font-black mb-2">Información personal</h2>
                <p className="text-gray-400 text-sm mb-6 font-mono">Datos básicos de contacto</p>

                <div className="bento p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FieldInput label="Nombre" value={nombre} onChange={setNombre} />
                    <FieldInput label="Apellidos" value={apellidos} onChange={setApellidos} />
                    <FieldInput label="Email" value={email} onChange={setEmail} type="email" />
                    <FieldInput label="Teléfono" value={telefono} onChange={setTelefono} />
                    <FieldInput label="Ubicación" value={ubicacion} onChange={setUbicacion} />
                    <FieldInput label="LinkedIn" value={linkedin} onChange={setLinkedin} />
                    <div className="sm:col-span-2">
                      <FieldTextarea label="Perfil profesional" value={perfil} onChange={setPerfil} />
                    </div>

                    {style === "corporativo" && (
                      <>
                        <FieldInput label="Edad" value={edad} onChange={setEdad} />
                        <FieldInput label="Estado civil" value={estadoCivil} onChange={setEstadoCivil} />
                        <div className="sm:col-span-2">
                          <FieldInput label="Dirección" value={direccion} onChange={setDireccion} />
                        </div>
                      </>
                    )}

                    {style === "creativo" && (
                      <div className="sm:col-span-2">
                        <FieldInput label="Intereses" value={intereses} onChange={setIntereses} />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between mt-6">
                    <button onClick={() => goStep(0)} className="btn-secondary text-sm py-3 px-6">← Estilo</button>
                    <button onClick={() => goStep(2)} className="btn-rosa text-sm py-3 px-6">Educación →</button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Education */}
            {step === 2 && (
              <div className="animate-slide-up">
                <h2 className="text-2xl font-black mb-2">Educación</h2>
                <p className="text-gray-400 text-sm mb-6 font-mono">Formación académica</p>

                {eduEntries.map((edu, i) => (
                  <div key={i} className="bento p-6 mb-4">
                    <p className="font-bold text-sm mb-4 font-mono" style={{ color: "var(--rosa)" }}>Educación {i + 1}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <FieldInput label="Institución" value={edu.inst} onChange={(v) => updateEdu(i, "inst", v)} />
                      </div>
                      <FieldInput label="Carrera" value={edu.carrera} onChange={(v) => updateEdu(i, "carrera", v)} />
                      <FieldInput label="Promedio" value={edu.promedio} onChange={(v) => updateEdu(i, "promedio", v)} />
                      <FieldInput label="Periodo" value={edu.periodo} onChange={(v) => updateEdu(i, "periodo", v)} />
                      <FieldInput label="Ubicación" value={edu.ubicacion} onChange={(v) => updateEdu(i, "ubicacion", v)} />
                      <div className="sm:col-span-2">
                        <FieldTextarea label="Cursos relevantes" value={edu.cursos} onChange={(v) => updateEdu(i, "cursos", v)} />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addEdu}
                  className="w-full py-3 rounded-bento-lg text-sm font-bold cursor-pointer transition-all text-center mb-6"
                  style={{ border: "2.5px dashed var(--warm)", color: "var(--rosa)", background: "transparent" }}
                >
                  + Agregar otra educación
                </button>

                <div className="flex justify-between">
                  <button onClick={() => goStep(1)} className="btn-secondary text-sm py-3 px-6">← Personal</button>
                  <button onClick={() => goStep(3)} className="btn-rosa text-sm py-3 px-6">Experiencia →</button>
                </div>
              </div>
            )}

            {/* Step 3: Experience */}
            {step === 3 && (
              <div className="animate-slide-up">
                <h2 className="text-2xl font-black mb-2">Experiencia</h2>
                <p className="text-gray-400 text-sm mb-6 font-mono">Historial laboral</p>

                {expEntries.map((exp, i) => (
                  <div key={i} className="bento p-6 mb-4">
                    <p className="font-bold text-sm mb-4 font-mono" style={{ color: "var(--nar)" }}>Experiencia {i + 1}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FieldInput label="Empresa" value={exp.empresa} onChange={(v) => updateExp(i, "empresa", v)} />
                      <FieldInput label="Puesto" value={exp.puesto} onChange={(v) => updateExp(i, "puesto", v)} />
                      <FieldInput label="Periodo" value={exp.periodo} onChange={(v) => updateExp(i, "periodo", v)} />
                      <FieldInput label="Ubicación" value={exp.ubicacion} onChange={(v) => updateExp(i, "ubicacion", v)} />
                      <div className="sm:col-span-2">
                        <FieldTextarea label="Logros (1 por línea)" value={exp.logros} onChange={(v) => updateExp(i, "logros", v)} />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addExp}
                  className="w-full py-3 rounded-bento-lg text-sm font-bold cursor-pointer transition-all text-center mb-6"
                  style={{ border: "2.5px dashed var(--warm)", color: "var(--nar)", background: "transparent" }}
                >
                  + Agregar otra experiencia
                </button>

                <div className="flex justify-between">
                  <button onClick={() => goStep(2)} className="btn-secondary text-sm py-3 px-6">← Educación</button>
                  <button onClick={() => goStep(4)} className="btn-rosa text-sm py-3 px-6">Habilidades →</button>
                </div>
              </div>
            )}

            {/* Step 4: Skills */}
            {step === 4 && (
              <div className="animate-slide-up">
                <h2 className="text-2xl font-black mb-2">Habilidades y extras</h2>
                <p className="text-gray-400 text-sm mb-6 font-mono">Lo que te hace destacar</p>

                <div className="bento p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <FieldTextarea label="Habilidades (separadas por coma)" value={habilidades} onChange={setHabilidades} />
                    </div>
                    <FieldInput label="Software" value={software} onChange={setSoftware} />
                    <FieldInput label="Idiomas (idioma - nivel)" value={idiomas} onChange={setIdiomas} />
                    <div className="sm:col-span-2">
                      <FieldTextarea label="Certificaciones" value={certificaciones} onChange={setCertificaciones} />
                    </div>
                    <div className="sm:col-span-2">
                      <FieldTextarea label="Logros destacados" value={logrosDestacados} onChange={setLogrosDestacados} />
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <button onClick={() => goStep(3)} className="btn-secondary text-sm py-3 px-6">← Experiencia</button>
                    <button onClick={generateCV} className="btn-rosa text-sm py-3 px-6">Generar CV ✦</button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Result */}
            {(generating || done) && (
              <div className="animate-slide-up">
                {generating && (
                  <div className="bento p-12 text-center">
                    <div className="w-8 h-8 mx-auto mb-4 border-[3px] border-opportuni-rosa border-t-transparent rounded-full animate-spin" />
                    <p className="font-bold text-gray-500">Generando tu CV...</p>
                  </div>
                )}

                {done && (
                  <div className="bento p-10 text-center">
                    <div className="text-5xl mb-4">✨</div>
                    <h2 className="text-2xl font-black mb-2">¡Tu CV está listo!</h2>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                      Ábrelo en Canva para personalizar colores, fotos y detalles finales.
                    </p>
                    <a
                      href={style === "corporativo" ? CANVA_LINKS.corporativo : CANVA_LINKS.creativo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-teal w-full max-w-xs mx-auto text-center block mb-4"
                    >
                      Abrir en Canva →
                    </a>
                    <button onClick={resetWizard} className="btn-secondary text-sm py-3 px-6">
                      Crear otro CV
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

/* ===== Reusable field components ===== */

function FieldInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-bold font-mono uppercase text-gray-400 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-bento"
      />
    </div>
  );
}

function FieldTextarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-bold font-mono uppercase text-gray-400 mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="textarea-bento"
      />
    </div>
  );
}
