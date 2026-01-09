const STORAGE_KEY = 'rf:returnUrl';

export const currentReturnUrl = () => {
  return localStorage.getItem(STORAGE_KEY) || window.location.href;
};

export const setReturnUrl = (url: string) => {
  localStorage.setItem(STORAGE_KEY, url);
};

export const clearReturnUrl = () => {
  localStorage.removeItem(STORAGE_KEY);
};