import { useEffect, useRef, useState } from 'react'

// Debounced instead of saving on every keystroke — typing a description
// would otherwise fire a network request per character. Waits `delay` ms
// after the last change before persisting. `skip` should be true while the
// initial fetch is still loading, so that fetch doesn't itself trigger a
// save the instant it resolves.
export function useAutoSave(saveFn, value, { delay = 800, skip = false } = {}) {
  const [status, setStatus] = useState('idle') // idle | saving | saved | error
  const timerRef = useRef(null)
  const skippedFirst = useRef(false)
  const serialized = JSON.stringify(value)

  useEffect(() => {
    if (skip) return
    if (!skippedFirst.current) {
      // Don't save the instant the initial fetch populates state.
      skippedFirst.current = true
      return
    }

    setStatus('idle')
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setStatus('saving')
      try {
        await saveFn(JSON.parse(serialized))
        setStatus('saved')
      } catch {
        setStatus('error')
      }
    }, delay)

    return () => clearTimeout(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized, skip])

  return status
}
