export type SkillCategory = 'Rules' | 'Movement' | 'Strategy'

export type SkillMastery = 'unseen' | 'learning' | 'done'

export type PlaySide = 'offense' | 'defense'

export type PlayerChip = {
  id: string
  side: PlaySide
  x: number
  y: number
  /** Defense labels e.g. "D1"… "D5" */
  label?: string
}

export type Route = {
  id: string
  fromPlayerId: string
  /** Field waypoints after the player chip (1–5) */
  points: Array<{ x: number; y: number }>
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
    /** @deprecated migrated to skillMastery; kept for legacy reads */
    completedLevels: number[]
    skillMastery: Record<string, SkillMastery>
    quizScores: Record<
      string,
      { category: SkillCategory; scorePercent: number }
    >
    drillLogs: Array<{
      skillId: string
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
      skillId: string
      category: SkillCategory
      scorePercent: number
    }
  | {
      type: 'COMPLETE_DRILL'
      skillId: string
      targetReps: number
      achievedReps: number
      durationSec: number
      today: string
    }
  | {
      type: 'SET_SKILL_MASTERY'
      skillId: string
      mastery: SkillMastery
    }
  | {
      type: 'UPDATE_TEAM_META'
      name?: string
      roster?: RosterPlayer[]
    }
  | { type: 'UPSERT_PLAY'; play: Play; today: string }
  | { type: 'RESET_DEMO' }
  | { type: 'HYDRATE'; state: PlayFlagState }
