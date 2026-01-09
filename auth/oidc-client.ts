import { UserManager, WebStorageStateStore } from "oidc-client-ts";
import { AUTH } from "../utils/urlHelper";

let manager: UserManager | null = null;

export async function getOidcManager(): Promise<UserManager> {
  if (manager) return manager;

  if (typeof window === "undefined") {
    // Server cannot create OIDC manager
    throw new Error("OIDC manager requested on server");
  }

  // All browser-dependent code must be inside this block
  const host = window.location.host;

  const isPreprodTenant = host.endsWith(".preprod.reactiveform.com");
  const isProdTenant = host.endsWith(".reactiveform.com");
  const isLocal = host.endsWith(".localhost");

  const isTenantHost = isPreprodTenant || isProdTenant || isLocal;

  const CLIENT_ID = isTenantHost ? "rf-office" : "rf-backoffice";

  manager = new UserManager({
    authority: AUTH,
    client_id: CLIENT_ID,
    redirect_uri: `${AUTH}/connect/authorize/callback`,
    post_logout_redirect_uri: `${AUTH}/connect/logout/callback`,
    response_type: "code",
    scope: "openid profile email api",
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    stateStore: new WebStorageStateStore({ store: window.localStorage }),
    loadUserInfo: false,
  });

  return manager;
}
