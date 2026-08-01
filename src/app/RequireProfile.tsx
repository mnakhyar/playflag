import { Navigate, Outlet } from 'react-router-dom'
import { usePlayFlag } from '../store/StoreProvider'

export function RequireProfile() {
  const { state } = usePlayFlag()
  if (!state.profile) return <Navigate to="/" replace />
  return <Outlet />
}
