"use client";

import { useAccesly } from "@accesly/react";
import Link from "next/link";
import { useState } from "react";
import { convocatorias, Convocatoria } from "../lib/convocatorias-store";

const displayName = (username: string | null) => {
  if (!username) return "Mi cuenta";
  const base = username.includes("@") ? username.split("@")[0] : username;
  return base.replace(/[._-]/g, " ").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

const tipoColors: Record<string, string> = {
  "Programa": "badge-rosa",
  "Aceleradora": "badge-naranja",
  "Competencia": "badge-lila",
  "Financiamiento": "badge-teal",
  "Fellowship": "badge-rosa",
  "Incubación": "badge-naranja",
  "Red/Mentoría": "badge-lila",
  "Herramientas": "badge-teal",
  "Festival": "badge-rosa",
  "Capacitación": "badge-naranja",
  "Programa + Premio": "badge-lila",
  "Innovación social": "badge-teal",
  "Fondo": "badge-rosa",
};

const paisFlags: Record<string, string> = {
  "México": "🇲🇽",
  "Global": "🌎",
  "LATAM": "🌎",
  "EUA": "🇺🇸",
  "EUA (remoto)": "🇺🇸",
};

export default function ConvocatoriasPage() {
  const { auth } = useAccesly();
  const loggedIn = auth.status === "authenticated";
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroPais, setFiltroPais] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState<string>("");

  // Get unique tipos and paises for filters
  const tipos = ["todos", ...Array.from(new Set(convocatorias.map(c => c.tipo)))];
  const paises = ["todos", ...Array.from(new Set(convocatorias.map(c => c.paisDestino)))];

  // Filter convocatorias
  const filtradas = convocatorias.filter(c => {
    const matchTipo = filtroTipo === "todos" || c.tipo === filtroTipo;
    const matchPais = filtroPais === "todos" || c.paisDestino === filtroPais;
    const matchBusqueda = busqueda === "" || 
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.organizacion.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    return matchTipo && matchPais && matchBusqueda;
  });

  // If not logged in, show login prompt
  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream)" }}>
        <div className="text-center max-w-md px-6">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-black mb-4" style={{ color: "var(--rosa)" }}>
            Contenido Exclusivo
          </h1>
          <p className="text-gray-600 mb-8">
            Las convocatorias curadas están disponibles solo para miembros. 
            Inicia sesión para acceder a +29 oportunidades de becas, aceleradoras, 
            competencias y más.
          </p>
          <button
            onClick={() => auth.signInWithGoogle()}
            className="btn-primary"
          >
            Iniciar sesión ✦
          </button>
          <Link href="/" className="block mt-6 text-sm text-gray-500 hover:text-gray-700">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      {/* Connect Button Portal */}
      <div className="connect-button-portal">
        {loggedIn ? (
          <button
            onClick={() => auth.signOut()}
            className="user-pill"
            title="Cerrar sesión"
            style={{ cursor: "pointer" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-opportuni.png" alt="" className="user-pill-avatar" />
            <span>{displayName(auth.username)}</span>
          </button>
        ) : (
          <button
            onClick={() => auth.signInWithGoogle()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.55rem",
              padding: "0.7rem 1.4rem",
              background: "linear-gradient(135deg, var(--rosa) 0%, var(--nar) 100%)",
              color: "#ffffff",
              border: "2.5px solid var(--dark)",
              borderRadius: "9999px",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "transform 0.15s, box-shadow 0.15s",
              boxShadow: "3px 3px 0 var(--dark)",
              fontFamily: "Gabarito, var(--font-body), system-ui, sans-serif",
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2.5" />
              <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
            </svg>
            Iniciar sesión
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="nav-bento">
        <Link href="/" className="flex items-center gap-[10px]">
          <img src="/logo-opportuni.png" alt="Opportuni" style={{ height: 40, width: "auto" }} />
          <span className="font-gabarito text-[22px] font-black text-opportuni-dark">Opportuni</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-semibold text-gray-500 hover:text-opportuni-rosa">
            Inicio
          </Link>
          {/* Placeholder for alignment */}
          <div style={{ width: 140 }} />
        </div>
      </nav>

      <main className="pt-[100px] pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="pill mb-4 inline-flex">
              <span className="dot" />
              {convocatorias.length} CONVOCATORIAS CURADAS
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Oportunidades para{" "}
              <span className="font-playfair italic" style={{ color: "var(--rosa)" }}>
                mexicanos 2026
              </span>
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Becas, aceleradoras, competencias, financiamiento y programas. 
              Todas verificadas y actualizadas.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            {/* Search */}
            <input
              type="text"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-opportuni-rosa"
              style={{ minWidth: 200 }}
            />
            
            {/* Tipo filter */}
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-opportuni-rosa bg-white"
            >
              {tipos.map(t => (
                <option key={t} value={t}>
                  {t === "todos" ? "Todos los tipos" : t}
                </option>
              ))}
            </select>

            {/* Pais filter */}
            <select
              value={filtroPais}
              onChange={(e) => setFiltroPais(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-opportuni-rosa bg-white"
            >
              {paises.map(p => (
                <option key={p} value={p}>
                  {p === "todos" ? "Todos los países" : `${paisFlags[p] || "🌎"} ${p}`}
                </option>
              ))}
            </select>
          </div>

          {/* Results count */}
          <p className="text-center text-sm text-gray-500 mb-6">
            Mostrando {filtradas.length} de {convocatorias.length} convocatorias
          </p>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtradas.map((c) => (
              <ConvocatoriaCard key={c.id} convocatoria={c} />
            ))}
          </div>

          {filtradas.length === 0 && (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-gray-500">No se encontraron convocatorias con esos filtros.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ConvocatoriaCard({ convocatoria }: { convocatoria: Convocatoria }) {
  const c = convocatoria;
  const badgeClass = tipoColors[c.tipo] || "badge-rosa";
  const flag = paisFlags[c.paisDestino] || "🌎";

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className={`badge ${badgeClass}`}>{c.tipo}</span>
        <span className="text-xl" title={c.paisDestino}>{flag}</span>
      </div>

      {/* Title */}
      <h3 className="font-bold text-lg mb-1 text-opportuni-dark">{c.nombre}</h3>
      <p className="text-sm text-gray-500 mb-3">{c.organizacion}</p>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{c.descripcion}</p>

      {/* Benefits */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-400 mb-1">BENEFICIOS</p>
        <p className="text-sm text-gray-600">{c.beneficios}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-400">Cierre</p>
          <p className="text-sm font-medium" style={{ color: "var(--rosa)" }}>{c.fechaCierre}</p>
        </div>
        <a
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-sm py-2 px-4"
        >
          Ver más →
        </a>
      </div>
    </div>
  );
}
