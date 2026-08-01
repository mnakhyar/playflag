import { createInitialState } from '../content/teamDefaults'
import { touchActivity } from './selectors'
import type { PlayFlagAction, PlayFlagState } from './types'

export function playFlagReducer(
  state: PlayFlagState,
  action: PlayFlagAction,
): PlayFlagState {
  switch (action.type) {
    case 'HYDRATE':
      return action.state

    case 'RESET_DEMO':
      return createInitialState()

    case 'COMPLETE_ONBOARDING': {
      const team =
        state.team.roster.length === 5
          ? state.team
          : createInitialState().team
      return {
        ...state,
        profile: {
          displayName: action.displayName.trim().slice(0, 24),
          createdAt: new Date().toISOString(),
          lastActiveDate: action.today,
          streak: 1,
        },
        team,
      }
    }

    case 'SUBMIT_QUIZ':
      return {
        ...state,
        progress: {
          ...state.progress,
          quizScores: {
            ...state.progress.quizScores,
            [action.levelId]: {
              category: action.category,
              scorePercent: action.scorePercent,
            },
          },
        },
      }

    case 'COMPLETE_DRILL': {
      if (!state.profile) return state
      const activity = touchActivity(state.profile, action.today)
      const already = state.progress.completedLevels.includes(action.levelId)
      return {
        ...state,
        profile: { ...state.profile, ...activity },
        progress: {
          ...state.progress,
          completedLevels: already
            ? state.progress.completedLevels
            : [...state.progress.completedLevels, action.levelId],
          drillLogs: [
            ...state.progress.drillLogs,
            {
              levelId: action.levelId,
              targetReps: action.targetReps,
              achievedReps: action.achievedReps,
              durationSec: action.durationSec,
              at: new Date().toISOString(),
            },
          ],
        },
      }
    }

    case 'UPDATE_TEAM_META':
      return {
        ...state,
        team: {
          ...state.team,
          name: action.name ?? state.team.name,
          roster: action.roster ?? state.team.roster,
        },
      }

    case 'UPSERT_PLAY': {
      if (!state.profile) {
        return {
          ...state,
          team: {
            ...state.team,
            plays: upsertPlay(state.team.plays, action.play),
          },
        }
      }
      const activity = touchActivity(state.profile, action.today)
      return {
        ...state,
        profile: { ...state.profile, ...activity },
        team: {
          ...state.team,
          plays: upsertPlay(state.team.plays, action.play),
        },
      }
    }

    default:
      return state
  }
}

function upsertPlay(
  plays: PlayFlagState['team']['plays'],
  play: PlayFlagState['team']['plays'][number],
) {
  const idx = plays.findIndex((p) => p.id === play.id)
  if (idx === -1) return [...plays, play]
  const next = plays.slice()
  next[idx] = play
  return next
}
