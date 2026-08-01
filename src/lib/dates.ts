export function todayLocal(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Returns difference in calendar days: later - earlier. */
export function daysBetween(earlier: string, later: string): number {
  const a = new Date(earlier + 'T00:00:00')
  const b = new Date(later + 'T00:00:00')
  return Math.round((b.getTime() - a.getTime()) / 86_400_000)
}
