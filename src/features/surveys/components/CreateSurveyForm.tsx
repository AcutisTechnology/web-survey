'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Channel, Education, SurveyQuestionDefinition, TargetConfig } from '@/shared/types'
import Card from '@/shared/components/ui/Card'
import Button from '@/shared/components/ui/Button'
import DispatchConfirmModal from './DispatchConfirmModal'
import {
  AGE_RANGE_OPTIONS,
  buildSurveyDefinition,
  clearSurveyDraft,
  formatEducationLabel,
  getContactMetrics,
  loadSurveyDraft,
  saveSurveyDraft,
  upsertSurvey,
} from '@/shared/lib/demo-store'

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  color: 'var(--color-text-primary)',
  marginBottom: '6px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  fontSize: '13px',
  border: '1px solid var(--color-border-secondary)',
  borderRadius: 'var(--border-radius-md)',
  fontFamily: 'var(--font-sans)',
  color: 'var(--color-text-primary)',
  outline: 'none',
  backgroundColor: 'var(--color-background-primary)',
}

const defaultQuestions: SurveyQuestionDefinition[] = [
  {
    id: 'q1',
    text: 'Em quem voce votaria?',
    type: 'single',
    options: [
      { id: 'q1a', text: 'Candidato A' },
      { id: 'q1b', text: 'Candidato B' },
      { id: 'q1c', text: 'Candidato C' },
      { id: 'q1d', text: 'Nenhum / branco' },
    ],
  },
]

const pbCities = [
  'João Pessoa',
  'Campina Grande',
  'Patos',
  'Sousa',
  'Cajazeiras',
  'Bayeux',
  'Santa Rita',
  'Cabedelo',
  'Guarabira',
  'Esperança',
]

interface FormState {
  title: string
  description: string
  startsAt: string
  endsAt: string
  channel: Channel
  cities: string[]
  targetGender: TargetConfig['gender']
  targetAgeRanges: string[]
  targetEducationEnabled: boolean
  targetEducation: Education
  requiresValidWhatsapp: boolean
  enableGeolocation: boolean
  formRateLimitMinutes: number
  questions: SurveyQuestionDefinition[]
}

interface CityImpact {
  city: string
  contacts: number
  whatsappValid: number
}

interface StoredDraft extends Partial<FormState> {}

const initialState: FormState = {
  title: '',
  description: '',
  startsAt: '',
  endsAt: '',
  channel: 'both',
  cities: ['João Pessoa', 'Campina Grande'],
  targetGender: 'all',
  targetAgeRanges: ['18-24', '25-34', '35-44', '45-59', '60+'],
  targetEducationEnabled: false,
  targetEducation: 'all',
  requiresValidWhatsapp: true,
  enableGeolocation: true,
  formRateLimitMinutes: 30,
  questions: defaultQuestions,
}

function createQuestion(): SurveyQuestionDefinition {
  const id = `q-${Date.now()}-${Math.round(Math.random() * 1000)}`
  return {
    id,
    text: '',
    type: 'single',
    options: [
      { id: `${id}-1`, text: '' },
      { id: `${id}-2`, text: '' },
    ],
  }
}

export default function CreateSurveyForm() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(initialState)
  const [cityInput, setCityInput] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  useEffect(() => {
    const draft = loadSurveyDraft<StoredDraft>() as StoredDraft | null
    if (!draft) return
    setForm((current: FormState) => ({
      ...current,
      ...draft,
      questions: Array.isArray(draft.questions) && draft.questions.length > 0 ? draft.questions : current.questions,
      cities: Array.isArray(draft.cities) && draft.cities.length > 0 ? draft.cities : current.cities,
    }))
  }, [])

  const contactMetrics = useMemo(() => getContactMetrics(), [])

  const cityBreakdown = useMemo<CityImpact[]>(() => {
    const byCityMap = new Map(contactMetrics.byCity.map((item) => [item.city, item.count]))
    return form.cities.map((city) => {
      const contacts = byCityMap.get(city) ?? Math.max(120, 90 + city.length * 20)
      const whatsappValid = form.requiresValidWhatsapp ? Math.round(contacts * 0.78) : contacts
      return { city, contacts, whatsappValid }
    })
  }, [contactMetrics.byCity, form.cities, form.requiresValidWhatsapp])

  const estimatedReach = cityBreakdown.reduce(
    (sum: number, city: CityImpact) => sum + (form.requiresValidWhatsapp ? city.whatsappValid : city.contacts),
    0,
  )
  const estimatedCost =
    form.channel === 'whatsapp'
      ? estimatedReach * 0.08
      : form.channel === 'both'
      ? estimatedReach * 0.09
      : 0

  const questionsAreValid = form.questions.every(
    (question: SurveyQuestionDefinition) =>
      question.text.trim().length > 0 &&
      question.options.filter((option) => option.text.trim().length > 0).length >= 2,
  )

  const canDispatch =
    form.title.trim().length > 0 &&
    form.startsAt.length > 0 &&
    form.endsAt.length > 0 &&
    form.cities.length > 0 &&
    questionsAreValid

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current: FormState) => ({ ...current, [key]: value }))
  }

  function updateQuestion(questionId: string, patch: Partial<SurveyQuestionDefinition>) {
    update(
      'questions',
      form.questions.map((question: SurveyQuestionDefinition) =>
        question.id === questionId ? { ...question, ...patch } : question,
      ),
    )
  }

  function updateOption(questionId: string, optionId: string, value: string) {
    update(
      'questions',
      form.questions.map((question: SurveyQuestionDefinition) =>
        question.id !== questionId
          ? question
          : {
              ...question,
              options: question.options.map((option) =>
                option.id === optionId ? { ...option, text: value } : option,
              ),
            },
      ),
    )
  }

  function addCity(city: string) {
    const trimmed = city.trim()
    if (!trimmed || form.cities.includes(trimmed)) return
    update('cities', [...form.cities, trimmed])
    setCityInput('')
  }

  function saveDraft() {
    saveSurveyDraft({
      title: form.title,
      description: form.description,
      startsAt: form.startsAt,
      endsAt: form.endsAt,
      channel: form.channel,
      cities: form.cities,
      targetGender: form.targetGender,
      targetAgeRanges: form.targetAgeRanges,
      targetEducationEnabled: form.targetEducationEnabled,
      targetEducation: form.targetEducation,
      requiresValidWhatsapp: form.requiresValidWhatsapp,
      enableGeolocation: form.enableGeolocation,
      formRateLimitMinutes: form.formRateLimitMinutes,
      questions: form.questions,
    })
    router.push('/surveys')
  }

  function handleDispatch() {
    const survey = buildSurveyDefinition({
      title: form.title,
      description: form.description,
      startsAt: form.startsAt,
      endsAt: form.endsAt,
      channel: form.channel,
      cities: form.cities,
      targetConfig: {
        cities: form.cities,
        gender: form.targetGender,
        ageRanges: form.targetAgeRanges,
        educationEnabled: form.targetEducationEnabled,
        education: form.targetEducation,
      },
      questions: form.questions.map((question) => ({
        ...question,
        options: question.options.filter((option) => option.text.trim().length > 0),
      })),
      requiresValidWhatsapp: form.requiresValidWhatsapp,
      estimatedReach,
      estimatedCost,
      formRateLimitMinutes: form.formRateLimitMinutes,
      enableGeolocation: form.enableGeolocation,
      status: 'active',
    })

    upsertSurvey(survey)
    clearSurveyDraft()
    router.push(`/surveys/${survey.id}/realtime`)
  }

  return (
    <div style={{ maxWidth: '980px' }}>
      <Card style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0' }}>Nova pesquisa</h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>
            Front-end completo para criacao, qualificacao, preview de disparo e integracao futura com backend.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <section>
              <h3 style={{ fontSize: '15px', marginBottom: '12px' }}>Identificacao e periodo</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Titulo *</label>
                  <input style={inputStyle} value={form.title} onChange={(e) => update('title', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Descricao</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: '74px', resize: 'vertical' }}
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Inicio *</label>
                    <input type="date" style={inputStyle} value={form.startsAt} onChange={(e) => update('startsAt', e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Fim *</label>
                    <input type="date" style={inputStyle} value={form.endsAt} onChange={(e) => update('endsAt', e.target.value)} />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 style={{ fontSize: '15px', marginBottom: '12px' }}>Canais e protecoes</h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {([
                  ['whatsapp', 'WhatsApp'],
                  ['form', 'Formulario web'],
                  ['both', 'Ambos'],
                ] as [Channel, string][]).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => update('channel', value)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '20px',
                      border: `1px solid ${form.channel === value ? 'var(--color-brand)' : 'var(--color-border-secondary)'}`,
                      backgroundColor: form.channel === value ? '#EBF3FB' : '#fff',
                      color: form.channel === value ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <label style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
                  <input
                    type="checkbox"
                    checked={form.requiresValidWhatsapp}
                    onChange={(e) => update('requiresValidWhatsapp', e.target.checked)}
                  />
                  Somente WhatsApp valido
                </label>
                <label style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
                  <input
                    type="checkbox"
                    checked={form.enableGeolocation}
                    onChange={(e) => update('enableGeolocation', e.target.checked)}
                  />
                  Solicitar geolocalizacao no form
                </label>
              </div>

              <div style={{ marginTop: '12px', maxWidth: '220px' }}>
                <label style={labelStyle}>Rate limit por IP (minutos)</label>
                <input
                  type="number"
                  min={5}
                  style={inputStyle}
                  value={form.formRateLimitMinutes}
                  onChange={(e) => update('formRateLimitMinutes', Number(e.target.value))}
                />
              </div>
            </section>

            <section>
              <h3 style={{ fontSize: '15px', marginBottom: '12px' }}>Segmentacao por localidade</h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <input
                  style={inputStyle}
                  list="pb-cities"
                  value={cityInput}
                  placeholder="Adicionar municipio"
                  onChange={(e) => setCityInput(e.target.value)}
                />
                <Button variant="default" size="md" onClick={() => addCity(cityInput)}>
                  Adicionar
                </Button>
                <datalist id="pb-cities">
                  {pbCities.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {form.cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => update('cities', form.cities.filter((item) => item !== city))}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '18px',
                      border: '1px solid var(--color-border-secondary)',
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    {city} ×
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 style={{ fontSize: '15px', marginBottom: '12px' }}>Target e qualificacao</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Genero-alvo</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {([
                      ['all', 'Todos'],
                      ['M', 'Masculino'],
                      ['F', 'Feminino'],
                    ] as [TargetConfig['gender'], string][]).map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => update('targetGender', value)}
                        style={{
                          padding: '7px 12px',
                          borderRadius: '16px',
                          border: `1px solid ${form.targetGender === value ? 'var(--color-brand)' : 'var(--color-border-secondary)'}`,
                          backgroundColor: form.targetGender === value ? '#EBF3FB' : '#fff',
                          color: form.targetGender === value ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                          cursor: 'pointer',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Faixas etarias</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {AGE_RANGE_OPTIONS.map((range) => (
                      <label key={range.value} style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
                        <input
                          type="checkbox"
                          checked={form.targetAgeRanges.includes(range.value)}
                          onChange={(e) => {
                            update(
                              'targetAgeRanges',
                              e.target.checked
                                ? [...form.targetAgeRanges, range.value]
                                : form.targetAgeRanges.filter((item) => item !== range.value),
                            )
                          }}
                        />
                        {range.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'flex', gap: '8px', fontSize: '13px', marginBottom: '8px' }}>
                    <input
                      type="checkbox"
                      checked={form.targetEducationEnabled}
                      onChange={(e) => update('targetEducationEnabled', e.target.checked)}
                    />
                    Habilitar pergunta opcional de escolaridade
                  </label>
                  {form.targetEducationEnabled && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {(['all', 'fundamental', 'medio', 'superior'] as Education[]).map((value) => (
                        <button
                          key={value}
                          onClick={() => update('targetEducation', value)}
                          style={{
                            padding: '7px 12px',
                            borderRadius: '16px',
                            border: `1px solid ${form.targetEducation === value ? 'var(--color-brand)' : 'var(--color-border-secondary)'}`,
                            backgroundColor: form.targetEducation === value ? '#EBF3FB' : '#fff',
                            color: form.targetEducation === value ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                            cursor: 'pointer',
                          }}
                        >
                          {formatEducationLabel(value)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '15px', margin: 0 }}>Perguntas da pesquisa</h3>
                <Button variant="outline" size="sm" onClick={() => update('questions', [...form.questions, createQuestion()])}>
                  + Pergunta
                </Button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {form.questions.map((question, questionIndex) => (
                  <div key={question.id} style={{ border: '1px solid var(--color-border-tertiary)', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <strong>Pergunta {questionIndex + 1}</strong>
                      <button
                        onClick={() => update('questions', form.questions.filter((item) => item.id !== question.id))}
                        style={{ border: 'none', background: 'transparent', color: '#991B1B', cursor: 'pointer' }}
                        disabled={form.questions.length === 1}
                      >
                        Remover
                      </button>
                    </div>

                    <div style={{ display: 'grid', gap: '10px' }}>
                      <input
                        style={inputStyle}
                        placeholder="Texto da pergunta"
                        value={question.text}
                        onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                      />

                      <select
                        style={inputStyle}
                        value={question.type}
                        onChange={(e) => {
                          const type = e.target.value as SurveyQuestionDefinition['type']
                          updateQuestion(question.id, {
                            type,
                            options:
                              type === 'scale'
                                ? ['1', '2', '3', '4', '5'].map((label, index) => ({
                                    id: `${question.id}-${index + 1}`,
                                    text: label,
                                  }))
                                : question.options,
                          })
                        }}
                      >
                        <option value="single">Escolha unica</option>
                        <option value="multiple">Multipla escolha</option>
                        <option value="scale">Escala 1-5</option>
                      </select>

                      <div style={{ display: 'grid', gap: '8px' }}>
                        {question.options.map((option) => (
                          <div key={option.id} style={{ display: 'flex', gap: '8px' }}>
                            <input
                              style={inputStyle}
                              value={option.text}
                              placeholder="Opcao"
                              onChange={(e) => updateOption(question.id, option.id, e.target.value)}
                              disabled={question.type === 'scale'}
                            />
                            {question.type !== 'scale' && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() =>
                                  updateQuestion(question.id, {
                                    options: question.options.filter((item) => item.id !== option.id),
                                  })
                                }
                                disabled={question.options.length <= 2}
                              >
                                ×
                              </Button>
                            )}
                          </div>
                        ))}
                        {question.type !== 'scale' && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() =>
                              updateQuestion(question.id, {
                                options: [
                                  ...question.options,
                                  { id: `${question.id}-${Date.now()}`, text: '' },
                                ],
                              })
                            }
                          >
                            + Opcao
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div>
            <Card style={{ backgroundColor: '#F8FAFC', position: 'sticky', top: '12px' }}>
              <h3 style={{ fontSize: '15px', marginTop: 0 }}>Resumo da configuracao</h3>
              <div style={{ display: 'grid', gap: '10px', fontSize: '13px' }}>
                <div><strong>{form.questions.length}</strong> perguntas configuradas</div>
                <div><strong>{form.cities.length}</strong> municipios no target</div>
                <div><strong>{estimatedReach.toLocaleString('pt-BR')}</strong> contatos estimados</div>
                <div><strong>R$ {estimatedCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> custo estimado</div>
                <div><strong>{form.channel}</strong> como canal principal</div>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-border-tertiary)' }}>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: 0 }}>
                  Ao publicar, o front gera URL publica, wizard responsivo, tela de qualificacao e anti-duplicacao local simulada.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Button variant="default" size="md" onClick={saveDraft}>
                    Salvar rascunho
                  </Button>
                  <Button variant="primary" size="md" onClick={() => setShowConfirmModal(true)} disabled={!canDispatch}>
                    Revisar disparo
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Card>

      {showConfirmModal && (
        <DispatchConfirmModal
          summary={{
            title: form.title,
            channel: form.channel,
            startsAt: form.startsAt,
            endsAt: form.endsAt,
            targetConfig: {
              cities: form.cities,
              gender: form.targetGender,
              ageRanges: form.targetAgeRanges,
              educationEnabled: form.targetEducationEnabled,
              education: form.targetEducation,
            },
            questions: form.questions,
            cityBreakdown,
            estimatedReach,
            estimatedCost,
          }}
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={handleDispatch}
        />
      )}
    </div>
  )
}
