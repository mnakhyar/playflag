import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { FlowBackLink } from '../components/FlowBackLink'
import { PlayCanvas } from '../components/PlayCanvas'
import { todayLocal } from '../lib/dates'
import { usePlayFlag } from '../store/StoreProvider'
import type { Play } from '../store/types'

export function PlayEditorPage() {
  const { playId } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = usePlayFlag()
  const play = state.team.plays.find((p) => p.id === playId)

  const [mode, setMode] = useState<'position' | 'route'>('position')
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null)
  const [routeDraftFrom, setRouteDraftFrom] = useState<string | null>(null)
  const [savedNote, setSavedNote] = useState(false)

  const save = (next: Play) => {
    dispatch({ type: 'UPSERT_PLAY', play: next, today: todayLocal() })
    setSavedNote(true)
  }

  const rosterNames = useMemo(
    () => Object.fromEntries(state.team.roster.map((r) => [r.id, r.name])),
    [state.team.roster],
  )

  if (!play) return <Navigate to="/team" replace />

  return (
    <div className="space-y-5 pb-28">
      <div className="flex items-center justify-between gap-3">
        <FlowBackLink to="/team">Tim Saya</FlowBackLink>
        <div className="flex min-h-10 rounded-[var(--radius-control)] bg-turf p-1">
          <button
            type="button"
            onClick={() => {
              setMode('position')
              setRouteDraftFrom(null)
            }}
            className={`min-h-9 rounded-[calc(var(--radius-control)-0.15rem)] px-4 text-sm font-semibold transition-colors ${
              mode === 'position' ? 'bg-surface text-chalk' : 'text-muted'
            }`}
          >
            Posisi
          </button>
          <button
            type="button"
            onClick={() => setMode('route')}
            className={`min-h-9 rounded-[calc(var(--radius-control)-0.15rem)] px-4 text-sm font-semibold transition-colors ${
              mode === 'route' ? 'bg-surface text-chalk' : 'text-muted'
            }`}
          >
            Rute
          </button>
        </div>
      </div>

      <input
        value={play.name}
        onChange={(e) => save({ ...play, name: e.target.value })}
        className="field-input font-display text-2xl font-bold tracking-tight"
        aria-label="Nama play"
      />
      <textarea
        value={play.notes}
        onChange={(e) => save({ ...play, notes: e.target.value })}
        rows={2}
        placeholder="Catatan singkat untuk tim"
        className="field-input min-h-[4.5rem] resize-none text-sm"
      />

      {mode === 'route' && (
        <p className="text-xs leading-relaxed text-pretty text-muted">
          {routeDraftFrom
            ? `Sumber: ${rosterNames[routeDraftFrom] ?? routeDraftFrom}. Ketuk titik tujuan di field.`
            : 'Ketuk pemain sumber, lalu ketuk titik tujuan di field.'}
        </p>
      )}

      <div className="bezel">
        <div className="bezel-inner overflow-hidden">
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
        </div>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold tracking-tight text-line">Daftar rute</h2>
        {play.routes.length === 0 ? (
          <p className="text-sm text-muted">
            Belum ada rute. Aktifkan mode Rute untuk menambah.
          </p>
        ) : (
          <ul className="divide-y divide-[rgba(84,84,88,0.55)]">
            {play.routes.map((r, i) => (
              <li
                key={r.id}
                className={`flex min-h-12 items-center justify-between gap-2 py-2 ${
                  selectedRouteId === r.id ? 'text-flag' : ''
                }`}
              >
                <button
                  type="button"
                  className="min-h-10 flex-1 text-left text-sm"
                  onClick={() => setSelectedRouteId(r.id)}
                >
                  Rute {i + 1}: {rosterNames[r.fromPlayerId] ?? r.fromPlayerId}
                </button>
                <button
                  type="button"
                  className="min-h-10 px-2 text-xs font-medium text-flag underline underline-offset-2"
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
        )}
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="pointer-events-auto mx-auto max-w-lg space-y-2 rounded-2xl bg-black/55 p-3 shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.1)] backdrop-blur-xl">
          {savedNote && (
            <p className="text-center text-xs text-muted">Perubahan sudah disimpan.</p>
          )}
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate('/team')}
          >
            Selesai dan kembali
          </button>
        </div>
      </div>
    </div>
  )
}
