import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PlayFlagProvider } from '../store/StoreProvider'
import { AppLayout } from './AppLayout'
import { RequireProfile } from './RequireProfile'
import { DashboardPage } from '../pages/DashboardPage'
import { DrillPage } from '../pages/DrillPage'
import { LearnTreePage } from '../pages/LearnTreePage'
import { LessonPage } from '../pages/LessonPage'
import { OnboardingPage } from '../pages/OnboardingPage'
import { PlayEditorPage } from '../pages/PlayEditorPage'
import { QuizPage } from '../pages/QuizPage'
import { TeamPage } from '../pages/TeamPage'

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
              <Route path="/learn/:levelId/lesson" element={<LessonPage />} />
              <Route path="/learn/:levelId/quiz" element={<QuizPage />} />
              <Route path="/learn/:levelId/drill" element={<DrillPage />} />
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
