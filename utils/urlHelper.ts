export const AUTH = "https://localhost:7218"; // Placeholder for production IdP
export const buildBase = (origin: string) => {
    return origin.endsWith('/') ? origin : origin + '/';
};