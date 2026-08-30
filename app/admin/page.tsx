import Link from "next/link";

// El dashboard estaba gateado por la wallet Accesly (NEXT_PUBLIC_ADMIN_WALLETS).
// Al retirar esa infra no queda forma de autenticar al admin, así que la página
// queda desactivada y las rutas /api/admin/* responden 503. El dashboard
// completo (CVs, reuniones, vacantes y reporte PDF) sigue en el historial de
// git — para reactivarlo hace falta definir antes un nuevo mecanismo de acceso.
export const metadata = { title: "Dashboard no disponible · Opportuni" };

export default function AdminPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--cream)" }}>
      <div className="bento p-8 max-w-sm text-center">
        <div className="text-4xl mb-3">🚧</div>
        <h1 className="text-2xl font-black mb-2">Dashboard no disponible</h1>
        <p className="text-sm text-gray-500 mb-6">
          El dashboard está desactivado temporalmente mientras se define un nuevo
          método de acceso. ✦
        </p>
        <Link href="/" className="btn-rosa w-full text-center block">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
