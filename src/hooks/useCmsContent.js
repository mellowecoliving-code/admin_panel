import { useEffect, useState } from 'react'
import { getAllSections } from '../api/cms'

// Stale-while-revalidate: the last successful fetch is kept in localStorage
// so a returning visitor's first paint already has the real logo/branding
// (no flash of the fallback icon while the network request is in flight) —
// this still re-fetches every load, it just doesn't make the visitor wait.
const CACHE_KEY = 'mellow_admin_cms_cache'

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    // Storage full or unavailable (private browsing) — fine to skip caching.
  }
}

// Every consumer (sidebar, login screen, CMS editor) calling this
// independently would fire duplicate requests on first paint — cache the
// one shared fetch at module scope so they all get the same promise/data.
let cachePromise = null

function loadCmsContent() {
  if (!cachePromise) {
    cachePromise = getAllSections()
      .then((data) => {
        writeCache(data)
        return data
      })
      .catch(() => readCache() || {})
  }
  return cachePromise
}

// Returns { [section]: data | null } — components fall back to their own
// defaults whenever a section (or the whole fetch) isn't present.
export function useCmsContent() {
  const [content, setContent] = useState(() => readCache())

  useEffect(() => {
    let cancelled = false
    loadCmsContent().then((data) => {
      if (!cancelled) setContent(data)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return content || {}
}
