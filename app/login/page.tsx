"use client";

import dynamic from "next/dynamic";

// Dynamically import AuthProvider safely
const AuthProvider = dynamic(() => import("../../contexts/AuthProvider").then(mod => mod.default), {
  ssr: false,
});

// Dynamically import Button correctly
const LoginButton = dynamic(() => import("../../components/Button").then(mod => mod.default), {
  ssr: false,
});

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginUI />
    </AuthProvider>
  );
}

function LoginUI() {
  const handleLogin = async () => {
    const { getOidcManager } = await import("../../auth/oidc-client");
    const oidc = await getOidcManager();
    await oidc.signinRedirect();
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginButton onClick={handleLogin}>Sign In via OIDC</LoginButton>
    </div>
  );
}
