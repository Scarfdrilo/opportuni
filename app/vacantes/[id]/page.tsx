import Link from "next/link";
import { getVacanteById } from "../../lib/supabase";

export const dynamic = "force-dynamic";

const tipoLabel: Record<string, string> = {
  remoto: "Remoto",
  presencial: "Presencial",
  hibrido: "Híbrido",
};

const tipoBadge: Record<string, string> = {
  remoto: "badge-teal",
  presencial: "badge-lila",
  hibrido: "badge-rosa",
};

const tipoShadow: Record<string, string> = {
  remoto: "var(--teal)",
  presencial: "var(--lila)",
  hibrido: "var(--rosa)",
};

// Detalle de una vacante (destino del link corto /v/{id} cuando la vacante
// no tiene URL externa). Server component: lee Supabase directo.
export default async function VacanteDetallePage({ params }: { params: { id: string } }) {
  const v = await getVacanteById(params.id).catch(() => null);

  if (!v || !v.activa) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--cream)" }}>
        <div className="bento p-10 max-w-sm text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl font-black mb-2">Vacante no encontrada</h1>
          <p className="text-sm text-gray-500 mb-6">Este link ya no está activo o no existe.</p>
          <Link href="/vacantes" className="btn-rosa w-full text-center block">Ver vacantes activas ✦</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      <nav className="nav-bento">
        <div className="flex items-center gap-3">
          <span className="font-gabarito text-xl font-black">Opportuni</span>
          <Link href="/vacantes" className="text-sm font-semibold text-gray-400 hover:text-opportuni-rosa transition-colors">← Vacantes</Link>
        </div>
        <Link href="/" className="text-sm font-semibold text-gray-400 hover:text-opportuni-rosa transition-colors">Inicio</Link>
      </nav>

      <main className="pt-[100px] pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="pill mb-6">
            <span className="dot" />
            VACANTE ACTIVA
          </div>

          <div
            className="bg-white border-bento border-opportuni-dark rounded-bento-lg p-8"
            style={{ boxShadow: `5px 5px 0 ${(v.tipo && tipoShadow[v.tipo]) || "var(--nar)"}` }}
          >
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-black leading-tight">{v.titulo}</h1>
              {v.tipo && <span className={`badge ${tipoBadge[v.tipo]}`}>{tipoLabel[v.tipo]}</span>}
            </div>

            <div className="flex items-center gap-4 text-gray-500 mb-5 flex-wrap text-sm">
              {v.empresa && <span className="font-bold">{v.empresa}</span>}
              {v.ubicacion && <span className="font-mono text-xs">{v.ubicacion}</span>}
              {v.salario && <span className="font-bold" style={{ color: "var(--teal)" }}>{v.salario}</span>}
            </div>

            {v.descripcion && (
              <p className="text-sm text-gray-600 leading-relaxed mb-6 whitespace-pre-wrap">{v.descripcion}</p>
            )}

            <Link href={`/postular/${encodeURIComponent(v.id)}`} className="btn-rosa w-full text-center block mb-3">
              Postularme ✦
            </Link>

            {v.url_destino && (
              <a
                href={v.url_destino}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-sm font-bold py-2"
                style={{ color: "var(--rosa)" }}
              >
                Ver la vacante original →
              </a>
            )}
          </div>

          <p className="text-xs text-gray-400 text-center mt-6">
            Publicado el {new Date(v.created_at).toLocaleDateString("es-MX", { dateStyle: "long" })} · Opportuni ✦
          </p>
        </div>
      </main>
    </div>
  );
}
