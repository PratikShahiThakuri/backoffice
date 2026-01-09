// app/admin/layout.tsx

"use client";

import { useEffect, useState } from "react";
import { getOidcManager } from "@/auth/oidc-client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const manager = await getOidcManager();
      const user = await manager.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setReady(true);
    })();
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}
