import { Link, useNavigate } from 'react-router-dom'
import { createEmptyPlay } from '../content/teamDefaults'
import { todayLocal } from '../lib/dates'
import { usePlayFlag } from '../store/StoreProvider'

export function TeamPage() {
  const { state, dispatch } = usePlayFlag()
  const navigate = useNavigate()
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
    navigate(`/team/plays/${play.id}`)
  }

  return (
    <div className="space-y-10">
      <header className="stagger-in space-y-3">
        <span className="eyebrow">Playbook</span>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-chalk">
          Tim Saya
        </h1>
        <p className="max-w-[34ch] text-[15px] leading-relaxed text-line">
          Atur nama tim, lima slot roster, dan play yang bisa kamu gambar di field.
        </p>
      </header>

      <section className="stagger-in space-y-5" style={{ animationDelay: '60ms' }}>
        <label className="block space-y-2">
          <span className="text-[13px] font-medium text-muted">Nama tim</span>
          <input
            value={team.name}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_TEAM_META', name: e.target.value })
            }
            className="field-input"
          />
        </label>
        <div className="space-y-2">
          <p className="text-[13px] font-medium text-muted">Roster (5 pemain)</p>
          {team.roster.map((p, i) => (
            <input
              key={p.id}
              value={p.name}
              onChange={(e) => updateRosterName(p.id, e.target.value)}
              className="field-input text-sm"
              aria-label={`Pemain ${i + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="stagger-in space-y-4" style={{ animationDelay: '120ms' }}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-bold tracking-tight">Plays</h2>
          <button type="button" onClick={addPlay} className="btn-accent pressable">
            Buat play baru
          </button>
        </div>
        {team.plays.length === 0 ? (
          <p className="text-sm text-muted">
            Belum ada play. Buat yang pertama untuk membuka editor.
          </p>
        ) : (
          <ul className="divide-y divide-[rgba(84,84,88,0.55)]">
            {team.plays.map((play) => (
              <li key={play.id}>
                <Link
                  to={`/team/plays/${play.id}`}
                  className="pressable flex min-h-14 items-center justify-between py-3.5 transition-colors hover:bg-white/[0.02]"
                >
                  <span>
                    <span className="block font-semibold tracking-tight">{play.name}</span>
                    <span className="text-xs tabular-nums text-muted">
                      {play.routes.length} rute · edit posisi dan rute
                    </span>
                  </span>
                  <span className="text-line" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
