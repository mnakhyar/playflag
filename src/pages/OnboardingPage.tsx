import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { todayLocal } from '../lib/dates'
import { usePlayFlag } from '../store/StoreProvider'

export function OnboardingPage() {
  const { state, dispatch } = usePlayFlag()
  const navigate = useNavigate()
  const [name, setName] = useState('')

  if (state.profile) {
    return <Navigate to="/dashboard" replace />
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim().slice(0, 24)
    if (!trimmed) return
    dispatch({
      type: 'COMPLETE_ONBOARDING',
      displayName: trimmed,
      today: todayLocal(),
    })
    navigate('/dashboard')
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 py-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-turf to-night p-8 ring-1 ring-line/20">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(244,247,242,0.06) 24px, rgba(244,247,242,0.06) 25px)',
          }}
        />
        <p className="relative text-sm uppercase tracking-[0.2em] text-line/80">
          Flag football · IFAF 5v5
        </p>
        <h1 className="relative mt-2 font-display text-6xl leading-none text-chalk">
          PlayFlag
        </h1>
        <p className="relative mt-3 max-w-sm text-base text-line/90">
          Road to 2028 — belajar flag football bertahap: lesson, kuis, drill, lalu
          susun playbook tim.
        </p>

        <form onSubmit={onSubmit} className="relative mt-8 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm text-muted">Nama tampilan</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 24))}
              maxLength={24}
              required
              placeholder="Mis. Raka"
              className="w-full rounded-xl border border-line/20 bg-night/60 px-4 py-3 text-chalk outline-none focus:border-flag"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-xl bg-flag py-3 font-semibold text-night hover:bg-flag-hot"
          >
            Mulai Road to 2028
          </button>
        </form>
      </div>
    </div>
  )
}
