"use client";

import { AcceslyProvider } from "@accesly/react";
import { IndexedDbDeviceStore } from "@accesly/core";
import { useMemo } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  // IndexedDbDeviceStore throws in its constructor when `indexedDB` is missing
  // (i.e. during Next.js SSR). Build it only in the browser; on the server we
  // pass no override and AcceslyProvider falls back to its InMemoryDeviceStore.
  const deviceStore = useMemo(
    () => (typeof indexedDB !== "undefined" ? new IndexedDbDeviceStore() : undefined),
    []
  );

  return (
    <AcceslyProvider
      // NOTE: the docs say env="prod", but this app's config is served from the
      // `dev` environment API (api.accesly.xyz / staging don't resolve yet). The
      // app itself is flagged environment:"prod" server-side — only the SDK's
      // env→apiUrl mapping needs to point at the live backend.
      // Trim the env value: a stray trailing newline in NEXT_PUBLIC_ACCESLY_APP_ID
      // gets URL-encoded (%0A) into the app-config request and 404s the whole app.
      appId={(process.env.NEXT_PUBLIC_ACCESLY_APP_ID ?? "app_p_opportuni_7p8cf").trim()}
      env="dev"
      authCallbackPath="/auth/callback"
      overrides={deviceStore ? { deviceStore } : undefined}
    >
      {children}
    </AcceslyProvider>
  );
}
