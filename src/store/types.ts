export type SkillCategory = 'Rules' | 'Movement' | 'Strategy'

export type PlayerChip = {
  id: string
  x: number
  y: number
}

export type Route = {
  id: string
  fromPlayerId: string
  to: { x: number; y: number }
}

export type Play = {
  id: string
  name: string
  notes: string
  players: PlayerChip[]
  routes: Route[]
}

export type RosterPlayer = {
  id: string
  name: string
}

export type Profile = {
  displayName: string
  createdAt: string
  lastActiveDate: string
  streak: number
}

export type PlayFlagState = {
  profile: Profile | null
  progress: {
    completedLevels: number[]
    quizScores: Record<
      number,
      { category: SkillCategory; scorePercent: number }
    >
    drillLogs: Array<{
      levelId: number
      targetReps: number
      achievedReps: number
      durationSec: number
      at: string
    }>
  }
  team: {
    name: string
    roster: RosterPlayer[]
    plays: Play[]
  }
}

export type PlayFlagAction =
  | { type: 'COMPLETE_ONBOARDING'; displayName: string; today: string }
  | {
      type: 'SUBMIT_QUIZ'
      levelId: number
      category: SkillCategory
      scorePercent: number
    }
  | {
      type: 'COMPLETE_DRILL'
      levelId: number
      targetReps: number
      achievedReps: number
      durationSec: number
      today: string
    }
  | {
      type: 'UPDATE_TEAM_META'
      name?: string
      roster?: RosterPlayer[]
    }
  | { type: 'UPSERT_PLAY'; play: Play; today: string }
  | { type: 'RESET_DEMO' }
  | { type: 'HYDRATE'; state: PlayFlagState }
