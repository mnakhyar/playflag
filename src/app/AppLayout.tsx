import { NavLink, Outlet } from 'react-router-dom'
import { usePlayFlag } from '../store/StoreProvider'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex-1 py-3 text-center text-sm font-semibold transition ${
    isActive ? 'text-flag border-t-2 border-flag' : 'text-muted border-t-2 border-transparent'
  }`

export function AppLayout() {
  const { recoveredFromCorruptStorage, persistDisabled, dismissRecoveryBanner } =
    usePlayFlag()

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col">
      {(recoveredFromCorruptStorage || persistDisabled) && (
        <div className="bg-flag/90 px-4 py-2 text-sm text-night">
          {persistDisabled
            ? 'Progres tidak tersimpan (localStorage tidak tersedia).'
            : 'Data demo dipulihkan dari penyimpanan rusak.'}
          {recoveredFromCorruptStorage && (
            <button
              type="button"
              className="ml-2 underline"
              onClick={dismissRecoveryBanner}
            >
              Tutup
            </button>
          )}
        </div>
      )}
      <main className="flex-1 px-4 pb-24 pt-6">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-line/15 bg-night/95 backdrop-blur">
        <div className="mx-auto flex max-w-lg">
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/learn" className={linkClass}>
            Belajar
          </NavLink>
          <NavLink to="/team" className={linkClass}>
            Tim Saya
          </NavLink>
        </div>
      </nav>
    </div>
  )
}
