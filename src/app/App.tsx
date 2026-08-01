import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { LEGACY_LEVEL_TO_SKILL } from '../content/skillTree'
import { PlayFlagProvider } from '../store/StoreProvider'
import { AppLayout } from './AppLayout'
import { RequireProfile } from './RequireProfile'
import { BranchPage } from '../pages/BranchPage'
import { DashboardPage } from '../pages/DashboardPage'
import { DrillPage } from '../pages/DrillPage'
import { LearnTreePage } from '../pages/LearnTreePage'
import { LessonPage } from '../pages/LessonPage'
import { OnboardingPage } from '../pages/OnboardingPage'
import { PlayEditorPage } from '../pages/PlayEditorPage'
import { PositionPage } from '../pages/PositionPage'
import { QuizPage } from '../pages/QuizPage'
import { SkillDetailPage } from '../pages/SkillDetailPage'
import { TeamPage } from '../pages/TeamPage'

function LearnStepGate({ step }: { step: 'lesson' | 'quiz' | 'drill' }) {
  const { skillId } = useParams()
  if (skillId && /^\d+$/.test(skillId)) {
    const mapped = LEGACY_LEVEL_TO_SKILL[Number(skillId)]
    if (!mapped) return <Navigate to="/learn" replace />
    return <Navigate to={`/learn/${mapped}/${step}`} replace />
  }
  if (step === 'lesson') return <LessonPage />
  if (step === 'quiz') return <QuizPage />
  return <DrillPage />
}

export function App() {
  return (
    <PlayFlagProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<OnboardingPage />} />
          <Route element={<RequireProfile />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/learn" element={<LearnTreePage />} />
              <Route path="/learn/branch/:branchId" element={<BranchPage />} />
              <Route path="/learn/position/:positionId" element={<PositionPage />} />
              <Route path="/learn/skill/:skillId" element={<SkillDetailPage />} />
              <Route
                path="/learn/:skillId/lesson"
                element={<LearnStepGate step="lesson" />}
              />
              <Route
                path="/learn/:skillId/quiz"
                element={<LearnStepGate step="quiz" />}
              />
              <Route
                path="/learn/:skillId/drill"
                element={<LearnStepGate step="drill" />}
              />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/team/plays/:playId" element={<PlayEditorPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PlayFlagProvider>
  )
}
