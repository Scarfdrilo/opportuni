"use client";

import { ConnectButton, useAccesly } from "accesly";
import Link from "next/link";
import { useState } from "react";

const testimonios = [
  { nombre: "Valentina R.", texto: "Encontré la beca que me trajo a estudiar a Países Bajos gracias a que la compartieron en el grupo.", rol: "Beca Erasmus · Ingeniería", color: "var(--rosa)" },
  { nombre: "Diego M.", texto: "Apliqué a una vacante de product manager que vi en el grupo. A la semana tenía entrevista en Nubank.", rol: "PM en fintech · Negocios", color: "var(--nar)" },
  { nombre: "Mariana G.", texto: "El review de CV me ayudó un montón para el proceso de Google. Super recomendado.", rol: "SWE Intern · Creativos", color: "var(--lila)" },
];

const categorias = [
  { label: "Ingeniería", color: "badge-rosa" },
  { label: "Negocios", color: "badge-naranja" },
  { label: "Estudios Creativos", color: "badge-lila" },
  { label: "Ciencias Sociales", color: "badge-teal" },
  { label: "Web3", color: "badge-rosa" },
];

const getNameFromEmail = (email: string) => {
  const name = email.split("@")[0].replace(/[._-]/g, " ");
  return name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

export default function Home() {
  const { wallet } = useAccesly();
  const [showDrop, setShowDrop] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      {/* ========== CONNECT BUTTON PORTAL (outside nav for modal z-index) ========== */}
      <div className="connect-button-portal">
        {/* Hidden ConnectButton - always present for functionality */}
        <div id="accesly-trigger" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
          <ConnectButton />
        </div>
        
        {/* Custom visible button/pill */}
        {wallet ? (
          <button 
            className="user-pill"
            onClick={() => document.querySelector('#accesly-trigger button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}
          >
            <img src="/logo-opportuni.png" alt="" className="user-pill-avatar" />
            <span>{getNameFromEmail(wallet.email)}</span>
          </button>
        ) : (
          <button 
            className="login-button"
            onClick={() => document.querySelector('#accesly-trigger button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}
          >
            Iniciar sesión
          </button>
        )}
      </div>

      {/* ========== NAV ========== */}
      <nav className="nav-bento">
        <div className="flex items-center gap-[10px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-opportuni.png" alt="Opportuni" style={{ height: 40, width: "auto" }} />
          <span className="font-gabarito text-[22px] font-black text-opportuni-dark">Opportuni</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          {[
            { href: "#como", label: "Cómo funciona" },
            { href: "#servicios", label: "Servicios" },
            { href: "#testimonios", label: "Testimonios" },
          ].map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-semibold text-gray-500 hover:text-opportuni-rosa transition-colors">
              {l.label}
            </a>
          ))}
        </div>
        {/* Placeholder for visual alignment */}
        <div style={{ width: 140 }} />
      </nav>

      <main className="pt-[90px]">
        {/* ========== HERO ========== */}
        <section className="relative min-h-[80vh] flex items-center overflow-hidden px-4">
          {/* Floating sparkles */}
          <span className="absolute top-[15%] right-[20%] text-[32px] animate-float z-10 pointer-events-none" style={{ color: "var(--nar)" }}>✦</span>
          <span className="absolute top-[60%] right-[10%] text-[18px] animate-float animation-delay-200 z-10 pointer-events-none" style={{ color: "var(--lila)" }}>✦</span>
          <span className="absolute top-[80%] left-[15%] text-[22px] animate-float animation-delay-600 z-10 pointer-events-none" style={{ color: "var(--rosa)" }}>✦</span>

          <div className="relative z-10 max-w-[1140px] mx-auto w-full grid md:grid-cols-[1.15fr_0.85fr] gap-4 items-center">
            {/* Left */}
            <div className="animate-slide-up" style={{ padding: "clamp(32px,5vw,52px) clamp(32px,5vw,52px) clamp(32px,5vw,52px) 0" }}>
              <div className="pill mb-6">
                <span className="dot" />
                +200 NUEVAS CADA SEMANA
              </div>

              <h1 className="text-4xl md:text-[clamp(36px,4.5vw,56px)] font-black leading-[1.1] mb-5">
                Prueba las nuevas herramientas que{" "}
                <span className="font-playfair italic" style={{ color: "var(--rosa)" }}>
                  te acercan a tu próxima oportunidad.
                </span>
              </h1>

              <p className="text-base md:text-lg text-gray-500 mb-8 max-w-lg leading-relaxed">
                Becas, vacantes, retos y programas en un solo lugar, personalizados para ti.
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                <Link href="/chat" className="btn-primary">Probar el chat ✦</Link>
                <div className="relative">
                  <button onClick={() => setShowDrop(!showDrop)} className="btn-secondary">
                    Unirme al grupo ▾
                  </button>
                  {showDrop && (
                    <div className="absolute top-full mt-2 left-0 bento p-3 space-y-2 min-w-[200px] z-20">
                      <a href="https://chat.whatsapp.com/Iz07jRuw4WDE0uZgpvdGGm" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-xl hover:bg-opportuni-cream transition-colors">
                        <span>🇲🇽</span> <span className="font-bold text-sm">México</span> <span className="text-xs text-gray-400 ml-auto">+8K</span>
                      </a>
                      <a href="https://chat.whatsapp.com/JsVEfmT8Iiv1R1fZWVqqdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-xl hover:bg-opportuni-cream transition-colors">
                        <span>🇨🇴</span> <span className="font-bold text-sm">Colombia</span> <span className="text-xs text-gray-400 ml-auto">+1.5K</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {categorias.map((c) => (
                  <span key={c.label} className={`badge ${c.color}`}>{c.label}</span>
                ))}
              </div>
            </div>

            {/* Right — Badge Panel Art */}
            <div className="hidden md:block animate-slide-in-right">
              <div className="bento p-5 transition-all hover:translate-x-[-3px] hover:translate-y-[-3px]" style={{ background: "var(--cream2)", boxShadow: "6px 6px 0 var(--dark)" }}>
                <svg viewBox="0 0 340 300" fill="none" className="w-full">
                  <defs><pattern id="scallop" width="40" height="20" patternUnits="userSpaceOnUse"><path d="M0 20C10 20 10 10 20 10C30 10 30 20 40 20" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="1.5"/></pattern></defs>
                  <rect width="340" height="300" fill="url(#scallop)"/>
                  {/* BECAS sticker */}
                  <g transform="translate(15,15) rotate(-5)"><ellipse cx="52" cy="35" rx="52" ry="35" fill="var(--rosa)"/><text x="52" y="32" textAnchor="middle" fontFamily="Gabarito" fontSize="15" fontWeight="900" fill="#fff" letterSpacing="1">BECAS</text><text x="52" y="48" textAnchor="middle" fontFamily="Playfair Display" fontSize="10" fill="rgba(255,255,255,.7)" fontStyle="italic">latam</text></g>
                  {/* GOOGLE pill */}
                  <g transform="translate(140,5) rotate(3)"><rect width="130" height="48" rx="24" fill="var(--nar)"/><text x="65" y="31" textAnchor="middle" fontFamily="Gabarito" fontSize="18" fontWeight="900" fill="var(--dark)" letterSpacing="1">GOOGLE</text></g>
                  {/* +8K circle */}
                  <g transform="translate(215,68)"><circle cx="44" cy="44" r="42" fill="var(--teal)"/><text x="44" y="38" textAnchor="middle" fontFamily="Gabarito" fontSize="11" fontWeight="900" fill="#fff">+8,000</text><text x="44" y="54" textAnchor="middle" fontFamily="Playfair Display" fontSize="9" fill="rgba(255,255,255,.7)" fontStyle="italic">jóvenes</text></g>
                  {/* MX · COL half-circle */}
                  <g transform="translate(8,105)"><path d="M0 45A45 45 0 0 1 90 45Z" fill="var(--lila)"/><text x="45" y="38" textAnchor="middle" fontFamily="Gabarito" fontSize="10" fontWeight="900" fill="#fff" letterSpacing="1">MX · COL</text></g>
                  {/* Fox blob */}
                  <g transform="translate(105,100)"><ellipse cx="42" cy="38" rx="42" ry="38" fill="var(--rosa)" opacity=".15"/><text x="42" y="44" textAnchor="middle" fontSize="36">🦊</text></g>
                  {/* VACANTES pill */}
                  <g transform="translate(190,140) rotate(4)"><rect width="120" height="50" rx="25" fill="var(--nar)" opacity=".9"/><text x="60" y="25" textAnchor="middle" fontFamily="Playfair Display" fontSize="8" fill="var(--dark)" fontStyle="italic" opacity=".6">verified</text><text x="60" y="40" textAnchor="middle" fontFamily="Gabarito" fontSize="13" fontWeight="900" fill="var(--dark)">VACANTES</text></g>
                  {/* Smiley */}
                  <g transform="translate(20,190) rotate(6)"><circle cx="32" cy="32" r="30" fill="var(--nar)"/><circle cx="22" cy="26" r="4" fill="var(--dark)"/><circle cx="42" cy="26" r="4" fill="var(--dark)"/><path d="M18 38C22 46 42 46 46 38" stroke="var(--dark)" strokeWidth="3" fill="none" strokeLinecap="round"/></g>
                  {/* STELLAR pill */}
                  <g transform="translate(100,210) rotate(-3)"><rect width="108" height="42" rx="21" fill="var(--lila)"/><text x="54" y="27" textAnchor="middle" fontFamily="Gabarito" fontSize="14" fontWeight="900" fill="#fff" letterSpacing="2">STELLAR</text></g>
                  {/* WEB3 blob */}
                  <g transform="translate(232,215)"><ellipse cx="32" cy="28" rx="32" ry="28" fill="var(--teal)"/><text x="32" y="34" textAnchor="middle" fontFamily="Gabarito" fontSize="11" fontWeight="900" fill="var(--dark)">WEB3</text></g>
                  {/* Sparkles */}
                  <g fill="var(--nar)"><path d="M285 20l3-8 3 8 8 3-8 3-3 8-3-8-8-3z"/><path d="M180 185l2-5 2 5 5 2-5 2-2 5-2-5-5-2z" fill="var(--rosa)"/><path d="M310 260l2-6 2 6 6 2-6 2-2 6-2-6-6-2z" fill="#fff" opacity=".3"/></g>
                  <g fill="#fff" opacity=".2"><path d="M130 170l2-5 2 5 5 2-5 2-2 5-2-5-5-2z"/><path d="M70 160l1.5-4 1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5z"/></g>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ========== SCALLOP (hero → dark) ========== */}
        <svg viewBox="0 0 1200 30" fill="var(--dark)" preserveAspectRatio="none" style={{ display: "block", width: "100%" }}>
          <path d="M0 30C50 30 50 0 100 0C150 0 150 30 200 30C250 30 250 0 300 0C350 0 350 30 400 30C450 30 450 0 500 0C550 0 550 30 600 30C650 30 650 0 700 0C750 0 750 30 800 30C850 30 850 0 900 0C950 0 950 30 1000 30C1050 30 1050 0 1100 0C1150 0 1150 30 1200 30V0H0Z" />
        </svg>

        {/* ========== MARQUEE ========== */}
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

        {/* ========== COMO FUNCIONA ========== */}
        <section id="como" className="py-20 px-4" style={{ background: "var(--cream)" }}>
          <div className="max-w-[1140px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-center mb-14">
              Tres pasos. Cero excusas. <span className="animate-twinkle inline-block" style={{ color: "var(--nar)" }}>✦</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { n: "1", title: "Únete al grupo", desc: "Escoge México o Colombia y entra al grupo de WhatsApp. 10 segundos.", color: "var(--rosa)" },
                { n: "2", title: "Escoge tu subcomunidad", desc: "Ingeniería, Negocios, Creativos, Ciencias Sociales o Web3.", color: "var(--lila)" },
                { n: "3", title: "Recibe y crece", desc: "Oportunidades en tu teléfono cada semana. Conecta con la comunidad.", color: "var(--nar)" },
              ].map((step) => (
                <div key={step.n} className="bento p-7 group">
                  <div className="relative w-[70px] h-[70px] mb-5">
                    <svg viewBox="0 0 70 70" className="w-full h-full">
                      <ellipse cx="35" cy="35" rx="34" ry="33" fill={step.color} />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-white font-gabarito font-black text-2xl">{step.n}</span>
                  </div>
                  <h3 className="text-xl font-black mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
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
                <div className="p-5 rounded-t-bento-lg" style={{ background: "var(--rosa)" }}>
                  <svg viewBox="0 0 200 180" fill="none" className="w-full">
                    <defs><pattern id="sw1" width="40" height="20" patternUnits="userSpaceOnUse"><path d="M0 20C10 20 10 10 20 10C30 10 30 20 40 20" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="1.5"/></pattern></defs>
                    <rect width="200" height="180" fill="url(#sw1)"/>
                    <g transform="translate(40,30)"><rect x="0" y="0" width="120" height="120" rx="30" fill="rgba(255,255,255,.15)"/><text x="60" y="55" textAnchor="middle" fontFamily="Gabarito" fontSize="14" fill="rgba(255,255,255,.7)" fontWeight="700">tu cv</text><text x="60" y="85" textAnchor="middle" fontFamily="Gabarito" fontSize="36" fontWeight="900" fill="#fff">PRO</text></g>
                  </svg>
                </div>
                <div className="p-7">
                  <h3 className="text-xl font-black mb-2">Review de CV</h3>
                  <p className="text-sm text-gray-500 mb-4">Sube tu CV y recibe feedback detallado para que destaque donde importa.</p>
                  <div className="flex gap-2 mb-4">
                    <span className="badge badge-rosa">PDF / Word</span>
                    <span className="badge badge-rosa">Feedback</span>
                  </div>
                  <span className="btn-rosa text-sm w-full text-center block">Revisar mi CV ✦</span>
                </div>
              </Link>

              {/* Asesoría */}
              <Link href="/cv/asesoria" className="bento-naranja p-0 overflow-hidden group cursor-pointer block">
                <div className="p-5 rounded-t-bento-lg" style={{ background: "var(--nar)" }}>
                  <svg viewBox="0 0 200 180" fill="none" className="w-full">
                    <defs><pattern id="sw2" width="40" height="20" patternUnits="userSpaceOnUse"><path d="M0 20C10 20 10 10 20 10C30 10 30 20 40 20" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="1.5"/></pattern></defs>
                    <rect width="200" height="180" fill="url(#sw2)"/>
                    <g transform="translate(30,20)"><circle cx="70" cy="70" r="65" fill="rgba(255,255,255,.12)"/><text x="70" y="58" textAnchor="middle" fontFamily="Gabarito" fontSize="14" fill="rgba(0,0,0,.4)" fontWeight="700">asesoría</text><text x="70" y="90" textAnchor="middle" fontFamily="Gabarito" fontSize="36" fontWeight="900" fill="var(--dark)">1:1</text></g>
                  </svg>
                </div>
                <div className="p-7">
                  <h3 className="text-xl font-black mb-2">Asesoría 1:1</h3>
                  <p className="text-sm text-gray-500 mb-4">Acompañamiento personalizado para aplicar a becas, vacantes o hacer tu plan de carrera.</p>
                  <div className="flex gap-2 mb-4">
                    <span className="badge badge-naranja">Mentores</span>
                    <span className="badge badge-naranja">30 min</span>
                  </div>
                  <span className="btn-primary text-sm w-full text-center block">Agendar sesión ✦</span>
                </div>
              </Link>

              {/* Chat */}
              <Link href="/chat" className="bento-teal p-0 overflow-hidden group cursor-pointer block">
                <div className="p-5 rounded-t-bento-lg" style={{ background: "var(--teal)" }}>
                  <svg viewBox="0 0 200 180" fill="none" className="w-full">
                    <defs><pattern id="sw3" width="40" height="20" patternUnits="userSpaceOnUse"><path d="M0 20C10 20 10 10 20 10C30 10 30 20 40 20" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="1.5"/></pattern></defs>
                    <rect width="200" height="180" fill="url(#sw3)"/>
                    <g transform="translate(40,25)"><ellipse cx="60" cy="55" rx="58" ry="52" fill="rgba(255,255,255,.12)"/><text x="60" y="58" textAnchor="middle" fontFamily="Gabarito" fontSize="14" fill="rgba(0,0,0,.4)" fontWeight="700">habla con</text><text x="60" y="90" textAnchor="middle" fontFamily="Gabarito" fontSize="30" fontWeight="900" fill="var(--dark)">🦊 CHAT</text></g>
                  </svg>
                </div>
                <div className="p-7">
                  <h3 className="text-xl font-black mb-2">Chat con Opportuni</h3>
                  <p className="text-sm text-gray-500 mb-4">Pregúntale lo que sea: becas, vacantes, programas, convocatorias.</p>
                  <div className="flex gap-2 mb-4">
                    <span className="badge badge-teal">Búsqueda web</span>
                    <span className="badge badge-teal">LATAM</span>
                  </div>
                  <span className="btn-teal text-sm w-full text-center block">Hablar con Opportuni ✦</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ========== TESTIMONIOS ========== */}
        <section id="testimonios" className="py-20 px-4" style={{ background: "var(--cream)" }}>
          <div className="max-w-[1140px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-center mb-14">
              Ellos ya están un paso adelante. <span className="animate-twinkle inline-block" style={{ color: "var(--nar)" }}>✦</span>
            </h2>

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
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, var(--rosa), var(--nar))" }}>
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
            <a
              href="https://chat.whatsapp.com/Iz07jRuw4WDE0uZgpvdGGm"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta"
            >
              Unirme ahora ✦
            </a>
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
              </div>
            </div>
            <div>
              <p className="font-mono text-xs font-bold uppercase mb-4" style={{ color: "var(--nar)" }}>Comunidad</p>
              <div className="space-y-2">
                <a href="https://chat.whatsapp.com/Iz07jRuw4WDE0uZgpvdGGm" target="_blank" rel="noopener noreferrer" className="block text-sm text-gray-500 hover:text-white transition-colors">México</a>
                <a href="https://chat.whatsapp.com/JsVEfmT8Iiv1R1fZWVqqdf" target="_blank" rel="noopener noreferrer" className="block text-sm text-gray-500 hover:text-white transition-colors">Colombia</a>
              </div>
            </div>
            <div>
              <p className="font-mono text-xs font-bold uppercase mb-4" style={{ color: "var(--nar)" }}>Síguenos</p>
              <div className="space-y-2">
                <a href="https://www.instagram.com/opportuni__mx/" target="_blank" rel="noopener noreferrer" className="block text-sm text-gray-500 hover:text-white transition-colors">Instagram</a>
                <a href="https://www.linkedin.com/company/opportunn/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="block text-sm text-gray-500 hover:text-white transition-colors">LinkedIn</a>
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
