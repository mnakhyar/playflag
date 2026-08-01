import { Link } from 'react-router-dom'
import { createEmptyPlay } from '../content/teamDefaults'
import { todayLocal } from '../lib/dates'
import { usePlayFlag } from '../store/StoreProvider'

export function TeamPage() {
  const { state, dispatch } = usePlayFlag()
  const { team } = state

  const updateRosterName = (id: string, name: string) => {
    dispatch({
      type: 'UPDATE_TEAM_META',
      roster: team.roster.map((r) => (r.id === id ? { ...r, name } : r)),
    })
  }

  const addPlay = () => {
    const play = createEmptyPlay(`Play ${team.plays.length + 1}`)
    dispatch({ type: 'UPSERT_PLAY', play, today: todayLocal() })
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-4xl text-chalk">Tim Saya</h1>
        <p className="text-line/80">Roster 5 + playbook ringan</p>
      </header>

      <section className="space-y-3 rounded-3xl bg-turf/25 p-4 ring-1 ring-line/15">
        <label className="block">
          <span className="mb-1 block text-sm text-muted">Nama tim</span>
          <input
            value={team.name}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_TEAM_META', name: e.target.value })
            }
            className="w-full rounded-xl border border-line/20 bg-night/50 px-3 py-2 outline-none focus:border-flag"
          />
        </label>
        <div className="space-y-2">
          <p className="text-sm text-muted">Roster (5)</p>
          {team.roster.map((p, i) => (
            <input
              key={p.id}
              value={p.name}
              onChange={(e) => updateRosterName(p.id, e.target.value)}
              className="w-full rounded-xl border border-line/15 bg-night/40 px-3 py-2 text-sm outline-none focus:border-flag"
              aria-label={`Pemain ${i + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Playbook</h2>
          <button
            type="button"
            onClick={addPlay}
            className="rounded-xl bg-flag px-3 py-1.5 text-sm font-semibold text-night"
          >
            Buat play baru
          </button>
        </div>
        <ul className="space-y-2">
          {team.plays.map((play) => (
            <li key={play.id}>
              <Link
                to={`/team/plays/${play.id}`}
                className="flex items-center justify-between rounded-2xl bg-night/40 px-4 py-3 ring-1 ring-line/15"
              >
                <span>
                  <span className="block font-medium">{play.name}</span>
                  <span className="text-xs text-muted">
                    {play.routes.length} rute · edit posisi & rute
                  </span>
                </span>
                <span className="text-flag">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
