"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "oidc-client-ts";
import { getOidcManager } from "../auth/oidc-client";

type AuthContextType = {
  user: User | null;
  signIn: () => void;
  signOut: () => void;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const manager = await getOidcManager();

      const currentUser = await manager.getUser();
      if (!mounted) return;

      setUser(currentUser);
      setLoading(false);

      manager.events.addUserLoaded(setUser);
      manager.events.addUserUnloaded(() => setUser(null));
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async () => {
    const manager = await getOidcManager();
    await manager.signinRedirect();
  };

  const signOut = async () => {
    const manager = await getOidcManager();
    await manager.signoutRedirect();
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
