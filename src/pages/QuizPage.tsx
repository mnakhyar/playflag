import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { FlowBackLink } from '../components/FlowBackLink'
import { getLevel } from '../content/levels'
import { nodeStatus } from '../store/selectors'
import { usePlayFlag } from '../store/StoreProvider'

export function QuizPage() {
  const { levelId } = useParams()
  const id = Number(levelId)
  const { state, dispatch } = usePlayFlag()
  const navigate = useNavigate()
  const level = getLevel(id)
  const status = nodeStatus(id, state.progress.completedLevels)

  const questions = level?.quiz ?? []
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    questions.map(() => null),
  )
  const [submitted, setSubmitted] = useState(false)

  const scorePercent = useMemo(() => {
    if (questions.length === 0) return 0
    let correct = 0
    questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correct += 1
    })
    return Math.round((correct / questions.length) * 100)
  }, [answers, questions])

  if (!level || level.statusInP1 !== 'full' || !level.quiz) {
    return <Navigate to="/learn" replace />
  }
  if (status === 'locked') {
    return <Navigate to="/learn" replace />
  }

  const allAnswered = answers.every((a) => a !== null)

  const submit = () => {
    if (!allAnswered) return
    dispatch({
      type: 'SUBMIT_QUIZ',
      levelId: id,
      category: level.category,
      scorePercent,
    })
    setSubmitted(true)
  }

  const retry = () => {
    setAnswers(questions.map(() => null))
    setSubmitted(false)
  }

  return (
    <div className="space-y-8">
      <FlowBackLink to={`/learn/${id}/lesson`}>Kembali ke lesson</FlowBackLink>

      <div className="space-y-2">
        <p className="text-[13px] font-medium text-flag">
          Level <span className="tabular-nums">{id}</span>
          <span className="text-muted"> · Kuis</span>
        </p>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-chalk">
          {level.title}
        </h1>
        <p className="max-w-[40ch] text-sm leading-relaxed text-muted">
          Tiga soal pilihan ganda. Kamu bisa lanjut ke drill meski skor belum penuh, dan boleh
          mengulang sebelum drill.
        </p>
      </div>

      <div className="space-y-8">
        {questions.map((q, qi) => (
          <fieldset key={q.id} className="space-y-3">
            <legend className="font-medium leading-snug text-pretty text-chalk">
              <span className="tabular-nums text-flag">{qi + 1}.</span> {q.prompt}
            </legend>
            <div className="divide-y divide-[rgba(84,84,88,0.55)]">
              {q.choices.map((choice, ci) => {
                const selected = answers[qi] === ci
                let tone = 'text-line'
                if (submitted) {
                  if (ci === q.correctIndex) tone = 'text-flag'
                  else if (selected) tone = 'text-red-300'
                } else if (selected) {
                  tone = 'text-chalk'
                }
                return (
                  <button
                    key={choice}
                    type="button"
                    disabled={submitted}
                    onClick={() =>
                      setAnswers((prev) => {
                        const next = prev.slice()
                        next[qi] = ci
                        return next
                      })
                    }
                    className={`pressable flex min-h-11 w-full items-center px-1 py-3 text-left text-[15px] transition-colors ${tone} ${
                      selected && !submitted ? 'bg-white/[0.03]' : ''
                    }`}
                  >
                    {choice}
                  </button>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>

      {!submitted ? (
        <button
          type="button"
          disabled={!allAnswered}
          onClick={submit}
          className="btn-primary"
        >
          Kirim jawaban
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-center text-lg font-semibold tabular-nums tracking-tight">
            Skor kamu: {scorePercent}%
          </p>
          <button
            type="button"
            onClick={() => navigate(`/learn/${id}/drill`)}
            className="btn-primary group"
          >
            <span>Lanjut ke drill</span>
            <span
              className="flex h-7 w-7 items-center justify-center rounded-md bg-black/10 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            >
              →
            </span>
          </button>
          <button type="button" onClick={retry} className="btn-secondary">
            Ulangi kuis
          </button>
          <FlowBackLink to="/learn">Kembali ke skill tree</FlowBackLink>
        </div>
      )}
    </div>
  )
}
