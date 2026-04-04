"use client";

import Link from "next/link";
import { useState } from "react";

const testimonios = [
  { 
    nombre: "Valentina R.", 
    texto: "Encontré la beca que me trajo a estudiar a Países Bajos gracias a que la compartieron en el grupo.", 
    rol: "Beca Erasmus · Ingeniería", 
    color: "var(--rosa)" 
  },
  { 
    nombre: "Diego M.", 
    texto: "Apliqué a una vacante de product manager que vi en el grupo. A la semana tenía entrevista en Nubank.", 
    rol: "PM en fintech · Negocios", 
    color: "var(--nar)" 
  },
  { 
    nombre: "Mariana G.", 
    texto: "El review de CV me ayudó un montón para el proceso de Google. Super recomendado.", 
    rol: "SWE Intern · Creativos", 
    color: "var(--lila)" 
  },
];

const faqs = [
  {
    question: "¿Qué es Opportuni?",
    answer: "Somos una comunidad que conecta a jóvenes latinoamericanos con becas, vacantes, programas y oportunidades que normalmente no encuentras fácilmente. Todo gratis."
  },
  {
    question: "¿Cómo funciona el grupo de WhatsApp?",
    answer: "Te unes al grupo de tu país, eliges tu área de interés (Ingeniería, Negocios, Creativos, etc.) y empiezas a recibir oportunidades relevantes cada semana."
  },
  {
    question: "¿Cuánto cuesta unirse?",
    answer: "Unirte al grupo y recibir oportunidades es 100% gratis. Solo cobramos por servicios adicionales como el Review de CV ($300 MXN) y la Asesoría 1:1 ($300 MXN)."
  },
  {
    question: "¿Qué incluye el Review de CV?",
    answer: "Revisamos tu CV, te damos feedback detallado y te entregamos una versión mejorada editable en Canva. Todo en menos de 48 horas."
  },
  {
    question: "¿Cómo es la Asesoría 1:1?",
    answer: "Es una sesión de 30 minutos por Google Meet donde armamos juntos tu estrategia: cómo aplicar a becas, mejorar tu perfil, o definir tu plan de carrera."
  },
];

const empresasLogos = [
  { name: "ONU", src: "/logos/onu.png" },
  { name: "Nubank", src: "/logos/nubank.png" },
  { name: "L'Oréal", src: "/logos/loreal.png" },
  { name: "Google", src: "/logos/google.png" },
  { name: "Santander", src: "/logos/santander.png" },
  { name: "BBVA", src: "/logos/bbva.png" },
];

const subgrupos = [
  { emoji: "⚙️", label: "Ingeniería", link: "https://chat.whatsapp.com/CSy5PqWyXuNGca7gLKyhWe" },
  { emoji: "💼", label: "Negocios", link: "https://chat.whatsapp.com/Fh0QdKA6wUbJ6kKdCpfZF4" },
  { emoji: "🎨", label: "Estudios Creativos", link: "https://chat.whatsapp.com/DupdfJig8NeHAE1Mz451vB" },
  { emoji: "🌎", label: "Ciencias Sociales", link: "https://chat.whatsapp.com/Dl7FbQfRjQ6LLZf8SFSb9d" },
  { emoji: "⛏️", label: "Web3", link: "https://chat.whatsapp.com/Kvh6DnT3LcJH02qFa1VjER" },
];

export default function Home() {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showGroupDrop, setShowGroupDrop] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const shareUrl = "https://opportuni.mx";
  
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    window.open(`https://wa.me/?text=¡Mira esta comunidad de oportunidades! ${shareUrl}`, '_blank');
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      
      {/* ========== SHARE MODAL ========== */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowShareModal(false)}>
          <div className="bento p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black mb-1">Invita a quien quieras</h3>
                <p className="text-sm text-gray-500">Comparte Opportuni con tus amigos</p>
              </div>
              <button onClick={() => setShowShareModal(false)} className="text-2xl text-gray-400 hover:text-gray-600">×</button>
            </div>
            
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={shareUrl} 
                readOnly 
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-sm"
              />
              <button 
                onClick={handleCopy}
                className="px-4 py-3 bg-gray-100 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
              >
                {copied ? "✓ Copiado" : "Copiar"}
              </button>
            </div>
            
            <button 
              onClick={handleWhatsAppShare}
              className="w-full py-3 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
            >
              <span>📱</span> Compartir por WhatsApp
            </button>
          </div>
        </div>
      )}

      {/* ========== NAV ========== */}
      <nav className="nav-bento">
        <div className="flex items-center gap-[10px]">
          <img src="/logo-opportuni.png" alt="Opportuni" style={{ height: 40, width: "auto" }} />
          <span className="font-gabarito text-[22px] font-black text-opportuni-dark">Opportuni</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          {[
            { href: "#como", label: "Cómo funciona" },
            { href: "#servicios", label: "Servicios" },
            { href: "#testimonios", label: "Historias" },
            { href: "#faq", label: "FAQ" },
          ].map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-semibold text-gray-500 hover:text-opportuni-rosa transition-colors">
              {l.label}
            </a>
          ))}
        </div>
        <div style={{ width: 140 }} />
      </nav>

      <main className="pt-[90px]">
        {/* ========== HERO ========== */}
        <section className="relative min-h-[80vh] flex items-center overflow-hidden px-4">
          {/* Floating sparkles */}
          <span className="absolute top-[15%] right-[20%] text-[32px] animate-float z-10 pointer-events-none" style={{ color: "var(--nar)" }}>✦</span>
          <span className="absolute top-[60%] right-[10%] text-[18px] animate-float animation-delay-200 z-10 pointer-events-none" style={{ color: "var(--lila)" }}>✦</span>
          <span className="absolute top-[80%] left-[15%] text-[22px] animate-float animation-delay-600 z-10 pointer-events-none" style={{ color: "var(--rosa)" }}>✦</span>

          <div className="relative z-10 max-w-[1140px] mx-auto w-full text-center">
            <div className="animate-slide-up max-w-3xl mx-auto">
              <div className="pill mb-6 mx-auto w-fit">
                <span className="dot" />
                +200 NUEVAS CADA SEMANA
              </div>

              <h1 className="text-4xl md:text-[clamp(40px,5vw,64px)] font-black leading-[1.1] mb-6">
                Becas, vacantes y programas{" "}
                <span className="font-playfair italic" style={{ color: "var(--rosa)" }}>
                  que nadie te había contado.
                </span>
              </h1>

              <p className="text-base md:text-lg text-gray-500 mb-8 max-w-xl mx-auto leading-relaxed">
                La comunidad que conecta a jóvenes latinoamericanos con oportunidades reales. Gratis.
              </p>

              <div className="flex flex-wrap gap-3 justify-center mb-8">
                <div className="relative">
                  <button onClick={() => setShowGroupDrop(!showGroupDrop)} className="btn-primary">
                    Unirme al grupo ✦
                  </button>
                  {showGroupDrop && (
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bento p-3 space-y-2 min-w-[220px] z-20">
                      <a href="https://chat.whatsapp.com/LqwA94ukn1O2laee8WP9tN" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-xl hover:bg-opportuni-cream transition-colors">
                        <span className="text-xl">🇲🇽</span> 
                        <span className="font-bold text-sm">México</span> 
                        <span className="text-xs text-gray-400 ml-auto">+8K</span>
                      </a>
                      <a href="https://chat.whatsapp.com/JsVEfmT8Iiv1R1fZWVqqdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-xl hover:bg-opportuni-cream transition-colors">
                        <span className="text-xl">🇨🇴</span> 
                        <span className="font-bold text-sm">Colombia</span> 
                        <span className="text-xs text-gray-400 ml-auto">+1.5K</span>
                      </a>
                    </div>
                  )}
                </div>
                <a href="https://wa.me/522205414251" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  Hablar con Opportuni 🦊
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========== MARQUEE - LOGOS ========== */}
        <section className="py-8 overflow-hidden" style={{ background: "var(--cream2)" }}>
          <p className="text-center text-sm text-gray-400 mb-4 font-mono uppercase tracking-wider">Oportunidades de empresas como</p>
          <div className="flex animate-scroll whitespace-nowrap">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="flex items-center gap-12 shrink-0 px-6">
                {empresasLogos.map((logo) => (
                  <div key={`${logo.name}-${idx}`} className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
                    <span className="font-gabarito font-bold text-lg text-gray-600">{logo.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ========== SCALLOP (cream → dark) ========== */}
        <svg viewBox="0 0 1200 30" fill="var(--dark)" preserveAspectRatio="none" style={{ display: "block", width: "100%" }}>
          <path d="M0 30C50 30 50 0 100 0C150 0 150 30 200 30C250 30 250 0 300 0C350 0 350 30 400 30C450 30 450 0 500 0C550 0 550 30 600 30C650 30 650 0 700 0C750 0 750 30 800 30C850 30 850 0 900 0C950 0 950 30 1000 30C1050 30 1050 0 1100 0C1150 0 1150 30 1200 30V0H0Z" />
        </svg>

        {/* ========== MARQUEE - OPORTUNIDADES ========== */}
        <section style={{ background: "var(--dark)", overflow: "hidden", padding: "20px 0" }}>
          <div className="flex animate-scroll whitespace-nowrap">
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="flex items-center gap-8 shrink-0 pr-8">
                {["BECAS", "VACANTES", "RETOS", "PROGRAMAS", "STARTUPS", "WEB3", "TECH", "INGENIERÍA", "NEGOCIOS", "CREATIVOS"].map((w) => (
                  <span key={`${w}-${idx}`} className="flex items-center gap-4">
                    <span className="font-gabarito font-black text-white/20 text-xl uppercase tracking-widest">{w}</span>
                    <span style={{ color: "var(--nar)" }}>✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ========== SCALLOP (dark → cream) ========== */}
        <svg viewBox="0 0 1200 30" fill="var(--dark)" preserveAspectRatio="none" style={{ display: "block", width: "100%", transform: "scaleY(-1)" }}>
          <path d="M0 30C50 30 50 0 100 0C150 0 150 30 200 30C250 30 250 0 300 0C350 0 350 30 400 30C450 30 450 0 500 0C550 0 550 30 600 30C650 30 650 0 700 0C750 0 750 30 800 30C850 30 850 0 900 0C950 0 950 30 1000 30C1050 30 1050 0 1100 0C1150 0 1150 30 1200 30V0H0Z" />
        </svg>

        {/* ========== COMO FUNCIONA - 4 PASOS ========== */}
        <section id="como" className="py-20 px-4" style={{ background: "var(--cream)" }}>
          <div className="max-w-[1140px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
              Cuatro pasos. Cero complicaciones. <span className="animate-twinkle inline-block" style={{ color: "var(--nar)" }}>✦</span>
            </h2>
            <p className="text-center text-gray-500 mb-14 max-w-lg mx-auto">
              Unirte a la comunidad es gratis y toma menos de un minuto.
            </p>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { n: "1", title: "Únete al grupo", desc: "Escoge México o Colombia y entra al grupo de WhatsApp.", color: "var(--rosa)", emoji: "📱" },
                { n: "2", title: "Elige tu carrera", desc: "Ingeniería, Negocios, Creativos, Ciencias Sociales o Web3.", color: "var(--lila)", emoji: "🎯" },
                { n: "3", title: "Abre el chat", desc: "Habla con Opportuni para recibir recomendaciones personalizadas.", color: "var(--teal)", emoji: "💬" },
                { n: "4", title: "Comparte", desc: "Invita a tus amigos y crece junto con la comunidad.", color: "var(--nar)", emoji: "🚀" },
              ].map((step) => (
                <div key={step.n} className="bento p-6 group text-center">
                  <div className="relative w-[60px] h-[60px] mb-4 mx-auto">
                    <svg viewBox="0 0 60 60" className="w-full h-full">
                      <circle cx="30" cy="30" rx="28" fill={step.color} />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl">{step.emoji}</span>
                  </div>
                  <div className="text-xs font-mono text-gray-400 mb-2">PASO {step.n}</div>
                  <h3 className="text-lg font-black mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Subgrupos */}
            <div className="mt-12 text-center">
              <p className="text-sm text-gray-500 mb-4">Únete directo a tu área:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {subgrupos.map((sub) => (
                  <a 
                    key={sub.label} 
                    href={sub.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="badge badge-rosa hover:scale-105 transition-transform"
                  >
                    {sub.emoji} {sub.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========== SERVICIOS ========== */}
        <section id="servicios" className="py-20 px-4" style={{ background: "var(--cream2)" }}>
          <div className="max-w-[1140px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-center mb-3">
              Servicios que abren puertas <span className="animate-twinkle inline-block" style={{ color: "var(--nar)" }}>✦</span>
            </h2>
            <p className="text-gray-500 text-center mb-14 max-w-lg mx-auto">
              Porque buscar oportunidades no debería ser tan difícil. Nosotros te ayudamos.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Review de CV */}
              <Link href="/cv" className="bento-rosa p-0 overflow-hidden group cursor-pointer block">
                <div className="p-8 rounded-t-[26px] flex items-center justify-center h-[180px]" style={{ background: "var(--rosa)" }}>
                  <div className="text-center">
                    <div className="text-5xl mb-2">📄</div>
                    <div className="text-white/80 text-sm font-mono">$300 MXN</div>
                  </div>
                </div>
                <div className="p-7">
                  <h3 className="text-xl font-black mb-2">Review de CV</h3>
                  <p className="text-sm text-gray-500 mb-4">Sube tu CV y recibe feedback detallado + versión mejorada editable en Canva.</p>
                  <div className="flex gap-2 mb-4">
                    <span className="badge badge-rosa">48 hrs</span>
                    <span className="badge badge-rosa">Canva</span>
                  </div>
                  <span className="btn-rosa text-sm w-full text-center block">Revisar mi CV ✦</span>
                </div>
              </Link>

              {/* Asesoría */}
              <Link href="/cv/asesoria" className="bento-naranja p-0 overflow-hidden group cursor-pointer block">
                <div className="p-8 rounded-t-[26px] flex items-center justify-center h-[180px]" style={{ background: "var(--nar)" }}>
                  <div className="text-center">
                    <div className="text-5xl mb-2">👥</div>
                    <div className="text-white/80 text-sm font-mono">$300 MXN</div>
                  </div>
                </div>
                <div className="p-7">
                  <h3 className="text-xl font-black mb-2">Asesoría 1:1</h3>
                  <p className="text-sm text-gray-500 mb-4">Sesión de 30 min por Google Meet para armar tu estrategia de aplicación.</p>
                  <div className="flex gap-2 mb-4">
                    <span className="badge badge-naranja">Google Meet</span>
                    <span className="badge badge-naranja">30 min</span>
                  </div>
                  <span className="btn-primary text-sm w-full text-center block">Agendar sesión ✦</span>
                </div>
              </Link>

              {/* Chat */}
              <a href="https://wa.me/522205414251" target="_blank" rel="noopener noreferrer" className="bento-teal p-0 overflow-hidden group cursor-pointer block">
                <div className="p-8 rounded-t-[26px] flex items-center justify-center h-[180px]" style={{ background: "var(--teal)" }}>
                  <div className="text-center">
                    <div className="text-5xl mb-2">🦊</div>
                    <div className="text-white/80 text-sm font-mono">GRATIS</div>
                  </div>
                </div>
                <div className="p-7">
                  <h3 className="text-xl font-black mb-2">Chat con Opportuni</h3>
                  <p className="text-sm text-gray-500 mb-4">Pregúntale lo que sea sobre becas, vacantes y programas en LATAM.</p>
                  <div className="flex gap-2 mb-4">
                    <span className="badge badge-teal">WhatsApp</span>
                    <span className="badge badge-teal">24/7</span>
                  </div>
                  <span className="btn-teal text-sm w-full text-center block">Hablar ahora ✦</span>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* ========== TESTIMONIOS ========== */}
        <section id="testimonios" className="py-20 px-4" style={{ background: "var(--cream)" }}>
          <div className="max-w-[1140px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
              Historias que nos mueven <span className="animate-twinkle inline-block" style={{ color: "var(--nar)" }}>✦</span>
            </h2>
            <p className="text-center text-gray-500 mb-14 max-w-lg mx-auto">
              Miles de jóvenes ya encontraron su siguiente oportunidad. Aquí algunas de sus historias.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonios.map((t) => (
                <div key={t.nombre} className="bento p-0 overflow-hidden">
                  <div className="h-[5px]" style={{ background: t.color }} />
                  <div className="p-7">
                    <div className="flex gap-1 mb-4 text-opportuni-naranja">
                      {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
                    </div>
                    <p className="font-playfair italic text-base leading-relaxed mb-6 text-gray-700">
                      &ldquo;{t.texto}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: `linear-gradient(135deg, ${t.color}, var(--nar))` }}>
                        {t.nombre[0]}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{t.nombre}</p>
                        <p className="text-xs text-gray-400 font-mono">{t.rol}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== FAQ ========== */}
        <section id="faq" className="py-20 px-4" style={{ background: "var(--cream2)" }}>
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
              Preguntas frecuentes <span className="animate-twinkle inline-block" style={{ color: "var(--nar)" }}>✦</span>
            </h2>
            <p className="text-center text-gray-500 mb-14">
              ¿Tienes dudas? Aquí las respuestas más comunes.
            </p>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bento overflow-hidden">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-6 text-left flex justify-between items-center gap-4"
                  >
                    <span className="font-bold text-base">{faq.question}</span>
                    <span className="text-2xl text-gray-400 shrink-0">
                      {openFaq === idx ? "−" : "+"}
                    </span>
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== CTA ========== */}
        <section className="cta-section px-4">
          {/* Floating sparkles */}
          <span className="absolute text-[32px] pointer-events-none animate-float" style={{ top: "20%", left: "10%", color: "var(--dark)" }}>✦</span>
          <span className="absolute text-[20px] pointer-events-none animate-float" style={{ top: "30%", right: "15%", color: "#fff", animationDelay: "1s" }}>✦</span>
          <span className="absolute text-[24px] pointer-events-none animate-float" style={{ bottom: "20%", left: "20%", color: "#fff", animationDelay: "2s" }}>✦</span>

          <div className="max-w-2xl mx-auto">
            <h2 className="cta-title">
              ¿Listo para encontrar<br/>
              <em>tu siguiente oportunidad?</em>
            </h2>
            <p className="cta-sub">
              Miles de jóvenes en LATAM ya están conectados. Tú solo necesitas unirte.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://chat.whatsapp.com/LqwA94ukn1O2laee8WP9tN"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta"
              >
                Unirme ahora ✦
              </a>
              <button
                onClick={() => setShowShareModal(true)}
                className="btn-cta-secondary"
              >
                Compartir con un amigo
              </button>
            </div>
          </div>
        </section>

        {/* ========== SCALLOP (orange CTA → dark footer) ========== */}
        <div style={{ marginTop: -2 }}>
          <svg viewBox="0 0 1200 30" fill="var(--dark)" preserveAspectRatio="none" style={{ display: "block", width: "100%" }}>
            <path d="M0 0C50 0 50 30 100 30C150 30 150 0 200 0C250 0 250 30 300 30C350 30 350 0 400 0C450 0 450 30 500 30C550 30 550 0 600 0C650 0 650 30 700 30C750 30 750 0 800 0C850 0 850 30 900 30C950 30 950 0 1000 0C1050 0 1050 30 1100 30C1150 30 1150 0 1200 0V30H0Z" />
          </svg>
        </div>

        {/* ========== FOOTER ========== */}
        <footer style={{ background: "var(--dark)" }} className="py-14 px-4 text-white">
          <div className="max-w-[1140px] mx-auto grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-10">
            <div>
              <div className="flex items-center gap-[10px] mb-3">
                <img src="/logo-opportuni.png" alt="Opportuni" style={{ height: 30, width: "auto", filter: "brightness(10)" }} />
                <span className="font-gabarito text-xl font-black">Opportuni</span>
              </div>
              <p className="text-sm text-gray-500 max-w-xs">Conectamos a jóvenes talentosos con oportunidades en LATAM.</p>
            </div>
            <div>
              <p className="font-mono text-xs font-bold uppercase mb-4" style={{ color: "var(--nar)" }}>Producto</p>
              <div className="space-y-2">
                <a href="#como" className="block text-sm text-gray-500 hover:text-white transition-colors">Cómo funciona</a>
                <a href="#servicios" className="block text-sm text-gray-500 hover:text-white transition-colors">Servicios</a>
                <a href="#testimonios" className="block text-sm text-gray-500 hover:text-white transition-colors">Historias</a>
                <a href="#faq" className="block text-sm text-gray-500 hover:text-white transition-colors">FAQ</a>
              </div>
            </div>
            <div>
              <p className="font-mono text-xs font-bold uppercase mb-4" style={{ color: "var(--nar)" }}>Comunidad</p>
              <div className="space-y-2">
                <a href="https://chat.whatsapp.com/LqwA94ukn1O2laee8WP9tN" target="_blank" rel="noopener noreferrer" className="block text-sm text-gray-500 hover:text-white transition-colors">🇲🇽 México</a>
                <a href="https://chat.whatsapp.com/JsVEfmT8Iiv1R1fZWVqqdf" target="_blank" rel="noopener noreferrer" className="block text-sm text-gray-500 hover:text-white transition-colors">🇨🇴 Colombia</a>
                <a href="https://wa.me/522205414251" target="_blank" rel="noopener noreferrer" className="block text-sm text-gray-500 hover:text-white transition-colors">💬 Chat directo</a>
              </div>
            </div>
            <div>
              <p className="font-mono text-xs font-bold uppercase mb-4" style={{ color: "var(--nar)" }}>Síguenos</p>
              <div className="space-y-2">
                <a href="https://instagram.com/opportuni__mx" target="_blank" rel="noopener noreferrer" className="block text-sm text-gray-500 hover:text-white transition-colors">Instagram</a>
                <a href="https://www.linkedin.com/company/opportunn/" target="_blank" rel="noopener noreferrer" className="block text-sm text-gray-500 hover:text-white transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="max-w-[1140px] mx-auto mt-12 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-gray-600">© {new Date().getFullYear()} Opportuni. Hecho con 🦊 en LATAM.</p>
          </div>
        </footer>
      </main>

    </div>
  );
}
