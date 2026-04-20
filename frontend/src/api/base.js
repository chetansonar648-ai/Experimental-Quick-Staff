import { getApiBaseUrl } from './axios.js'

/**
 * Backend origin (no /api suffix) for legacy fetch(`${API}/workers`) admin routes.
 */
const apiBase = getApiBaseUrl()
export const API =
  (apiBase ? apiBase.replace(/\/api$/, '') : '') ||
  (import.meta.env.DEV ? 'http://localhost:4000' : '')

/** Join API origin with a path that starts with `/` (may include query string). */
export function apiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${API}${p}`
}
