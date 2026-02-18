"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccesly } from "accesly";

const getNameFromEmail = (email: string) => {
  const name = email.split("@")[0].replace(/[._-]/g, " ");
  return name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

const TOPICS = ["Becas", "Primer empleo", "Plan de carrera", "CV", "Cambio de carrera", "Emprendimiento", "Tech", "Otro"];

export default function AsesoriaPage() {
  const { wallet, connect } = useAccesly();
  const [topic, setTopic] = useState("");
  const [desc, setDesc] = useState("");
  const [showPay, setShowPay] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePay = () => {
    if (!topic) { alert("Selecciona un tema primero"); return; }
    setShowPay(true);
  };

  const copyClabe = () => {
    navigator.clipboard.writeText("638180000155390737");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      <nav className="nav-bento">
        <div className="flex items-center gap-3">
          <span className="font-gabarito text-xl font-black">Opportuni</span>
          <Link href="/" className="text-sm font-semibold text-gray-400 hover:text-opportuni-rosa transition-colors">← Inicio</Link>
        </div>
        {wallet ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border-bento border-opportuni-dark overflow-hidden flex items-center justify-center" style={{ background: "var(--cream)", boxShadow: "2px 2px 0 var(--dark)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-opportuni.png" alt="" style={{ height: 22, width: "auto" }} />
            </div>
            <span className="font-gabarito text-sm font-bold text-opportuni-dark hidden sm:inline">
              {getNameFromEmail(wallet.email)}
            </span>
          </div>
        ) : (
          <button
            onClick={() => connect()}
            className="font-gabarito text-sm font-bold px-5 py-2 rounded-full border-bento border-opportuni-dark cursor-pointer transition-all"
            style={{ background: "var(--rosa)", color: "white", boxShadow: "2px 2px 0 var(--dark)" }}
          >
            Iniciar sesión
          </button>
        )}
      </nav>

      <main className="pt-[90px] pb-16 px-4">
        <div className="max-w-[1140px] mx-auto grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          {/* Left */}
          <div className="pt-8">
            <div className="pill mb-6" style={{ background: "var(--nar)" }}>
              <span className="dot" />
              ASESORÍA PERSONALIZADA
            </div>
            <h1 className="text-3xl md:text-[clamp(36px,5vw,52px)] font-black leading-[1.1] mb-5">
              30 min con{" "}
              <span className="font-playfair italic" style={{ color: "var(--rosa)" }}>Vianey</span>{" "}
              <span className="animate-twinkle inline-block" style={{ color: "var(--nar)" }}>✦</span>
            </h1>
            <p className="text-gray-500 mb-8 max-w-md">
              Hablemos sobre becas, tu carrera, aplicaciones o lo que necesites. Sin rodeos, directo al punto.
            </p>

            <div className="bento p-5 inline-flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ background: "linear-gradient(135deg, var(--rosa), var(--nar))" }}>
                V
              </div>
              <div>
                <p className="font-bold">Vianey</p>
                <p className="text-xs text-gray-400 font-mono">Fundadora de Opportuni</p>
              </div>
              <span className="badge badge-naranja ml-2">30 min</span>
            </div>

            <div className="flex gap-3">
              <div className="stat">
                <span className="font-gabarito font-black text-lg" style={{ color: "var(--rosa)" }}>+50</span>
                <span className="text-xs font-bold text-gray-400">sesiones</span>
              </div>
              <div className="stat">
                <span className="font-gabarito font-black text-lg" style={{ color: "var(--nar)" }}>4.9 ★</span>
                <span className="text-xs font-bold text-gray-400">rating</span>
              </div>
            </div>

            {/* Art Panel SVG — Stickers */}
            <div className="mt-8 rounded-bento-lg border-bento border-opportuni-dark overflow-hidden" style={{ background: "var(--nar)", boxShadow: "5px 5px 0 var(--dark)" }}>
              <svg viewBox="0 0 340 220" fill="none" className="w-full">
                <defs><pattern id="sw" width="40" height="20" patternUnits="userSpaceOnUse"><path d="M0 20C10 20 10 10 20 10C30 10 30 20 40 20" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="1.5"/></pattern></defs>
                <rect width="340" height="220" fill="url(#sw)"/>
                {/* 1:1 center circle */}
                <g transform="translate(90,30)"><circle cx="80" cy="75" r="70" fill="rgba(255,255,255,.12)"/><text x="80" y="62" textAnchor="middle" fontFamily="Gabarito" fontSize="14" fill="rgba(0,0,0,.35)" fontWeight="700">asesoría</text><text x="80" y="100" textAnchor="middle" fontFamily="Gabarito" fontSize="46" fontWeight="900" fill="var(--dark)">1:1</text></g>
                {/* STICKER: Birrete — BECAS */}
                <g transform="translate(12,10) rotate(-6)">
                  <ellipse cx="40" cy="42" rx="40" ry="38" fill="var(--rosa)"/>
                  <polygon points="40,20 12,32 40,44 68,32" fill="#fff"/>
                  <rect x="30" y="18" width="20" height="4" rx="2" fill="#fff" opacity=".7"/>
                  <line x1="60" y1="32" x2="65" y2="45" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="65" cy="46" r="2.5" fill="#fff"/>
                  <text x="40" y="62" textAnchor="middle" fontFamily="Gabarito" fontSize="9" fontWeight="900" fill="#fff" letterSpacing=".5">BECAS</text>
                </g>
                {/* STICKER: Rocket — CARRERA */}
                <g transform="translate(238,5) rotate(5)">
                  <rect width="90" height="70" rx="22" fill="var(--dark)"/>
                  <g transform="translate(22,8)">
                    <ellipse cx="23" cy="22" rx="10" ry="16" fill="#fff"/>
                    <circle cx="23" cy="18" r="4" fill="var(--nar)"/>
                    <path d="M13 30L8 38L17 34Z" fill="var(--rosa)"/>
                    <path d="M33 30L38 38L29 34Z" fill="var(--rosa)"/>
                    <ellipse cx="23" cy="40" rx="5" ry="7" fill="var(--nar)"/>
                    <ellipse cx="23" cy="42" rx="3" ry="4" fill="var(--rosa)"/>
                  </g>
                  <text x="45" y="62" textAnchor="middle" fontFamily="Gabarito" fontSize="9" fontWeight="900" fill="#fff" letterSpacing=".5">CARRERA</text>
                </g>
                {/* STICKER: Globe — LATAM */}
                <g transform="translate(10,148) rotate(4)">
                  <rect width="82" height="64" rx="20" fill="var(--teal)"/>
                  <circle cx="41" cy="26" r="16" fill="none" stroke="#fff" strokeWidth="2"/>
                  <ellipse cx="41" cy="26" rx="8" ry="16" fill="none" stroke="#fff" strokeWidth="1.2"/>
                  <line x1="25" y1="26" x2="57" y2="26" stroke="#fff" strokeWidth="1.2"/>
                  <line x1="28" y1="17" x2="54" y2="17" stroke="#fff" strokeWidth="1" opacity=".6"/>
                  <line x1="28" y1="35" x2="54" y2="35" stroke="#fff" strokeWidth="1" opacity=".6"/>
                  <text x="41" y="56" textAnchor="middle" fontFamily="Gabarito" fontSize="9" fontWeight="900" fill="var(--dark)" letterSpacing=".5">LATAM</text>
                </g>
                {/* STICKER: Lightning bolt — TECH */}
                <g transform="translate(245,142) rotate(-3)">
                  <ellipse cx="38" cy="36" rx="38" ry="36" fill="var(--lila)"/>
                  <path d="M40 10L26 32H34L30 50L48 30H40Z" fill="#fff"/>
                  <text x="38" y="66" textAnchor="middle" fontFamily="Gabarito" fontSize="10" fontWeight="900" fill="#fff" letterSpacing=".5">TECH</text>
                </g>
                {/* Tiny sticker: Star */}
                <g transform="translate(178,170) rotate(8)"><circle cx="14" cy="14" r="14" fill="var(--rosa)" opacity=".8"/><path d="M14 4l2.5 6.5L24 12l-5.5 3.5L20 22l-6-4-6 4 1.5-6.5L4 12l7.5-1.5Z" fill="#fff"/></g>
                {/* Tiny sticker: Heart */}
                <g transform="translate(80,175) rotate(-5)"><circle cx="12" cy="12" r="12" fill="var(--nar)" opacity=".7"/><path d="M12 8C10 4 4 5 4 9C4 14 12 18 12 18C12 18 20 14 20 9C20 5 14 4 12 8Z" fill="#fff" transform="translate(0,1) scale(.7)" style={{ transformOrigin: "12px 12px" }}/></g>
                {/* Sparkles */}
                <g fill="#fff" opacity=".35"><path d="M170 8l2-6 2 6 6 2-6 2-2 6-2-6-6-2z"/><path d="M305 110l2-5 2 5 5 2-5 2-2 5-2-5-5-2z"/><path d="M140 185l1.5-4 1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5z"/></g>
                <g fill="var(--dark)" opacity=".12"><path d="M50 110l1.5-4 1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5z"/><path d="M280 50l2-5 2 5 5 2-5 2-2 5-2-5-5-2z"/></g>
              </svg>
            </div>
          </div>

          {/* Right */}
          <div className="bento p-7">
            <h3 className="text-lg font-black mb-5">¿Sobre qué hablamos?</h3>

            <div className="flex flex-wrap gap-2 mb-5">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className={`px-4 py-2 rounded-full text-sm font-bold border-bento border-opportuni-dark cursor-pointer transition-all ${
                    topic === t ? "text-white" : "bg-white text-opportuni-dark hover:bg-opportuni-cream"
                  }`}
                  style={{
                    background: topic === t ? "var(--nar)" : undefined,
                    boxShadow: topic === t ? "3px 3px 0 var(--dark)" : "2px 2px 0 var(--dark)",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Cuéntale a Vianey qué necesitas (opcional)..."
              rows={2}
              className="textarea-bento mb-5"
            />

            <button onClick={handlePay} className="btn-rosa w-full text-center">
              Pagar y agendar ✦
            </button>
            <p className="text-xs text-gray-400 text-center mt-3 font-mono">$300 MXN · Transferencia SPEI</p>

            {showPay && (
              <div className="mt-6 p-6 rounded-bento-lg border-bento border-opportuni-dark animate-slide-up" style={{ background: "var(--cream2)", boxShadow: "4px 4px 0 var(--dark)" }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: "var(--teal)" }}>$</div>
                  <div>
                    <p className="font-bold text-sm">Paso 1: Transfiere</p>
                    <p className="text-xs text-gray-400">Después elige tu horario</p>
                  </div>
                  <span className="ml-auto font-gabarito font-black text-xl">$300 MXN</span>
                </div>

                <div className="space-y-3 text-sm mb-5">
                  <div className="flex justify-between"><span className="text-gray-400 font-mono text-xs">Banco</span><span className="font-bold">Nu</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 font-mono text-xs">Beneficiario</span><span className="font-bold text-xs">Vianey Alejandra Alvarez Alvarado</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 font-mono text-xs">CLABE</span><span className="font-bold font-mono text-xs">638180000155390737</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 font-mono text-xs">Concepto</span><span className="font-bold text-xs">Asesoría Opportuni</span></div>
                </div>

                <button
                  onClick={copyClabe}
                  className="w-full py-3 rounded-full text-sm font-bold border-bento border-opportuni-dark cursor-pointer transition-all text-center"
                  style={{
                    background: copied ? "var(--teal)" : "var(--dark)",
                    color: "white",
                    boxShadow: copied ? "3px 3px 0 var(--teal)" : "3px 3px 0 var(--rosa)",
                  }}
                >
                  {copied ? "¡Copiada! ✓" : "Copiar CLABE 📋"}
                </button>

                <div className="border-t-2 border-dashed border-gray-300 mt-6 pt-5">
                  <p className="font-bold text-sm mb-3">Paso 2: Elige tu horario</p>
                  <a
                    href="https://calendar.app.google/FTLxa2RCwLnvwQj8A"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-teal w-full text-center block"
                  >
                    Abrir Google Calendar →
                  </a>
                  <p className="text-xs text-gray-400 mt-3 text-center">
                    Envía tu comprobante a <strong>opportuniopportuni@gmail.com</strong> para confirmar
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
