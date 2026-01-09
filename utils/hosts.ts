export const host = window.location.hostname;
export const isLocalRoot = host === 'localhost' || host === '127.0.0.1';
export const isPreprodRoot = host === 'preprod.reactiveform.com';
export const isProdRoot = host === 'reactiveform.com';