"use client";

import { ConnectButton, useAccesly } from "accesly";

export default function Home() {
  const { wallet } = useAccesly();

  return (
    <div style={{ padding: "40px", background: "#fdf6ee", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: "20px" }}>Opportuni - Test</h1>
      
      <div style={{ marginBottom: "20px" }}>
        <ConnectButton />
      </div>
      
      {wallet && (
        <div style={{ padding: "20px", background: "white", borderRadius: "12px" }}>
          <p><strong>Conectado!</strong></p>
          <p>Email: {wallet.email}</p>
          <p>Stellar: {wallet.stellarAddress}</p>
        </div>
      )}
    </div>
  );
}
