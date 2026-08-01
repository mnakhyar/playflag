import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react'
import { loadState, saveState } from './persist'
import { playFlagReducer } from './reducer'
import type { PlayFlagAction, PlayFlagState } from './types'

type StoreValue = {
  state: PlayFlagState
  dispatch: (action: PlayFlagAction) => void
  recoveredFromCorruptStorage: boolean
  persistDisabled: boolean
  dismissRecoveryBanner: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function PlayFlagProvider({ children }: { children: ReactNode }) {
  const loaded = useMemo(() => loadState(), [])
  const [state, rawDispatch] = useReducer(playFlagReducer, loaded.state)
  const [recovered, setRecovered] = useState(loaded.recoveredFromCorruptStorage)
  const [persistDisabled, setPersistDisabled] = useState(loaded.persistDisabled)

  const dispatch = useCallback((action: PlayFlagAction) => {
    rawDispatch(action)
  }, [])

  useEffect(() => {
    const ok = saveState(state)
    if (!ok) setPersistDisabled(true)
  }, [state])

  const value = useMemo(
    () => ({
      state,
      dispatch,
      recoveredFromCorruptStorage: recovered,
      persistDisabled,
      dismissRecoveryBanner: () => setRecovered(false),
    }),
    [state, dispatch, recovered, persistDisabled],
  )

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  )
}

export function usePlayFlag() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('usePlayFlag must be used within PlayFlagProvider')
  return ctx
}
