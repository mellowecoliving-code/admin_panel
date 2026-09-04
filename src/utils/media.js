const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const SERVER_ORIGIN = API_URL.replace(/\/api\/?$/, '')

// Upload endpoint returns a relative path like "/uploads/xyz.png" (server
// and admin app run on different origins/ports), so this resolves it to a
// fully-qualified URL the <img>/<video> tag can actually load.
export function resolveMediaUrl(url) {
  if (!url) return url
  if (/^https?:\/\//.test(url)) return url
  return `${SERVER_ORIGIN}${url}`
}
