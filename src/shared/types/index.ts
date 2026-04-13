export type SurveyStatus = 'draft' | 'active' | 'closed'
export type Channel = 'whatsapp' | 'form' | 'both'
export type TargetStatus = 'within_target' | 'out_of_target' | 'partial_target' | 'unqualified'
export type Gender = 'all' | 'M' | 'F'
export type RespondentGender = 'M' | 'F' | 'N'
export type Education = 'all' | 'fundamental' | 'medio' | 'superior'

export interface TargetConfig {
  cities: string[]
  gender: Gender
  ageRanges: string[]
  educationEnabled: boolean
  education: Education
}

export interface QualificationAnswer {
  city: string
  gender: RespondentGender
  ageRange: string
  education?: Education
}

export interface Survey {
  id: string
  title: string
  description: string
  status: SurveyStatus
  channel: Channel
  cities: string[]
  createdAt: string
  startsAt: string
  endsAt: string
}

export interface Question {
  id: string
  surveyId: string
  order: number
  text: string
  type: 'single' | 'multiple' | 'scale'
  options: Option[]
}

export interface Option {
  id: string
  questionId: string
  text: string
  order: number
  count: number
  pct: number
  color: string
  byCity: Record<string, { count: number; pct: number }>
}

export interface Contact {
  id: string
  name: string
  phone: string
  city: string
  state: string
  whatsappValid: boolean
}

export interface City {
  name: string
  state: string
  lat: number
  lng: number
  leadingOption: string
  leadingColor: string
  breakdown: Record<string, number>
}

export interface ReportEntry {
  id: string
  title: string
  responses: number
  cities: number
  period: string
  status: SurveyStatus
}

export interface SurveyQuestionOption {
  id: string
  text: string
}

export interface SurveyQuestionDefinition {
  id: string
  text: string
  type: 'single' | 'multiple' | 'scale'
  options: SurveyQuestionOption[]
}

export interface RealtimeCityBreakdown {
  count: number
  pct: number
}

export interface RealtimeOptionResult {
  id: string
  text: string
  color: string
  count: number
  pct: number
  pctInTarget: number
  byCity: Record<string, RealtimeCityBreakdown>
}

export interface RealtimeCityResult {
  id: string
  name: string
  lat: number
  lng: number
  mapId: string
  total: number
  withinTarget: number
  leadingOption: string
  leadingColor: string
  breakdown: Record<string, RealtimeCityBreakdown>
}

export interface RealtimeSnapshot {
  surveyTitle: string
  totalResponses: number
  whatsappCount: number
  formCount: number
  targetResponses: number
  targetWhatsappCount: number
  targetFormCount: number
  options: RealtimeOptionResult[]
  cities: RealtimeCityResult[]
  outsideTargetCount: number
  partialTargetCount: number
  unqualifiedCount: number
}

export interface SurveyDefinition extends Survey {
  targetConfig: TargetConfig
  questions: SurveyQuestionDefinition[]
  requiresValidWhatsapp: boolean
  estimatedCost: number
  estimatedReach: number
  formRateLimitMinutes: number
  enableGeolocation: boolean
}

export interface ContactRecord {
  id: string
  name: string
  phoneRaw: string
  phoneE164: string
  city: string
  state: string
  whatsappValid: boolean
  importedAt: string
}

export interface ExportRow {
  responseId: string
  surveyId: string
  city: string
  channel: Channel
  question: string
  answer: string
  answeredAt: string
  targetStatus: TargetStatus
}

export interface FormSubmissionAnswer {
  questionId: string
  optionIds: string[]
}

export interface FormSubmissionRecord {
  id: string
  surveyId: string
  fingerprintHash: string
  answeredAt: string
  channel: 'form'
  qualification: QualificationAnswer
  targetStatus: TargetStatus
  geolocationLabel: string | null
  answers: FormSubmissionAnswer[]
}
