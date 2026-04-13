'use client'

import React, { useEffect, useMemo, useState } from 'react'
import DuplicateBlock from './components/DuplicateBlock'
import ThankYouScreen from './components/ThankYouScreen'
import type { Education, QualificationAnswer, RespondentGender, SurveyDefinition, TargetStatus } from '@/shared/types'
import {
  AGE_RANGE_OPTIONS,
  classifyTargetStatus,
  computeFingerprintHash,
  formatEducationLabel,
  getFingerprintBlockCount,
  getSurveyById,
  isDuplicateSubmission,
  markSubmissionFingerprint,
  registerFingerprintBlock,
  saveFormSubmission,
} from '@/shared/lib/demo-store'

type Step = 'qualification' | 'survey' | 'done'

interface Answers {
  [questionId: string]: string | string[]
}

export default function PublicFormScreen({ surveyId }: { surveyId: string }) {
  const survey = useMemo<SurveyDefinition | null>(() => getSurveyById(surveyId) ?? getSurveyById('1') ?? null, [surveyId])
  const [step, setStep] = useState<Step>('qualification')
  const [answers, setAnswers] = useState<Answers>({})
  const [currentQ, setCurrentQ] = useState(0)
  const [isChecking, setIsChecking] = useState(true)
  const [isDuplicate, setIsDuplicate] = useState(false)
  const [fingerprintHash, setFingerprintHash] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [targetStatus, setTargetStatus] = useState<TargetStatus>('within_target')
  const [geolocationLabel, setGeolocationLabel] = useState<string | null>(null)
  const [qualErrors, setQualErrors] = useState<string[]>([])
  const [qualification, setQualification] = useState<QualificationAnswer>({
    city: '',
    gender: 'N',
    ageRange: '',
    education: undefined,
  })

  useEffect(() => {
    let active = true

    async function bootstrap() {
      const hash = await computeFingerprintHash(surveyId)
      if (!active) return
      setFingerprintHash(hash)
      const duplicates = isDuplicateSubmission(surveyId, hash)
      if (duplicates) registerFingerprintBlock(surveyId)
      if (getFingerprintBlockCount(surveyId) >= 4) setIsDuplicate(true)
      else setIsDuplicate(duplicates)
      setIsChecking(false)
    }

    void bootstrap()

    return () => {
      active = false
    }
  }, [surveyId])

  const totalQuestions = survey?.questions.length ?? 0
  const currentQuestion = survey?.questions[currentQ]
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined
  const progress = step === 'survey' ? Math.round((currentQ / Math.max(totalQuestions, 1)) * 100) : 0

  if (!survey) {
    return <PublicLayout><div>Pesquisa nao encontrada.</div></PublicLayout>
  }

  const activeSurvey = survey

  function submitQualification() {
    const errors: string[] = []
    if (!qualification.city) errors.push('city')
    if (!qualification.ageRange) errors.push('ageRange')
    if (!qualification.gender) errors.push('gender')
    if (activeSurvey.targetConfig.educationEnabled && !qualification.education) errors.push('education')
    if (errors.length > 0) {
      setQualErrors(errors)
      return
    }

    setQualErrors([])
    setTargetStatus(classifyTargetStatus(qualification, activeSurvey.targetConfig))
    setStep('survey')
  }

  function setSingleAnswer(questionId: string, optionId: string) {
    setAnswers((current) => ({ ...current, [questionId]: optionId }))
  }

  function setMultipleAnswer(questionId: string, optionId: string) {
    setAnswers((current) => {
      const previous = Array.isArray(current[questionId]) ? (current[questionId] as string[]) : []
      const next = previous.includes(optionId)
        ? previous.filter((item) => item !== optionId)
        : [...previous, optionId]
      return { ...current, [questionId]: next }
    })
  }

  async function requestGeolocation(): Promise<string | null> {
    if (!activeSurvey.enableGeolocation || !navigator.geolocation) return null
    return new Promise<string | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const label = `${position.coords.latitude.toFixed(3)}, ${position.coords.longitude.toFixed(3)}`
          setGeolocationLabel(label)
          resolve(label)
        },
        () => resolve(null),
        { enableHighAccuracy: false, maximumAge: 60000, timeout: 2000 },
      )
    })
  }

  async function nextQuestion() {
    if (honeypot.trim().length > 0) {
      setIsDuplicate(true)
      return
    }

    if (currentQ < totalQuestions - 1) {
      setCurrentQ((value) => value + 1)
      return
    }

    const currentGeolocationLabel = await requestGeolocation()
    saveFormSubmission({
      id: `resp-${Date.now()}`,
      surveyId,
      fingerprintHash,
      answeredAt: new Date().toISOString(),
      channel: 'form',
      qualification,
      targetStatus,
      geolocationLabel: currentGeolocationLabel,
      answers: Object.entries(answers).map(([questionId, value]) => ({
        questionId,
        optionIds: Array.isArray(value) ? value : [value],
      })),
    })
    markSubmissionFingerprint(surveyId, fingerprintHash)
    setStep('done')
  }

  if (isChecking) {
    return (
      <PublicLayout>
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#6b7280' }}>
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>⏳</div>
          <p style={{ fontSize: '14px' }}>Verificando fingerprint e limite por IP...</p>
        </div>
      </PublicLayout>
    )
  }

  if (isDuplicate) {
    return (
      <PublicLayout>
        <DuplicateBlock surveyTitle={survey.title} />
      </PublicLayout>
    )
  }

  if (step === 'done') {
    return (
      <PublicLayout>
        <ThankYouScreen targetStatus={targetStatus} geolocationLabel={geolocationLabel} />
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', marginBottom: '6px' }}>{survey.title}</h1>
        <p style={{ fontSize: '13px', color: '#6b7280' }}>{survey.description}</p>
      </div>

      {step === 'survey' && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', marginBottom: '6px' }}>
            <span>Pergunta {currentQ + 1} de {totalQuestions}</span>
            <span>{progress}%</span>
          </div>
          <div style={{ height: '4px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, backgroundColor: '#185FA5', borderRadius: '4px', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      )}

      {step === 'qualification' && (
        <div>
          <div style={{ backgroundColor: '#EBF3FB', border: '1px solid #b3d0ec', borderRadius: '8px', padding: '12px 14px', marginBottom: '20px', fontSize: '12px', color: '#185FA5' }}>
            As perguntas de qualificacao sao fixas em toda pesquisa. Suas respostas nao sao bloqueadas mesmo fora do target.
          </div>

          <div style={{ display: 'none' }}>
            <label htmlFor="website">Nao preencha este campo</label>
            <input id="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Qual e a sua cidade? *</label>
              <select style={inputStyle(qualErrors.includes('city'))} value={qualification.city} onChange={(e) => setQualification((current) => ({ ...current, city: e.target.value }))}>
                <option value="">Selecione sua cidade</option>
                {survey.targetConfig.cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
                <option value="Outra cidade">Outra cidade</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Qual e o seu sexo? *</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {([
                  ['M', 'Masculino'],
                  ['F', 'Feminino'],
                  ['N', 'Prefiro nao informar'],
                ] as [RespondentGender, string][]).map(([value, label]) => (
                  <button key={value} onClick={() => setQualification((current) => ({ ...current, gender: value }))} style={choiceButton(qualification.gender === value, qualErrors.includes('gender'))}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Qual e a sua faixa etaria? *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {AGE_RANGE_OPTIONS.map((range) => (
                  <button key={range.value} onClick={() => setQualification((current) => ({ ...current, ageRange: range.value }))} style={choiceButton(qualification.ageRange === range.value, qualErrors.includes('ageRange'))}>
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {survey.targetConfig.educationEnabled && (
              <div>
                <label style={labelStyle}>Qual e o seu nivel de escolaridade? *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {(['fundamental', 'medio', 'superior'] as Education[]).map((education) => (
                    <button key={education} onClick={() => setQualification((current) => ({ ...current, education }))} style={choiceButton(qualification.education === education, qualErrors.includes('education'))}>
                      {formatEducationLabel(education)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button onClick={submitQualification} style={primaryActionStyle}>
              Continuar →
            </button>
          </div>
        </div>
      )}

      {step === 'survey' && currentQuestion && (
        <div>
          <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px', marginBottom: '16px' }}>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a', lineHeight: 1.5, marginBottom: '16px' }}>
              {currentQuestion.text}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentQuestion.options.map((option) => {
                const selected = Array.isArray(currentAnswer)
                  ? currentAnswer.includes(option.id)
                  : currentAnswer === option.id
                return (
                  <button
                    key={option.id}
                    onClick={() => currentQuestion.type === 'multiple' ? setMultipleAnswer(currentQuestion.id, option.id) : setSingleAnswer(currentQuestion.id, option.id)}
                    style={{
                      padding: '12px 14px',
                      fontSize: '14px',
                      textAlign: 'left',
                      borderRadius: '8px',
                      border: `2px solid ${selected ? '#185FA5' : '#e5e7eb'}`,
                      backgroundColor: selected ? '#EBF3FB' : '#fff',
                      color: selected ? '#185FA5' : '#1a1a1a',
                      cursor: 'pointer',
                    }}
                  >
                    {option.text}
                  </button>
                )
              })}
            </div>
          </div>

          <button
            onClick={() => void nextQuestion()}
            disabled={Array.isArray(currentAnswer) ? currentAnswer.length === 0 : !currentAnswer}
            style={{ ...primaryActionStyle, width: '100%', opacity: Array.isArray(currentAnswer) ? (currentAnswer.length === 0 ? 0.6 : 1) : (currentAnswer ? 1 : 0.6) }}
          >
            {currentQ < totalQuestions - 1 ? 'Proxima →' : 'Enviar resposta ✓'}
          </button>
        </div>
      )}
    </PublicLayout>
  )
}

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: '100%',
    padding: '9px 12px',
    fontSize: '14px',
    border: `1px solid ${hasError ? '#dc2626' : '#d1d5db'}`,
    borderRadius: '6px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: '#1a1a1a',
    outline: 'none',
    backgroundColor: '#fff',
  }
}

function choiceButton(selected: boolean, hasError: boolean): React.CSSProperties {
  return {
    flex: 1,
    padding: '9px 10px',
    fontSize: '13px',
    borderRadius: '6px',
    border: `1px solid ${selected ? '#185FA5' : hasError ? '#dc2626' : '#d1d5db'}`,
    backgroundColor: selected ? '#185FA5' : '#fff',
    color: selected ? '#fff' : '#6b7280',
    cursor: 'pointer',
    fontFamily: 'inherit',
  }
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  marginBottom: '6px',
  color: '#1a1a1a',
}

const primaryActionStyle: React.CSSProperties = {
  marginTop: '8px',
  padding: '12px',
  fontSize: '14px',
  fontWeight: 600,
  backgroundColor: '#185FA5',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontFamily: 'inherit',
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px 48px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <div style={{ width: '28px', height: '28px', backgroundColor: '#185FA5', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>S</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: '15px', color: '#1a1a1a' }}>SurveyOps</span>
      </div>

      <div style={{ width: '100%', maxWidth: '520px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '28px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        {children}
      </div>

      <p style={{ marginTop: '20px', fontSize: '11px', color: '#9ca3af' }}>
        Powered by SurveyOps · fingerprint local e fluxo pronto para backend
      </p>
    </div>
  )
}
