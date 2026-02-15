"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ConnectButton } from "accesly";

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

export default function VacantesPage() {
  const [vacantes, setVacantes] = useState<Vacante[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<string>("todos");

  useEffect(() => {
    fetchVacantes();
  }, []);

  const fetchVacantes = async () => {
    try {
      const res = await fetch("/api/vacantes");
      const data = await res.json();
      setVacantes(data.vacantes || []);
    } catch (error) {
      console.error("Error fetching vacantes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVacantes = vacantes.filter(v => 
    filtro === "todos" || v.tipo === filtro
  );

  const tipoLabel = (tipo: string) => {
    switch (tipo) {
      case "remoto": return "🏠 Remoto";
      case "presencial": return "🏢 Presencial";
      case "hibrido": return "🔄 Híbrido";
      default: return tipo;
    }
  };

  const tipoColor = (tipo: string) => {
    switch (tipo) {
      case "remoto": return "bg-green-100 text-green-700";
      case "presencial": return "bg-blue-100 text-blue-700";
      case "hibrido": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-opportuni-gradient flex items-center justify-center">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <span className="text-2xl font-bold gradient-text">Opportuni</span>
          </Link>
          
          <ConnectButton />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Vacantes <span className="gradient-text">disponibles</span>
          </h1>
          <p className="text-gray-600">
            Las mejores oportunidades laborales en LATAM
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {["todos", "remoto", "presencial", "hibrido"].map((tipo) => (
            <button
              key={tipo}
              onClick={() => setFiltro(tipo)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                filtro === tipo
                  ? "bg-opportuni-gradient text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tipo === "todos" ? "🌐 Todos" : tipoLabel(tipo)}
            </button>
          ))}
        </div>

        {/* Vacantes List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-opportuni-pink border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-500">Cargando vacantes...</p>
          </div>
        ) : filteredVacantes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold mb-2">No hay vacantes disponibles</h3>
            <p className="text-gray-500 mb-6">
              {filtro !== "todos" 
                ? "No hay vacantes con este filtro. Prueba otro."
                : "Pronto publicaremos nuevas oportunidades."}
            </p>
            <Link href="/" className="btn-opportuni inline-block">
              Volver al inicio
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredVacantes.map((vacante) => (
              <div key={vacante.id} className="card hover:border-opportuni-pink border border-transparent">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-semibold">{vacante.titulo}</h2>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${tipoColor(vacante.tipo)}`}>
                        {tipoLabel(vacante.tipo)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        🏢 {vacante.empresa}
                      </span>
                      <span className="flex items-center gap-1">
                        📍 {vacante.ubicacion}
                      </span>
                      {vacante.salario && (
                        <span className="flex items-center gap-1">
                          💰 {vacante.salario}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 mb-4">{vacante.descripcion}</p>

                    {vacante.requisitos.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {vacante.requisitos.slice(0, 5).map((req, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {req}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {vacante.url ? (
                      <a 
                        href={vacante.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-opportuni text-center whitespace-nowrap"
                      >
                        Aplicar →
                      </a>
                    ) : (
                      <button className="btn-opportuni">Aplicar →</button>
                    )}
                    <span className="text-sm text-gray-400 text-center">
                      {new Date(vacante.fechaPublicacion).toLocaleDateString('es-MX')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
