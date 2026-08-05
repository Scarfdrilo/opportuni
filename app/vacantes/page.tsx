"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Vacante {
  id: string;
  titulo: string;
  empresa: string;
  ubicacion: string;
  tipo: "remoto" | "presencial" | "hibrido";
  salario?: string;
  descripcion: string;
  requisitos: string[];
  fechaPublicacion: string;
  url?: string;
}

const FILTROS = ["todos", "remoto", "presencial", "hibrido"] as const;

export default function VacantesPage() {
  const [vacantes, setVacantes] = useState<Vacante[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<string>("todos");

  useEffect(() => {
    fetch("/api/vacantes")
      .then((res) => res.json())
      .then((data) => setVacantes(data.vacantes || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = vacantes.filter((v) => filtro === "todos" || v.tipo === filtro);

  const tipoLabel = (t: string) => {
    if (t === "remoto") return "Remoto";
    if (t === "presencial") return "Presencial";
    if (t === "hibrido") return "Híbrido";
    return t;
  };

  const tipoBadge = (t: string) => {
    if (t === "remoto") return "badge-teal";
    if (t === "presencial") return "badge-lila";
    if (t === "hibrido") return "badge-rosa";
    return "badge-naranja";
  };

  const tipoShadow = (t: string) => {
    if (t === "remoto") return "var(--teal)";
    if (t === "presencial") return "var(--lila)";
    if (t === "hibrido") return "var(--rosa)";
    return "var(--nar)";
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      <nav className="nav-bento">
        <div className="flex items-center gap-3">
          <span className="font-gabarito text-xl font-black">Opportuni</span>
          <Link href="/" className="text-sm font-semibold text-gray-400 hover:text-opportuni-rosa transition-colors">← Inicio</Link>
        </div>
        <Link href="/chat" className="font-mono text-xs font-bold px-4 py-2 rounded-full border-bento border-opportuni-dark transition-all" style={{ background: "var(--teal)", color: "white", boxShadow: "2px 2px 0 var(--dark)" }}>
          Chat IA
        </Link>
      </nav>

      <main className="pt-[90px] pb-16 px-4">
        <div className="max-w-[1140px] mx-auto">
          <div className="mb-10">
            <div className="pill mb-6">
              <span className="dot" />
              VACANTES ACTIVAS
            </div>
            <h1 className="text-3xl md:text-[clamp(36px,5vw,52px)] font-black leading-[1.1] mb-3">
              Oportunidades{" "}
              <span className="font-playfair italic" style={{ color: "var(--rosa)" }}>para ti</span>{" "}
              <span className="animate-twinkle inline-block" style={{ color: "var(--nar)" }}>✦</span>
            </h1>
            <p className="text-gray-500 max-w-md">Las mejores vacantes en LATAM, actualizadas cada semana.</p>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {FILTROS.map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className="px-4 py-2 rounded-full text-sm font-bold border-bento border-opportuni-dark cursor-pointer transition-all"
                style={{
                  background: filtro === f ? "var(--rosa)" : "white",
                  color: filtro === f ? "white" : "var(--dark)",
                  boxShadow: filtro === f ? "3px 3px 0 var(--dark)" : "2px 2px 0 var(--dark)",
                }}
              >
                {f === "todos" ? "Todos" : tipoLabel(f)}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="bento p-16 text-center">
              <div className="w-8 h-8 mx-auto mb-4 border-[3px] border-opportuni-rosa border-t-transparent rounded-full animate-spin" />
              <p className="font-bold text-gray-500">Cargando vacantes...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bento p-16 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-black mb-2">No hay vacantes</h3>
              <p className="text-gray-500 mb-6 text-sm">
                {filtro !== "todos" ? "No hay vacantes con este filtro. Prueba otro." : "Pronto publicaremos nuevas oportunidades."}
              </p>
              <Link href="/" className="btn-primary inline-flex">Volver al inicio</Link>
            </div>
          ) : (
            <div className="grid gap-5">
              {filtered.map((v) => (
                <div
                  key={v.id}
                  className="bg-white border-bento border-opportuni-dark rounded-bento-lg p-6 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  style={{ boxShadow: `4px 4px 0 ${tipoShadow(v.tipo)}` }}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h2 className="text-lg font-black">{v.titulo}</h2>
                        <span className={`badge ${tipoBadge(v.tipo)}`}>{tipoLabel(v.tipo)}</span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-500 mb-3 flex-wrap text-sm">
                        <span className="font-bold">{v.empresa}</span>
                        <span className="font-mono text-xs">{v.ubicacion}</span>
                        {v.salario && <span className="font-bold" style={{ color: "var(--teal)" }}>{v.salario}</span>}
                      </div>
                      <p className="text-sm text-gray-500 mb-4 leading-relaxed">{v.descripcion}</p>
                      {v.requisitos.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {v.requisitos.slice(0, 5).map((req, idx) => (
                            <span key={idx} className="text-xs font-bold font-mono px-3 py-1 rounded-full border-bento border-opportuni-dark bg-white" style={{ boxShadow: "2px 2px 0 var(--dark)" }}>
                              {req}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      {v.url ? (
                        v.url.startsWith("/") ? (
                          <Link href={v.url} className="btn-rosa text-center whitespace-nowrap px-6 py-3 text-sm">
                            Aplicar ✦
                          </Link>
                        ) : (
                          <a href={v.url} target="_blank" rel="noopener noreferrer" className="btn-rosa text-center whitespace-nowrap px-6 py-3 text-sm">
                            Aplicar ✦
                          </a>
                        )
                      ) : (
                        <button className="btn-rosa px-6 py-3 text-sm">Aplicar ✦</button>
                      )}
                      <span className="text-xs text-gray-400 text-center font-mono">
                        {new Date(v.fechaPublicacion).toLocaleDateString("es-MX")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
