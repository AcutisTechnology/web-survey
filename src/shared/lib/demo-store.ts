'use client'

import type {
  Channel,
  ContactRecord,
  Education,
  ExportRow,
  QualificationAnswer,
  FormSubmissionRecord,
  RealtimeCityResult,
  RealtimeOptionResult,
  RealtimeSnapshot,
  ReportEntry,
  RespondentGender,
  SurveyDefinition,
  SurveyQuestionDefinition,
  TargetConfig,
  TargetStatus,
} from '@/shared/types'

const SURVEYS_KEY = 'surveyops_custom_surveys'
const DRAFT_KEY = 'surveyops_survey_draft'
const CONTACTS_KEY = 'surveyops_contacts'
const FINGERPRINT_KEY = 'surveyops_fingerprints'
const BLOCK_LOG_KEY = 'surveyops_fingerprint_blocks'
const SUBMISSIONS_KEY = 'surveyops_form_submissions'

export const AGE_RANGE_OPTIONS = [
  { value: '16-17', label: '16-17 anos' },
  { value: '18-24', label: '18-24 anos' },
  { value: '25-34', label: '25-34 anos' },
  { value: '35-44', label: '35-44 anos' },
  { value: '45-59', label: '45-59 anos' },
  { value: '60+', label: '60+ anos' },
]

export const EDUCATION_OPTIONS = [
  { value: 'fundamental', label: 'Fundamental' },
  { value: 'medio', label: 'Medio' },
  { value: 'superior', label: 'Superior' },
] as const

export const PB_CITY_COORDS: Record<string, { lat: number; lng: number; mapId: string }> = {
  'João Pessoa': { lat: -7.115, lng: -34.861, mapId: 'mun_2507507' },
  'Campina Grande': { lat: -7.23, lng: -35.88, mapId: 'mun_2504009' },
  Patos: { lat: -7.026, lng: -37.275, mapId: 'mun_2510808' },
  Sousa: { lat: -6.759, lng: -38.228, mapId: 'mun_2516201' },
  Cajazeiras: { lat: -6.89, lng: -38.56, mapId: 'mun_2503704' },
  Bayeux: { lat: -7.125, lng: -34.932, mapId: 'mun_2501807' },
  'Santa Rita': { lat: -7.113, lng: -34.977, mapId: 'mun_2513703' },
  Cabedelo: { lat: -6.982, lng: -34.833, mapId: 'mun_2503209' },
  Guarabira: { lat: -6.855, lng: -35.49, mapId: 'mun_2506301' },
  Esperança: { lat: -7.033, lng: -35.857, mapId: 'mun_2506004' },
}

const OPTION_COLORS = ['#185FA5', '#993C1D', '#3B6D11', '#7C3AED', '#6B7280']

const seedSurveys: SurveyDefinition[] = [
  {
    id: '1',
    title: 'Intenção de voto - Eleição Municipal',
    description: 'Pesquisa quantitativa com coleta por WhatsApp e formulário público.',
    status: 'active',
    channel: 'both',
    cities: ['João Pessoa', 'Campina Grande', 'Patos', 'Sousa', 'Cajazeiras', 'Bayeux'],
    createdAt: '2026-03-01',
    startsAt: '2026-03-10',
    endsAt: '2026-04-10',
    targetConfig: {
      cities: ['João Pessoa', 'Campina Grande', 'Patos', 'Sousa', 'Cajazeiras', 'Bayeux'],
      gender: 'all',
      ageRanges: ['18-24', '25-34', '35-44', '45-59', '60+'],
      educationEnabled: true,
      education: 'medio',
    },
    questions: [
      {
        id: 'q1',
        text: 'Em quem voce votaria para prefeito?',
        type: 'single',
        options: [
          { id: 'q1a', text: 'Candidato A' },
          { id: 'q1b', text: 'Candidato B' },
          { id: 'q1c', text: 'Candidato C' },
          { id: 'q1d', text: 'Nenhum / branco' },
        ],
      },
      {
        id: 'q2',
        text: 'Voce aprova a gestão atual?',
        type: 'single',
        options: [
          { id: 'q2a', text: 'Sim' },
          { id: 'q2b', text: 'Nao' },
          { id: 'q2c', text: 'Parcialmente' },
        ],
      },
      {
        id: 'q3',
        text: 'Qual o principal problema da sua cidade hoje?',
        type: 'single',
        options: [
          { id: 'q3a', text: 'Saude' },
          { id: 'q3b', text: 'Seguranca' },
          { id: 'q3c', text: 'Infraestrutura' },
          { id: 'q3d', text: 'Emprego' },
        ],
      },
    ],
    requiresValidWhatsapp: true,
    estimatedCost: 318.5,
    estimatedReach: 8470,
    formRateLimitMinutes: 30,
    enableGeolocation: true,
  },
  {
    id: '2',
    title: 'Aprovação do prefeito - Mar/2026',
    description: 'Mede aprovação da gestão municipal por cidade e faixa etaria.',
    status: 'active',
    channel: 'whatsapp',
    cities: ['João Pessoa', 'Campina Grande', 'Bayeux'],
    createdAt: '2026-03-05',
    startsAt: '2026-03-15',
    endsAt: '2026-03-31',
    targetConfig: {
      cities: ['João Pessoa', 'Campina Grande', 'Bayeux'],
      gender: 'all',
      ageRanges: ['25-34', '35-44', '45-59', '60+'],
      educationEnabled: false,
      education: 'all',
    },
    questions: [
      {
        id: 'q1',
        text: 'Voce aprova a gestão atual?',
        type: 'single',
        options: [
          { id: 'a1', text: 'Aprova' },
          { id: 'a2', text: 'Desaprova' },
          { id: 'a3', text: 'Nao sabe avaliar' },
        ],
      },
    ],
    requiresValidWhatsapp: true,
    estimatedCost: 112,
    estimatedReach: 3360,
    formRateLimitMinutes: 30,
    enableGeolocation: false,
  },
  {
    id: '3',
    title: 'Avaliação de serviços publicos',
    description: 'Levantamento fechado para comparativo historico por municipio.',
    status: 'closed',
    channel: 'form',
    cities: ['João Pessoa', 'Campina Grande', 'Patos', 'Sousa', 'Cajazeiras', 'Bayeux', 'Santa Rita', 'Cabedelo', 'Guarabira', 'Esperança'],
    createdAt: '2026-01-10',
    startsAt: '2026-01-20',
    endsAt: '2026-02-28',
    targetConfig: {
      cities: ['João Pessoa', 'Campina Grande', 'Patos', 'Sousa', 'Cajazeiras', 'Bayeux', 'Santa Rita', 'Cabedelo', 'Guarabira', 'Esperança'],
      gender: 'all',
      ageRanges: ['18-24', '25-34', '35-44', '45-59', '60+'],
      educationEnabled: false,
      education: 'all',
    },
    questions: [
      {
        id: 'q1',
        text: 'Como voce avalia os serviços publicos da sua cidade?',
        type: 'scale',
        options: [
          { id: 'o1', text: '1' },
          { id: 'o2', text: '2' },
          { id: 'o3', text: '3' },
          { id: 'o4', text: '4' },
          { id: 'o5', text: '5' },
        ],
      },
    ],
    requiresValidWhatsapp: false,
    estimatedCost: 0,
    estimatedReach: 5200,
    formRateLimitMinutes: 30,
    enableGeolocation: true,
  },
]

const seedContacts: ContactRecord[] = [
  ['Maria Silva', '83991234567', 'João Pessoa'],
  ['Jose Almeida', '83988112233', 'João Pessoa'],
  ['Ana Costa', '83999887766', 'Campina Grande'],
  ['Carlos Souza', '83987456321', 'Patos'],
  ['Fernanda Lima', '83994561234', 'Sousa'],
  ['Rafael Gomes', '83990001122', 'Cajazeiras'],
  ['Luciana Rocha', '83991239876', 'Bayeux'],
  ['Pedro Santos', '83981239876', 'Santa Rita'],
  ['Juliana Freitas', '83993456789', 'Cabedelo'],
  ['Bianca Nunes', '83994560001', 'Guarabira'],
  ['Ricardo Melo', '83998765432', 'Esperança'],
  ['Priscila Andrade', '8387654321', 'João Pessoa'],
].map(([name, phoneRaw, city], index) => createContact(name, phoneRaw, city, index))

function createContact(name: string, phoneRaw: string, city: string, index: number): ContactRecord {
  const phoneE164 = normalizePhone(phoneRaw)
  return {
    id: `contact-${index + 1}`,
    name,
    phoneRaw,
    phoneE164,
    city,
    state: 'PB',
    whatsappValid: isWhatsappValid(phoneE164),
    importedAt: new Date(2026, 2, 1 + index).toISOString(),
  }
}

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function safeWrite<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(value))
}

function hashString(value: string): number {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }
  return hash
}

function generateOptionWeights(seed: string, count: number): number[] {
  return Array.from({ length: count }, (_, index) => {
    const base = hashString(`${seed}-${index}`)
    return (base % 100) + 15 + (count - index) * 3
  })
}

function toPct(count: number, total: number): number {
  return total > 0 ? Math.round((count / total) * 1000) / 10 : 0
}

function labelToColor(index: number): string {
  return OPTION_COLORS[index % OPTION_COLORS.length]
}

function getCustomSurveys(): SurveyDefinition[] {
  return safeRead<SurveyDefinition[]>(SURVEYS_KEY, [])
}

export function getAllSurveys(): SurveyDefinition[] {
  const custom = getCustomSurveys()
  return [...custom, ...seedSurveys].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function getSurveyById(id: string): SurveyDefinition | undefined {
  return getAllSurveys().find((survey) => survey.id === id)
}

export function saveSurveyDraft<T>(draft: T) {
  safeWrite(DRAFT_KEY, draft)
}

export function loadSurveyDraft<T>(): T | null {
  return safeRead<T | null>(DRAFT_KEY, null)
}

export function clearSurveyDraft() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(DRAFT_KEY)
}

export function upsertSurvey(survey: SurveyDefinition) {
  const current = getCustomSurveys()
  const next = [survey, ...current.filter((item) => item.id !== survey.id)]
  safeWrite(SURVEYS_KEY, next)
}

export function buildSurveyDefinition(input: {
  title: string
  description: string
  startsAt: string
  endsAt: string
  channel: Channel
  cities: string[]
  targetConfig: TargetConfig
  questions: SurveyQuestionDefinition[]
  requiresValidWhatsapp: boolean
  estimatedReach: number
  estimatedCost: number
  formRateLimitMinutes: number
  enableGeolocation: boolean
  status?: SurveyDefinition['status']
  id?: string
}): SurveyDefinition {
  return {
    id: input.id ?? `custom-${Date.now()}`,
    title: input.title,
    description: input.description,
    startsAt: input.startsAt,
    endsAt: input.endsAt,
    channel: input.channel,
    cities: input.cities,
    status: input.status ?? 'draft',
    createdAt: new Date().toISOString().slice(0, 10),
    targetConfig: input.targetConfig,
    questions: input.questions,
    requiresValidWhatsapp: input.requiresValidWhatsapp,
    estimatedReach: input.estimatedReach,
    estimatedCost: input.estimatedCost,
    formRateLimitMinutes: input.formRateLimitMinutes,
    enableGeolocation: input.enableGeolocation,
  }
}

export function getDashboardMetrics() {
  const surveys = getAllSurveys()
  const activeSurveys = surveys.filter((survey) => survey.status === 'active')
  const citiesCovered = new Set(activeSurveys.flatMap((survey) => survey.cities))
  const responsesToday = activeSurveys.reduce(
    (sum, survey) => sum + Math.round(getRealtimeSnapshot(survey.id).totalResponses * 0.08),
    0,
  )

  return {
    active: activeSurveys.length,
    responsesToday,
    citiesCovered: citiesCovered.size,
  }
}

export function getRealtimeSnapshot(surveyId: string): RealtimeSnapshot {
  const survey = getSurveyById(surveyId) ?? seedSurveys[0]
  const firstQuestion = survey.questions[0] ?? {
    id: 'fallback',
    text: 'Pergunta principal',
    type: 'single' as const,
    options: [
      { id: 'opt-1', text: 'Opcao A' },
      { id: 'opt-2', text: 'Opcao B' },
    ],
  }

  const optionTotals = new Map<string, number>()
  const optionTargetTotals = new Map<string, number>()
  const optionByCity = new Map<string, Record<string, { count: number; pct: number }>>()

  const cities: RealtimeCityResult[] = survey.cities.map((cityName) => {
    const coord = PB_CITY_COORDS[cityName] ?? {
      lat: -7 + (hashString(cityName) % 10) / 10,
      lng: -35 - (hashString(`${cityName}-lng`) % 10) / 10,
      mapId: cityName.toLowerCase(),
    }
    const total = 80 + (hashString(`${survey.id}-${cityName}`) % 120)
    const withinTarget = Math.round(total * (0.62 + (hashString(`${cityName}-target`) % 15) / 100))
    const weights = generateOptionWeights(`${survey.id}-${cityName}`, firstQuestion.options.length)
    const weightSum = weights.reduce((sum, value) => sum + value, 0)
    const counts = firstQuestion.options.map((option, index) => {
      const count = index === firstQuestion.options.length - 1
        ? total - firstQuestion.options.slice(0, -1).reduce((sum, _, innerIndex) => {
            const innerWeight = weights[innerIndex]
            return sum + Math.round((innerWeight / weightSum) * total)
          }, 0)
        : Math.round((weights[index] / weightSum) * total)

      optionTotals.set(option.id, (optionTotals.get(option.id) ?? 0) + count)
      optionTargetTotals.set(
        option.id,
        (optionTargetTotals.get(option.id) ?? 0) + Math.round(count * (withinTarget / total)),
      )

      const byCity = optionByCity.get(option.id) ?? {}
      byCity[cityName] = { count, pct: toPct(count, total) }
      optionByCity.set(option.id, byCity)
      return { option, count }
    })

    const leader = counts.reduce((best, current) => (current.count > best.count ? current : best), counts[0])
    const breakdown = counts.reduce<Record<string, { count: number; pct: number }>>((acc, entry) => {
      acc[entry.option.text] = { count: entry.count, pct: toPct(entry.count, total) }
      return acc
    }, {})

    return {
      id: `${survey.id}-${coord.mapId}`,
      name: cityName,
      lat: coord.lat,
      lng: coord.lng,
      mapId: coord.mapId,
      total,
      withinTarget,
      leadingOption: leader.option.text,
      leadingColor: labelToColor(firstQuestion.options.findIndex((item) => item.id === leader.option.id)),
      breakdown,
    }
  })

  let totalResponses = cities.reduce((sum, city) => sum + city.total, 0)
  let targetResponses = cities.reduce((sum, city) => sum + city.withinTarget, 0)
  const remainingAfterTarget = Math.max(totalResponses - targetResponses, 0)
  let outsideTargetCount = Math.min(Math.round(totalResponses * 0.18), remainingAfterTarget)
  let partialTargetCount = Math.min(
    Math.round(totalResponses * 0.1),
    Math.max(remainingAfterTarget - outsideTargetCount, 0),
  )
  let unqualifiedCount = Math.max(
    totalResponses - targetResponses - outsideTargetCount - partialTargetCount,
    0,
  )
  const formShare = survey.channel === 'form' ? 1 : survey.channel === 'both' ? 0.34 : 0
  let formCount = Math.round(totalResponses * formShare)
  let whatsappCount = totalResponses - formCount
  let targetFormCount = Math.round(targetResponses * formShare)
  let targetWhatsappCount = targetResponses - targetFormCount
  const optionTargetCounts = new Map(firstQuestion.options.map((option) => [option.id, optionTargetTotals.get(option.id) ?? 0]))

  const options: RealtimeOptionResult[] = firstQuestion.options.map((option, index) => {
    const count = optionTotals.get(option.id) ?? 0
    const targetCount = optionTargetTotals.get(option.id) ?? 0
    return {
      id: option.id,
      text: option.text,
      color: labelToColor(index),
      count,
      pct: toPct(count, totalResponses),
      pctInTarget: toPct(targetCount, targetResponses),
      byCity: optionByCity.get(option.id) ?? {},
    }
  })

  const submissions = getFormSubmissions(surveyId)
  if (submissions.length > 0) {
    submissions.forEach((submission, submissionIndex) => {
      const cityName = submission.qualification.city
      const cityEntry = cities.find((city) => city.name === cityName)
      const firstAnswer = submission.answers.find((answer) => answer.questionId === firstQuestion.id)
      const selectedOptionIds = firstAnswer?.optionIds ?? []

      selectedOptionIds.forEach((optionId) => {
        const option = options.find((item) => item.id === optionId)
        if (!option) return
        option.count += 1

        if (submission.targetStatus === 'within_target') {
          optionTargetCounts.set(option.id, (optionTargetCounts.get(option.id) ?? 0) + 1)
        }

        if (cityEntry) {
          const current = option.byCity[cityName] ?? { count: 0, pct: 0 }
          option.byCity[cityName] = { ...current, count: current.count + 1, pct: 0 }
          const cityBreakdown = cityEntry.breakdown[option.text] ?? { count: 0, pct: 0 }
          cityEntry.breakdown[option.text] = { ...cityBreakdown, count: cityBreakdown.count + 1, pct: 0 }
        }
      })

      if (cityEntry) {
        cityEntry.total += 1
        if (submission.targetStatus === 'within_target') {
          cityEntry.withinTarget += 1
        }
      }

      if (submission.channel === 'form') {
        formCount += 1
        if (submission.targetStatus === 'within_target') {
          targetFormCount += 1
        }
      }

      totalResponses += 1

      if (submission.targetStatus === 'within_target') targetResponses += 1
      if (submission.targetStatus === 'out_of_target') outsideTargetCount += 1
      if (submission.targetStatus === 'partial_target') partialTargetCount += 1
      if (submission.targetStatus === 'unqualified') unqualifiedCount += 1
    })

    whatsappCount = totalResponses - formCount
    targetWhatsappCount = targetResponses - targetFormCount

    cities.forEach((city) => {
      firstQuestion.options.forEach((option) => {
        const item = city.breakdown[option.text] ?? { count: 0, pct: 0 }
        city.breakdown[option.text] = {
          count: item.count,
          pct: toPct(item.count, city.total),
        }
      })

      const leader = firstQuestion.options
        .map((option) => ({ option, count: city.breakdown[option.text]?.count ?? 0 }))
        .reduce((best, current) => (current.count > best.count ? current : best), {
          option: firstQuestion.options[0],
          count: city.breakdown[firstQuestion.options[0].text]?.count ?? 0,
        })

      city.leadingOption = leader.option.text
      city.leadingColor = labelToColor(firstQuestion.options.findIndex((item) => item.id === leader.option.id))
    })

    options.forEach((option) => {
      Object.entries(option.byCity).forEach(([cityName, data]) => {
        const cityEntry = cities.find((city) => city.name === cityName)
        option.byCity[cityName] = {
          count: data.count,
          pct: toPct(data.count, cityEntry?.total ?? data.count),
        }
      })

      option.pct = toPct(option.count, totalResponses)

      option.pctInTarget = toPct(optionTargetCounts.get(option.id) ?? 0, targetResponses)
    })
  }

  return {
    surveyTitle: survey.title,
    totalResponses,
    whatsappCount,
    formCount,
    targetResponses,
    targetWhatsappCount,
    targetFormCount,
    options,
    cities,
    outsideTargetCount,
    partialTargetCount,
    unqualifiedCount,
  }
}

export function getReportEntries(): ReportEntry[] {
  return getAllSurveys().map((survey) => ({
    id: survey.id,
    title: survey.title,
    responses: getRealtimeSnapshot(survey.id).totalResponses,
    cities: survey.cities.length,
    period: `${formatDateShort(survey.startsAt)} - ${formatDateShort(survey.endsAt)}`,
    status: survey.status,
  }))
}

export function getExportRows(surveyId: string): ExportRow[] {
  const survey = getSurveyById(surveyId)
  if (!survey) return []

  const realtime = getRealtimeSnapshot(surveyId)
  const question = survey.questions[0]
  if (!question) return []

  const channels: Channel[] = survey.channel === 'both' ? ['whatsapp', 'form'] : [survey.channel]
  const rows: ExportRow[] = []

  realtime.cities.forEach((city) => {
    Object.entries(city.breakdown).forEach(([answer, info], answerIndex) => {
      const sampleSize = Math.max(2, Math.round(info.count / 18))
      for (let index = 0; index < sampleSize; index += 1) {
        const targetStatus = selectTargetStatus(city.name, index)
        rows.push({
          responseId: `${surveyId}-${city.mapId}-${answerIndex}-${index}`,
          surveyId,
          city: city.name,
          channel: channels[index % channels.length],
          question: question.text,
          answer,
          answeredAt: new Date(2026, 2, 1 + ((answerIndex + index) % 28), 8 + (index % 10)).toISOString(),
          targetStatus,
        })
      }
    })
  })

  return rows
}

function selectTargetStatus(city: string, index: number): TargetStatus {
  const seed = hashString(`${city}-${index}`) % 100
  if (seed < 66) return 'within_target'
  if (seed < 82) return 'out_of_target'
  if (seed < 94) return 'partial_target'
  return 'unqualified'
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    return `+${digits}`
  }
  if (digits.length === 10 || digits.length === 11) {
    return `+55${digits}`
  }
  return digits.startsWith('+') ? digits : `+${digits}`
}

export function isWhatsappValid(phoneE164: string): boolean {
  const digits = phoneE164.replace(/\D/g, '')
  return digits.startsWith('55') && digits.length >= 12 && digits.length <= 13
}

export function getContacts(): ContactRecord[] {
  const stored = safeRead<ContactRecord[] | null>(CONTACTS_KEY, null)
  return stored && stored.length > 0 ? stored : seedContacts
}

export function saveContacts(contacts: ContactRecord[]) {
  safeWrite(CONTACTS_KEY, contacts)
}

export function importContactsFromCsv(text: string): ContactRecord[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  if (lines.length <= 1) return []

  const rows = lines.slice(1)
  const imported = rows.map((line, index) => {
    const [name = '', phone = '', city = '', state = 'PB'] = line.split(',').map((part) => part.trim())
    const phoneE164 = normalizePhone(phone)
    return {
      id: `import-${Date.now()}-${index}`,
      name,
      phoneRaw: phone,
      phoneE164,
      city,
      state,
      whatsappValid: isWhatsappValid(phoneE164),
      importedAt: new Date().toISOString(),
    }
  })

  const next = [...imported, ...getContacts()]
  saveContacts(next)
  return imported
}

export function getContactMetrics() {
  const contacts = getContacts()
  const cities = new Map<string, number>()

  contacts.forEach((contact) => {
    cities.set(contact.city, (cities.get(contact.city) ?? 0) + 1)
  })

  return {
    total: contacts.length,
    cities: cities.size,
    whatsappValid: contacts.filter((contact) => contact.whatsappValid).length,
    byCity: Array.from(cities.entries())
      .map(([city, count]) => ({ city, count, pct: Math.round((count / contacts.length) * 100) }))
      .sort((a, b) => b.count - a.count),
  }
}

export async function computeFingerprintHash(surveyId: string): Promise<string> {
  const source = [
    surveyId,
    navigator.userAgent,
    navigator.language,
    navigator.platform,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    `${window.screen.width}x${window.screen.height}`,
  ].join('|')

  if (window.crypto?.subtle) {
    const buffer = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(source))
    return Array.from(new Uint8Array(buffer))
      .map((value) => value.toString(16).padStart(2, '0'))
      .join('')
  }

  return String(hashString(source))
}

export function isDuplicateSubmission(surveyId: string, fingerprintHash: string): boolean {
  const data = safeRead<Record<string, string[]>>(FINGERPRINT_KEY, {})
  return (data[surveyId] ?? []).includes(fingerprintHash)
}

export function markSubmissionFingerprint(surveyId: string, fingerprintHash: string) {
  const data = safeRead<Record<string, string[]>>(FINGERPRINT_KEY, {})
  const current = data[surveyId] ?? []
  if (!current.includes(fingerprintHash)) {
    data[surveyId] = [...current, fingerprintHash]
    safeWrite(FINGERPRINT_KEY, data)
  }
}

export function getFormSubmissions(surveyId?: string): FormSubmissionRecord[] {
  const data = safeRead<FormSubmissionRecord[]>(SUBMISSIONS_KEY, [])
  return surveyId ? data.filter((item) => item.surveyId === surveyId) : data
}

export function saveFormSubmission(submission: FormSubmissionRecord) {
  const current = getFormSubmissions()
  safeWrite(SUBMISSIONS_KEY, [submission, ...current])
}

export function getFingerprintBlockCount(surveyId: string): number {
  const data = safeRead<Record<string, number>>(BLOCK_LOG_KEY, {})
  return data[surveyId] ?? 0
}

export function registerFingerprintBlock(surveyId: string) {
  const data = safeRead<Record<string, number>>(BLOCK_LOG_KEY, {})
  data[surveyId] = (data[surveyId] ?? 0) + 1
  safeWrite(BLOCK_LOG_KEY, data)
}

export function classifyTargetStatus(answer: QualificationAnswer, targetConfig: TargetConfig): TargetStatus {
  if (!answer.city || !answer.gender || !answer.ageRange) {
    return 'unqualified'
  }

  const checks = [
    targetConfig.cities.includes(answer.city),
    targetConfig.gender === 'all' || targetConfig.gender === answer.gender,
    targetConfig.ageRanges.length === 0 || targetConfig.ageRanges.includes(answer.ageRange),
  ]

  if (targetConfig.educationEnabled) {
    checks.push(
      targetConfig.education === 'all' ||
        (answer.education !== undefined && targetConfig.education === answer.education),
    )
  }

  const matched = checks.filter(Boolean).length
  if (matched === checks.length) return 'within_target'
  if (matched === 0) return 'out_of_target'
  return 'partial_target'
}

export function formatDateShort(dateValue: string): string {
  if (!dateValue) return '--/--/----'
  const [year, month, day] = dateValue.slice(0, 10).split('-')
  return `${day}/${month}/${year}`
}

export function formatGenderLabel(gender: TargetConfig['gender']) {
  if (gender === 'M') return 'Masculino'
  if (gender === 'F') return 'Feminino'
  return 'Todos'
}

export function formatEducationLabel(education: Education) {
  if (education === 'fundamental') return 'Fundamental'
  if (education === 'medio') return 'Medio'
  if (education === 'superior') return 'Superior'
  return 'Qualquer'
}

export function formatRespondentGender(gender: RespondentGender) {
  if (gender === 'M') return 'Masculino'
  if (gender === 'F') return 'Feminino'
  return 'Prefiro nao informar'
}
