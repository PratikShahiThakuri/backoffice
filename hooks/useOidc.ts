"use client";

import { useEffect, useState } from "react";
import { UserManager } from "oidc-client-ts";
import { getOidcManager } from "../auth/oidc-client";

export function useOidc(): UserManager | null {
  const [manager, setManager] = useState<UserManager | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const mgr = await getOidcManager();
      if (mounted) setManager(mgr);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return manager;
}
