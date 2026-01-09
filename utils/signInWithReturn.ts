import { getOidcManager } from "../auth/oidc-client";
import { setReturnUrl } from "./returnUrl";


export const signInWithReturn = async (returnUrl?: string) => {
  const oidc = await getOidcManager();
  if (returnUrl) setReturnUrl(returnUrl);
  await oidc.signinRedirect();
};