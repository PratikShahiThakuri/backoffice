import { UserManager, WebStorageStateStore } from "oidc-client-ts";
import { AUTH } from "../utils/urlHelper";
import { isLocalRoot, isPreprodRoot, isProdRoot, host } from "../utils/hosts";

export const createOidcManager = () => {
  if (typeof window === "undefined") return null;

  const isPreprodTenant = host.endsWith(".preprod.reactiveform.com") && !isPreprodRoot;
  const isProdTenant = host.endsWith(".reactiveform.com") && !isProdRoot;
  const isLocal = host.endsWith(".localhost") && !isLocalRoot;

  const parts = host.split(".");
  const isTenantHost = isPreprodTenant || isProdTenant || isLocal;
  const CLIENT_ID = isTenantHost ? "rf-office" : "rf-backoffice";

  return new UserManager({
    authority: AUTH,
    client_id: CLIENT_ID,
    redirect_uri: AUTH + "/connect/authorize/callback",
    post_logout_redirect_uri: AUTH + "/connect/logout/callback",
    response_type: "code",
    scope: "openid profile email api",
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    stateStore: new WebStorageStateStore({ store: window.localStorage }),
    loadUserInfo: false,
  });
};
