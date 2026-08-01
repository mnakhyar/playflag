import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { todayLocal } from '../lib/dates'
import { usePlayFlag } from '../store/StoreProvider'

export function OnboardingPage() {
  const { state, dispatch } = usePlayFlag()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  if (state.profile) {
    return <Navigate to="/dashboard" replace />
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim().slice(0, 24)
    if (!trimmed) {
      setError('Isi nama tampilan dulu.')
      return
    }
    setError('')
    dispatch({
      type: 'COMPLETE_ONBOARDING',
      displayName: trimmed,
      today: todayLocal(),
    })
    navigate('/dashboard')
  }

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-lg flex-col px-5 pb-12 pt-16">
      <div className="relative flex flex-1 flex-col justify-between gap-16">
        <header className="stagger-in max-w-[20ch] space-y-5">
          <span className="eyebrow">IFAF 5v5 · 2028</span>
          <h1 className="font-display text-6xl font-extrabold leading-[0.92] tracking-tight text-chalk sm:text-7xl">
            PlayFlag
          </h1>
          <p className="max-w-[28ch] text-[17px] font-normal leading-relaxed text-line">
            Belajar flag football langkah demi langkah. Lihat progresmu, lalu susun playbook tim.
          </p>
        </header>

        <form
          onSubmit={onSubmit}
          className="stagger-in relative space-y-5"
          style={{ animationDelay: '90ms' }}
        >
          <label className="block space-y-2">
            <span className="text-[13px] font-medium text-muted">Nama tampilan</span>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value.slice(0, 24))
                if (error) setError('')
              }}
              maxLength={24}
              required
              placeholder="Contoh: Raka"
              autoComplete="nickname"
              className="field-input"
              aria-invalid={Boolean(error)}
            />
            <span className="block text-xs text-muted">Maksimal 24 karakter.</span>
            {error && (
              <span className="block text-sm text-red-300" role="alert">
                {error}
              </span>
            )}
          </label>
          <button type="submit" className="btn-primary group">
            <span>Masuk ke jalur belajar</span>
            <span
              className="flex h-7 w-7 items-center justify-center rounded-md bg-black/10 text-sm transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5"
              aria-hidden
            >
              →
            </span>
          </button>
        </form>
      </div>
    </div>
  )
}
