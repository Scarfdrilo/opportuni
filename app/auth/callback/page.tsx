"use client";

import { AuthCallback } from "@accesly/react/kit";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  return (
    <AuthCallback
      onSuccess={() => router.push("/")}
      onError={() => router.push("/?error=auth")}
    />
  );
}
