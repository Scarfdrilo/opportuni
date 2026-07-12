"use client";

import { useAccesly, useBalance } from "@accesly/react";
import { useEffect, useState } from "react";

export type ServiceKey = "cv" | "asesoria";

const SERVICES: Record<ServiceKey, { title: string; priceXlm: number }> = {
  cv: { title: "Review de CV", priceXlm: Number(process.env.NEXT_PUBLIC_PRICE_CV_XLM ?? "0") },
  asesoria: { title: "Asesoría 1:1", priceXlm: Number(process.env.NEXT_PUBLIC_PRICE_ASESORIA_XLM ?? "0") },
};

const VIANEY = process.env.NEXT_PUBLIC_VIANEY_WALLET ?? "";
const FEE_WALLET = process.env.NEXT_PUBLIC_ACCESLY_FEE_WALLET ?? "";
const FEE_BPS = 300; // 3% de Accesly

type Status = "checking" | "no-wallet" | "misconfig" | "confirm" | "insufficient" | "signing" | "success" | "error";

export default function PayModal({
  service,
  onClose,
  onPaid,
  onNeedWallet,
}: {
  service: ServiceKey;
  onClose: () => void;
  onPaid: (service: ServiceKey) => void;
  onNeedWallet: () => void;
}) {
  const { auth, wallet, tx } = useAccesly();
  const balance = useBalance();
  const email = auth.username ?? "";
  const { title, priceXlm } = SERVICES[service];
  const totalStroops = Math.round(priceXlm * 1e7);

  const [status, setStatus] = useState<Status>("checking");
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");

  // On mount: validate config + that a wallet exists on this device.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!VIANEY || priceXlm <= 0) {
        if (!cancelled) setStatus("misconfig");
        return;
      }
      try {
        const cred = email ? await wallet.getStoredCredential(email) : null;
        if (!cancelled) setStatus(cred ? "confirm" : "no-wallet");
      } catch {
        if (!cancelled) setStatus("no-wallet");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [email, wallet, priceXlm]);

  // Move to "insufficient" once the balance loads and is too low.
  const balStroops = balance.stroops ? Number(balance.stroops) : 0;
  useEffect(() => {
    if (status === "confirm" && !balance.isLoading && balStroops < totalStroops) {
      setStatus("insufficient");
    }
  }, [status, balance.isLoading, balStroops, totalStroops]);

  const pay = async () => {
    setStatus("signing");
    setErr("");
    try {
      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
      const feeStroops = FEE_WALLET ? Math.round((totalStroops * FEE_BPS) / 10000) : 0;
      const mainStroops = totalStroops - feeStroops;

      // ===== Transacción 1: pago principal (97%) a Vianey =====
      // Desbloqueo + firma propios (1er biométrico).
      setNote("Confirma tu pago con el biométrico (1 de 2)…");
      const m1 = await wallet.unlockForSigning(email);
      setNote("Enviando tu pago…");
      await tx.send({
        destinationAddress: VIANEY,
        amountStroops: String(mainStroops),
        asset: "XLM",
        fragmentF1Plain: m1.fragmentF1Plain,
        fragmentF2Key: m1.fragmentF2Key,
        ownerPubkey: m1.ownerPubkey,
      });

      // ===== Transacción 2: comisión 3% a Accesly (INDEPENDIENTE) =====
      if (FEE_WALLET && feeStroops > 0) {
        // Espera a que la 1ª confirme para que el nonce de la Smart Account
        // avance; si no, la 2ª colisiona.
        setNote("Confirmando tu pago… (unos segundos)");
        await sleep(6000);

        // Desbloqueo + firma propios de la 2ª tx (2º biométrico).
        setNote("Confirma la comisión 3% con el biométrico (2 de 2)…");
        const m2 = await wallet.unlockForSigning(email);
        const sendFee = () =>
          tx.send({
            destinationAddress: FEE_WALLET,
            amountStroops: String(feeStroops),
            asset: "XLM",
            // clones: cada intento recibe su propio buffer.
            fragmentF1Plain: new Uint8Array(m2.fragmentF1Plain),
            fragmentF2Key: new Uint8Array(m2.fragmentF2Key),
            ownerPubkey: new Uint8Array(m2.ownerPubkey),
          });

        let feeErr: unknown = null;
        for (let attempt = 1; attempt <= 4; attempt++) {
          setNote(`Enviando comisión 3% a Accesly… (intento ${attempt}/4)`);
          try {
            await sendFee();
            feeErr = null;
            break;
          } catch (e) {
            feeErr = e;
            if (attempt < 4) await sleep(7000);
          }
        }
        if (feeErr) {
          throw new Error(
            `Tu pago principal SÍ se envió, pero la comisión del 3% a Accesly falló: ${feeErr instanceof Error ? feeErr.message : String(feeErr)}`
          );
        }
      }

      setStatus("success");
      onPaid(service);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "No se pudo procesar el pago.");
      setStatus("error");
    } finally {
      setNote("");
    }
  };

  return (
    <Overlay onClose={onClose}>
      <button onClick={onClose} aria-label="Cerrar" style={closeBtn}>✕</button>

      {status === "checking" && (
        <Centered>
          <Spinner />
          <p className="text-sm text-gray-500 mt-3">Preparando tu pago…</p>
        </Centered>
      )}

      {status === "misconfig" && (
        <Centered>
          <div className="text-4xl mb-2">⚙️</div>
          <h3 className="text-xl font-black mb-2">Falta configurar el pago</h3>
          <p className="text-sm text-gray-500">
            Define <code>NEXT_PUBLIC_VIANEY_WALLET</code> y el precio de este servicio en <code>.env.local</code>.
          </p>
        </Centered>
      )}

      {status === "no-wallet" && (
        <Centered>
          <div className="text-4xl mb-2">👛</div>
          <h3 className="text-xl font-black mb-2">Primero crea tu wallet</h3>
          <p className="text-sm text-gray-500 mb-5">Necesitas una cuenta con saldo para pagar {title}.</p>
          <button onClick={() => { onClose(); onNeedWallet(); }} className="btn-rosa w-full text-center">
            Crear mi wallet ✦
          </button>
        </Centered>
      )}

      {(status === "confirm" || status === "signing") && (
        <div style={{ padding: "8px 0" }}>
          <p className="text-[11px] font-mono font-bold uppercase text-center mb-1" style={{ color: "var(--nar)" }}>Confirmar pago</p>
          <h3 className="text-2xl font-black text-center mb-1">{title}</h3>
          <p className="text-center text-4xl font-gabarito font-black my-4" style={{ color: "var(--rosa)" }}>
            {priceXlm} XLM
          </p>
          <div className="rounded-xl px-4 py-3 mb-5 text-sm" style={{ background: "var(--cream2)", border: "2px solid var(--dark)" }}>
            <Row k="Tu saldo" v={balance.isLoading ? "…" : `${balance.xlm ?? "0"} XLM`} />
            {FEE_WALLET && <Row k="Incluye 3% Accesly" v={`${(priceXlm * FEE_BPS / 10000).toFixed(4)} XLM`} />}
          </div>
          <button onClick={pay} disabled={status === "signing"} className="btn-rosa w-full text-center disabled:opacity-60">
            {status === "signing" ? "Procesando…" : `Confirmar pago ✦`}
          </button>
          {status === "signing" && note && (
            <p className="text-xs text-center text-gray-500 mt-2">{note}</p>
          )}
          <button onClick={onClose} disabled={status === "signing"} className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-gray-600 disabled:opacity-40">
            Cancelar
          </button>
        </div>
      )}

      {status === "insufficient" && (
        <Centered>
          <div className="text-4xl mb-2">💸</div>
          <h3 className="text-xl font-black mb-2">Te falta saldo</h3>
          <p className="text-sm text-gray-500 mb-1">
            {title} cuesta <b>{priceXlm} XLM</b> y tienes <b>{balance.xlm ?? "0"} XLM</b>.
          </p>
          <p className="text-sm text-gray-500 mb-5">Si ya recargaste, tu saldo puede tardar unos minutos en reflejarse.</p>
          <button onClick={() => { onClose(); onNeedWallet(); }} className="btn-rosa w-full text-center">
            Recargar saldo
          </button>
        </Centered>
      )}

      {status === "success" && (
        <Centered>
          <div className="text-5xl mb-2">✅</div>
          <h3 className="text-2xl font-black mb-2">¡Pago listo!</h3>
          <p className="text-sm text-gray-500">Tu pago de {title} se envió con éxito.</p>
        </Centered>
      )}

      {status === "error" && (
        <Centered>
          <div className="text-4xl mb-2">⚠️</div>
          <h3 className="text-xl font-black mb-2">No se completó el pago</h3>
          <p className="text-sm text-red-600 mb-5 break-words">{err}</p>
          <button onClick={() => setStatus("confirm")} className="btn-rosa w-full text-center">Reintentar</button>
        </Centered>
      )}
    </Overlay>
  );
}

/* ---------- small presentational helpers ---------- */

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div onClick={(e) => e.stopPropagation()} className="bento" style={{ background: "var(--cream)", width: "min(92vw, 400px)", maxHeight: "88vh", overflowY: "auto", padding: 22, position: "relative" }}>
        {children}
      </div>
    </div>
  );
}

const closeBtn: React.CSSProperties = { position: "absolute", top: 12, right: 14, zIndex: 6, border: "none", background: "transparent", fontSize: 20, cursor: "pointer", color: "var(--dark)", lineHeight: 1 };

function Centered({ children }: { children: React.ReactNode }) {
  return <div style={{ textAlign: "center", padding: "12px 0" }}>{children}</div>;
}

function Spinner() {
  return <div className="w-8 h-8 border-3 border-opportuni-rosa border-t-transparent rounded-full animate-spin mx-auto" />;
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-gray-500">{k}</span>
      <span className="font-bold">{v}</span>
    </div>
  );
}
