const stripTrailingSlash = (s) => (typeof s === 'string' ? s.replace(/\/+$|\/$/g, '').replace(/\/+$/g, '') : s);
export const BACKEND_URL = stripTrailingSlash(process.env.NEXT_PUBLIC_BACKEND_URL) || '';
export const API_URL = BACKEND_URL || stripTrailingSlash(process.env.NEXT_PUBLIC_API_URL) || '/_/backend/api';
