import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { usePlayFlag } from '../store/StoreProvider'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-11 flex-1 items-center justify-center rounded-[0.625rem] px-2 text-center text-[13px] font-semibold tracking-tight transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] ${
    isActive ? 'bg-surface text-chalk' : 'text-muted hover:text-line'
  }`

function isFocusedRoute(pathname: string): boolean {
  if (/^\/learn\/[^/]+\/(lesson|quiz|drill)\/?$/.test(pathname)) return true
  if (/^\/team\/plays\//.test(pathname)) return true
  return false
}

export function AppLayout() {
  const { recoveredFromCorruptStorage, persistDisabled, dismissRecoveryBanner } =
    usePlayFlag()
  const { pathname } = useLocation()
  const focused = isFocusedRoute(pathname)

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col">
      {(recoveredFromCorruptStorage || persistDisabled) && (
        <div className="bg-turf px-4 py-3 text-sm text-line shadow-[inset_0_-0.5px_0_rgba(84,84,88,0.55)]">
          {persistDisabled
            ? 'Progres tidak bisa disimpan di perangkat ini.'
            : 'Data demo dipulihkan. Mulai ulang dari state bersih.'}
          {recoveredFromCorruptStorage && (
            <button
              type="button"
              className="ml-2 min-h-10 font-medium text-flag underline"
              onClick={dismissRecoveryBanner}
            >
              Tutup
            </button>
          )}
        </div>
      )}
      <main
        className={`flex-1 px-5 pt-8 ${focused ? 'pb-10' : 'pb-[calc(6.5rem+env(safe-area-inset-bottom))]'}`}
      >
        <Outlet />
      </main>
      {!focused && (
        <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-10 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <div className="pointer-events-auto mx-auto max-w-lg rounded-2xl bg-black/55 p-1.5 shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.1),0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl backdrop-saturate-150">
            <div className="flex gap-1">
              <NavLink to="/dashboard" className={linkClass}>
                Beranda
              </NavLink>
              <NavLink to="/learn" className={linkClass}>
                Belajar
              </NavLink>
              <NavLink to="/team" className={linkClass}>
                Tim
              </NavLink>
            </div>
          </div>
        </nav>
      )}
    </div>
  )
}
