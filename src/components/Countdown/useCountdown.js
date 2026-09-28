import { useEffect, useState } from 'react'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

function remaining(targetMs) {
  const diff = Math.max(0, targetMs - Date.now())
  return {
    done: diff === 0,
    days: Math.floor(diff / DAY),
    hours: Math.floor((diff % DAY) / HOUR),
    minutes: Math.floor((diff % HOUR) / MINUTE),
    seconds: Math.floor((diff % MINUTE) / SECOND),
  }
}

/**
 * Live time left until `target` (Date or ISO string with offset).
 * Recomputed from the clock on every tick, so it stays exact even if the
 * phone sleeps or the tab is in the background.
 */
export function useCountdown(target) {
  const targetMs = new Date(target).getTime()
  const [time, setTime] = useState(() => remaining(targetMs))

  useEffect(() => {
    let timer
    const tick = () => {
      const next = remaining(targetMs)
      setTime(next)
      // Align ticks on the next full second.
      if (!next.done) timer = setTimeout(tick, SECOND - (Date.now() % SECOND) + 10)
    }
    tick()
    return () => clearTimeout(timer)
  }, [targetMs])

  return time
}
