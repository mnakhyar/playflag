import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { PlayCanvas } from '../components/PlayCanvas'
import { todayLocal } from '../lib/dates'
import { usePlayFlag } from '../store/StoreProvider'
import type { Play } from '../store/types'

export function PlayEditorPage() {
  const { playId } = useParams()
  const { state, dispatch } = usePlayFlag()
  const play = state.team.plays.find((p) => p.id === playId)

  const [mode, setMode] = useState<'position' | 'route'>('position')
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null)
  const [routeDraftFrom, setRouteDraftFrom] = useState<string | null>(null)

  const save = (next: Play) => {
    dispatch({ type: 'UPSERT_PLAY', play: next, today: todayLocal() })
  }

  const rosterNames = useMemo(
    () => Object.fromEntries(state.team.roster.map((r) => [r.id, r.name])),
    [state.team.roster],
  )

  if (!play) return <Navigate to="/team" replace />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Link to="/team" className="text-sm text-muted underline">
          ← Tim Saya
        </Link>
        <div className="flex rounded-xl bg-night/50 p-1 ring-1 ring-line/15">
          <button
            type="button"
            onClick={() => {
              setMode('position')
              setRouteDraftFrom(null)
            }}
            className={`rounded-lg px-3 py-1 text-sm font-semibold ${
              mode === 'position' ? 'bg-flag text-night' : 'text-muted'
            }`}
          >
            Posisi
          </button>
          <button
            type="button"
            onClick={() => setMode('route')}
            className={`rounded-lg px-3 py-1 text-sm font-semibold ${
              mode === 'route' ? 'bg-flag text-night' : 'text-muted'
            }`}
          >
            Rute
          </button>
        </div>
      </div>

      <input
        value={play.name}
        onChange={(e) => save({ ...play, name: e.target.value })}
        className="w-full rounded-xl border border-line/20 bg-night/50 px-3 py-2 font-display text-2xl outline-none focus:border-flag"
      />
      <textarea
        value={play.notes}
        onChange={(e) => save({ ...play, notes: e.target.value })}
        rows={2}
        placeholder="Catatan singkat"
        className="w-full rounded-xl border border-line/15 bg-night/40 px-3 py-2 text-sm outline-none focus:border-flag"
      />

      {mode === 'route' && (
        <p className="text-xs text-muted">
          {routeDraftFrom
            ? `Sumber: ${rosterNames[routeDraftFrom] ?? routeDraftFrom} — tap titik tujuan di field`
            : 'Tap pemain sumber, lalu tap titik tujuan di field'}
        </p>
      )}

      <PlayCanvas
        play={play}
        roster={state.team.roster}
        mode={mode}
        onChange={save}
        selectedRouteId={selectedRouteId}
        onSelectRoute={setSelectedRouteId}
        routeDraftFrom={routeDraftFrom}
        onRouteDraftFrom={setRouteDraftFrom}
      />

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-line">Rute</h2>
        {play.routes.length === 0 && (
          <p className="text-sm text-muted">Belum ada rute. Gunakan mode Rute.</p>
        )}
        <ul className="space-y-2">
          {play.routes.map((r) => (
            <li
              key={r.id}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ring-1 ${
                selectedRouteId === r.id ? 'ring-flag bg-flag/10' : 'ring-line/15 bg-night/30'
              }`}
            >
              <button
                type="button"
                className="text-left"
                onClick={() => setSelectedRouteId(r.id)}
              >
                {rosterNames[r.fromPlayerId] ?? r.fromPlayerId} → (
                {r.to.x.toFixed(2)}, {r.to.y.toFixed(2)})
              </button>
              <button
                type="button"
                className="text-xs text-flag underline"
                onClick={() =>
                  save({
                    ...play,
                    routes: play.routes.filter((x) => x.id !== r.id),
                  })
                }
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
