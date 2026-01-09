// app/callback/page.tsx

"use client"; // must be first line

import { useEffect } from "react";

export default function CallbackPage() {
  useEffect(() => {
    (async () => {
      try {
        // Import dynamically, only in browser
        const { getOidcManager } = await import("../../auth/oidc-client");
        const oidc = await getOidcManager();

        await oidc.signinRedirectCallback();
        window.location.href = "/admin/dashboard"; // redirect after login
      } catch (err) {
        console.error("OIDC callback error:", err);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Logging in...
    </div>
  );
}
