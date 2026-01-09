const LOGOUT_KEY = 'rf:loggedOut';

export const setLoggedOutFlag = () => {
  localStorage.setItem(LOGOUT_KEY, 'true');
};

export const clearLoggedOutFlag = () => {
  localStorage.removeItem(LOGOUT_KEY);
};

export const isLoggedOut = () => {
  return localStorage.getItem(LOGOUT_KEY) === 'true';
};