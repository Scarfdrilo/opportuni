"use client";

import { useAccesly, useBalance } from "@accesly/react";
import {
  BalanceCard,
  MovementsList,
  SendFlow,
  ReceiveFlow,
  AddFundsFlow,
  CreateWalletFlow,
  RecoveryFlow,
} from "@accesly/react/kit";
import { useEffect, useState } from "react";

type View = "loading" | "create" | "home" | "recover";
type Tab = "home" | "send" | "receive" | "addFunds";

// Precio fijo de XLM en USD para decidir el asset principal por VALOR.
// TODO: reemplazar por un precio en vivo cuando se decida.
const XLM_USD = 0.19;

export default function WalletModal({ onClose }: { onClose: () => void }) {
  const { auth, wallet } = useAccesly();
  const balance = useBalance();
  const email = auth.username ?? "";

  // Asset principal del banner = el de mayor VALOR (USDC ≈ $1, XLM a precio fijo).
  const usdcValue = Number(balance.usdc ?? 0);
  const xlmValue = Number(balance.xlm ?? 0) * XLM_USD;
  const primaryAsset: "USDC" | "XLM" = xlmValue > usdcValue ? "XLM" : "USDC";

  const [view, setView] = useState<View>("loading");
  const [tab, setTab] = useState<Tab>("home");
  // Google users have no Cognito password, so bootstrap needs a recovery
  // passphrase the user chooses here. They MUST remember it to recover on a
  // new device.
  const [askPass, setAskPass] = useState(true);
  const [passphrase, setPassphrase] = useState("");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const cred = email ? await wallet.getStoredCredential(email) : null;
        if (!cancelled) setView(cred ? "home" : "create");
      } catch {
        if (!cancelled) setView("create");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [email, wallet]);

  const back = () => setTab("home");

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bento"
        style={{
          background: "var(--cream)",
          width: "min(92vw, 400px)",
          maxHeight: "85vh",
          overflowY: "auto",
          padding: 20,
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          style={{
            position: "absolute",
            top: 12,
            right: 14,
            zIndex: 6,
            border: "none",
            background: "transparent",
            fontSize: 20,
            cursor: "pointer",
            color: "var(--dark)",
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        {view === "loading" && (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div className="w-8 h-8 border-3 border-opportuni-rosa border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        )}

        {view === "home" && tab === "home" && (
          <div className="space-y-4">
            <BalanceCard primaryAsset={primaryAsset} />
            <div className="grid grid-cols-3 gap-2">
              <WalletAction label="Enviar" color="var(--rosa)" onClick={() => setTab("send")} icon="↑" />
              <WalletAction label="Recibir" color="var(--teal)" onClick={() => setTab("receive")} icon="↓" />
              <WalletAction label="Agregar" color="var(--nar)" onClick={() => setTab("addFunds")} icon="＋" />
            </div>
            <div>
              <p className="font-gabarito font-bold text-sm mb-2 mt-2">Movimientos</p>
              <MovementsList limit={20} />
            </div>
          </div>
        )}

        {view === "home" && tab !== "home" && (
          <div>
            <button
              onClick={back}
              style={{ border: "none", background: "transparent", fontSize: 14, fontWeight: 700, cursor: "pointer", color: "var(--dark)", marginBottom: 8 }}
            >
              ← Volver
            </button>
            {tab === "send" && <SendFlow onCancel={back} onSuccess={back} />}
            {tab === "receive" && <ReceiveFlow onClose={back} />}
            {tab === "addFunds" && <AddFundsFlow onCancel={back} onSuccess={back} />}
          </div>
        )}

        {view === "recover" && (
          <RecoveryFlow onDone={() => setView("home")} onCancel={onClose} />
        )}

        {view === "create" && askPass && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (passphrase.length >= 8) setAskPass(false);
            }}
            style={{ textAlign: "center", padding: "8px 0" }}
          >
            <h2 className="text-2xl font-black mb-2">Crea tu wallet</h2>
            <p className="text-sm text-gray-500 mb-5">
              Elige una <strong>frase de recuperación</strong> (mín. 8 caracteres). La necesitarás para
              recuperar tu wallet en otro dispositivo, así que guárdala bien. ✦
            </p>
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Tu frase de recuperación"
              autoComplete="new-password"
              className="input-bento w-full mb-4"
            />
            <button type="submit" disabled={passphrase.length < 8} className="btn-rosa w-full text-center disabled:opacity-50">
              Continuar ✦
            </button>
          </form>
        )}

        {view === "create" && !askPass && (
          <CreateWalletFlow
            email={email}
            password={passphrase}
            onDone={() => setView("home")}
            onRecoverInstead={() => setView("recover")}
            onError={() => setAskPass(true)}
          />
        )}
      </div>
    </div>
  );
}

function WalletAction({ label, icon, color, onClick }: { label: string; icon: string; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1 py-3 rounded-2xl bg-white transition-all"
      style={{ border: "2.5px solid var(--dark)", boxShadow: "2px 2px 0 var(--dark)", cursor: "pointer" }}
    >
      <span
        className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold text-white"
        style={{ background: color }}
      >
        {icon}
      </span>
      <span className="text-xs font-bold" style={{ color: "var(--dark)" }}>{label}</span>
    </button>
  );
}
