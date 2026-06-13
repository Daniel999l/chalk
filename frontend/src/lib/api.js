// Empty in production (same-origin Vercel deploy).
// Set to http://localhost:3001 in frontend/.env for local dev.
const BASE = import.meta.env.VITE_API_URL || ''

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (!res.ok && res.status !== 404) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    const e = new Error(err.error || 'API error')
    e.status = res.status
    throw e
  }
  return res.json().catch(() => null)
}

export const api = {
  get:    (path)       => request('GET',    path),
  post:   (path, body) => request('POST',   path, body),
  put:    (path, body) => request('PUT',    path, body),
  delete: (path)       => request('DELETE', path),
}

export const API_URL = BASE
