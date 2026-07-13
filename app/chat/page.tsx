"use client";

import { useState, useRef, useEffect } from "react";
import { useAccesly } from "@accesly/react";
import Link from "next/link";

const displayName = (username: string | null) => {
  if (!username) return "Mi cuenta";
  const base = username.includes("@") ? username.split("@")[0] : username;
  return base.replace(/[._-]/g, " ").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "Becas de ingeniería en Europa",
  "Vacantes remotas en tech",
  "Programas para recién egresados",
];

export default function ChatPage() {
  const { auth } = useAccesly();
  const loading = auth.status === "bootstrapping";
  const loggedIn = auth.status === "authenticated";
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "¡Hola! Soy **Opportuni** ✦ Pregúntame sobre cualquier beca, vacante, programa o convocatoria en LATAM. ¿Qué estás buscando?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSugs, setShowSugs] = useState(true);
  const msgsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMsg = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;

    setInput("");
    setShowSugs(false);
    const newMessages: Message[] = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.message || "No pude procesar tu pregunta." }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Error de conexión. Intenta de nuevo." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream)" }}>
        <div className="w-8 h-8 border-3 border-opportuni-rosa border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--cream)" }}>
        <div className="bento p-10 max-w-sm text-center">
          <div className="w-16 h-16 rounded-full border-bento border-opportuni-dark flex items-center justify-center mx-auto mb-5 overflow-hidden" style={{ background: "var(--cream)", boxShadow: "3px 3px 0 var(--dark)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-opportuni.png" alt="Opportuni" style={{ height: 40, width: "auto" }} />
          </div>
          <h2 className="text-2xl font-black mb-2">Bienvenido a Opportuni</h2>
          <p className="text-sm text-gray-500 mb-6">Inicia sesión para acceder al chat y todos los servicios ✦</p>
          <button
            onClick={() => auth.signInWithGoogle()}
            className="btn-rosa w-full text-center"
          >
            Iniciar sesión ✦
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      <nav className="nav-bento">
        <div className="flex items-center gap-3">
          <span className="font-gabarito text-xl font-black">Opportuni</span>
          <Link href="/" className="text-sm font-semibold text-gray-400 hover:text-opportuni-rosa transition-colors">← Inicio</Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border-bento border-opportuni-dark overflow-hidden flex items-center justify-center" style={{ background: "var(--cream)", boxShadow: "2px 2px 0 var(--dark)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-opportuni.png" alt="" style={{ height: 22, width: "auto" }} />
          </div>
          <span className="font-gabarito text-sm font-bold text-opportuni-dark hidden sm:inline">
            {displayName(auth.username)}
          </span>
        </div>
      </nav>

      <main className="pt-[90px] pb-10 px-4">
        <div className="max-w-[1140px] mx-auto grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          <div className="pt-8">
            <div className="pill mb-6">
              <span className="dot" />
              +200 NUEVAS CADA SEMANA
            </div>
            <h1 className="text-3xl md:text-[clamp(36px,5vw,56px)] font-black leading-[1.1] mb-5">
              Pregúntale lo que sea.{" "}
              <span className="font-playfair italic" style={{ color: "var(--rosa)" }}>
                Opportuni te encuentra las mejores oportunidades.
              </span>
            </h1>
            <p className="text-gray-500 mb-8 max-w-md">
              Habla con Opportuni y encuentra becas, vacantes, retos y programas en segundos.
            </p>
            <div className="flex gap-3">
              <div className="stat">
                <span className="font-gabarito font-black text-lg" style={{ color: "var(--rosa)" }}>9.5K+</span>
                <span className="text-xs font-bold text-gray-400">miembros</span>
              </div>
              <div className="stat">
                <span className="font-gabarito font-black text-lg" style={{ color: "var(--nar)" }}>200+</span>
                <span className="text-xs font-bold text-gray-400">por semana</span>
              </div>
            </div>
          </div>

          <div className="bento overflow-hidden" style={{ height: "520px" }}>
            <div className="flex items-center gap-2 px-5 py-3" style={{ background: "var(--dark)" }}>
              <div className="w-2 h-2 rounded-full bg-opportuni-teal animate-pulse" />
              <span className="text-white text-sm font-bold font-gabarito">Chat con Opportuni</span>
            </div>

            <div ref={msgsRef} className="flex flex-col gap-3 overflow-y-auto p-4" style={{ background: "var(--cream)", height: "calc(100% - 120px)" }}>
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "msg-user" : "msg-bot"}>
                  {m.role === "assistant" ? (
                    <span dangerouslySetInnerHTML={{
                      __html: m.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--rosa)">$1</strong>')
                        .replace(/\n/g, "<br/>")
                    }} />
                  ) : m.content}
                </div>
              ))}

              {isLoading && (
                <div className="msg-bot flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bop" />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bop animation-delay-200" />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bop animation-delay-400" />
                </div>
              )}

              {showSugs && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMsg(s)}
                      className="text-xs font-bold font-mono px-3 py-2 rounded-full border-bento border-opportuni-dark bg-white hover:bg-opportuni-teal hover:text-white transition-all cursor-pointer"
                      style={{ boxShadow: "2px 2px 0 var(--dark)" }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 p-3 border-t-bento border-opportuni-dark" style={{ background: "white" }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMsg()}
                placeholder="Escribe tu pregunta..."
                className="input-bento flex-1"
              />
              <button
                onClick={() => sendMsg()}
                disabled={isLoading}
                className="w-12 h-12 rounded-full flex items-center justify-center border-bento border-opportuni-dark disabled:opacity-50 cursor-pointer"
                style={{ background: "var(--teal)", boxShadow: "3px 3px 0 var(--dark)" }}
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
