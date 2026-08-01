import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
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

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-flag">Level {id} · Kuis</p>
        <h1 className="font-display text-4xl text-chalk">{level.title}</h1>
        <p className="text-sm text-muted">3 soal · boleh lanjut meski belum 100%</p>
      </div>

      <div className="space-y-5">
        {questions.map((q, qi) => (
          <fieldset key={q.id} className="space-y-2">
            <legend className="font-medium text-chalk">
              {qi + 1}. {q.prompt}
            </legend>
            <div className="space-y-2">
              {q.choices.map((choice, ci) => {
                const selected = answers[qi] === ci
                let ring = 'ring-line/15'
                if (submitted) {
                  if (ci === q.correctIndex) ring = 'ring-flag'
                  else if (selected) ring = 'ring-red-400'
                } else if (selected) {
                  ring = 'ring-flag'
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
                    className={`block w-full rounded-xl bg-night/40 px-3 py-2 text-left text-sm ring-1 ${ring}`}
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
          className="w-full rounded-2xl bg-flag py-3 font-semibold text-night disabled:opacity-40"
        >
          Kirim jawaban
        </button>
      ) : (
        <div className="space-y-3">
          <p className="rounded-2xl bg-turf/30 px-4 py-3 text-center font-semibold">
            Skor: {scorePercent}%
          </p>
          <button
            type="button"
            onClick={() => navigate(`/learn/${id}/drill`)}
            className="w-full rounded-2xl bg-flag py-3 font-semibold text-night"
          >
            Lanjut ke drill
          </button>
          <Link to="/learn" className="block text-center text-sm text-muted underline">
            Kembali ke skill tree
          </Link>
        </div>
      )}
    </div>
  )
}
