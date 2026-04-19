/**
 * Backend origin (scheme + host, optional port), no trailing slash.
 * Production: set VITE_API_URL in Vercel (your Render API URL).
 */
const fromEnv = import.meta.env.VITE_API_URL
const trimmed =
  typeof fromEnv === 'string' && fromEnv.trim().length > 0
    ? fromEnv.trim().replace(/\/$/, '')
    : ''

export const API =
  trimmed || (import.meta.env.DEV ? 'http://localhost:4000' : '')

/** Join API origin with a path that starts with `/` (may include query string). */
export function apiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${API}${p}`
}
