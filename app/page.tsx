"use client";

import { ConnectButton, useAccesly } from "accesly";
import Link from "next/link";

export default function Home() {
  const { wallet } = useAccesly();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-opportuni-gradient flex items-center justify-center">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <span className="text-2xl font-bold gradient-text">Opportuni</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/vacantes" className="text-gray-600 hover:text-opportuni-pink transition-colors">
              Vacantes
            </Link>
            <a href="#comunidad" className="text-gray-600 hover:text-opportuni-pink transition-colors">
              Comunidad
            </a>
            <a href="#empresas" className="text-gray-600 hover:text-opportuni-pink transition-colors">
              Para Empresas
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="pt-24">
        <section className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Conectamos <span className="gradient-text">talento</span> con
            <br />
            <span className="gradient-text">oportunidades</span> en LATAM
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Más de 2,500 profesionales en nuestra comunidad de WhatsApp.
            Las mejores vacantes en México, Colombia y toda Latinoamérica.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/vacantes" className="btn-opportuni text-lg px-8 py-4">
              Ver Vacantes
            </Link>
            <a 
              href="https://chat.whatsapp.com/your-group-link" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-opportuni-pink text-opportuni-pink rounded-xl font-semibold hover:bg-opportuni-pink hover:text-white transition-all"
            >
              Unirse a la Comunidad
            </a>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-opportuni-gradient py-16">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold">2,500+</div>
              <div className="text-white/80">Miembros</div>
            </div>
            <div>
              <div className="text-4xl font-bold">500+</div>
              <div className="text-white/80">Vacantes publicadas</div>
            </div>
            <div>
              <div className="text-4xl font-bold">15+</div>
              <div className="text-white/80">Países</div>
            </div>
            <div>
              <div className="text-4xl font-bold">100+</div>
              <div className="text-white/80">Empresas</div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="comunidad" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              ¿Por qué <span className="gradient-text">Opportuni</span>?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">Vacantes Verificadas</h3>
                <p className="text-gray-600">
                  Solo publicamos oportunidades reales de empresas confiables en LATAM.
                </p>
              </div>
              
              <div className="card text-center">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-semibold mb-2">Comunidad Activa</h3>
                <p className="text-gray-600">
                  Grupos de WhatsApp en México y Colombia con networking real.
                </p>
              </div>
              
              <div className="card text-center">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold mb-2">Acceso Rápido</h3>
                <p className="text-gray-600">
                  Recibe las vacantes directo en tu WhatsApp. Sin spam, solo oportunidades.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA for Companies */}
        <section id="empresas" className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              ¿Buscas talento para tu empresa?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Publica tus vacantes y llega a miles de profesionales en toda Latinoamérica.
            </p>
            <Link href="/publicar" className="btn-opportuni text-lg px-8 py-4 inline-block">
              Publicar Vacante
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-opportuni-gradient flex items-center justify-center">
                  <span className="text-white font-bold">O</span>
                </div>
                <span className="text-xl font-bold">Opportuni</span>
              </div>
              
              <p className="text-gray-400">
                Conectando talento con oportunidades en LATAM 🌎
              </p>
              
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  WhatsApp
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* User Panel (if logged in) */}
      {wallet && (
        <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Conectado como:</p>
          <p className="font-mono text-xs text-gray-700 truncate max-w-[200px]">
            {wallet.email || wallet.stellarAddress?.slice(0, 12) + "..."}
          </p>
        </div>
      )}
    </div>
  );
}
