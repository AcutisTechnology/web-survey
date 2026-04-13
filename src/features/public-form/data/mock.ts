export interface PublicSurveyQuestion {
  id: string
  order: number
  text: string
  options: { id: string; text: string }[]
}

export interface PublicSurveyData {
  id: string
  title: string
  description: string
  questions: PublicSurveyQuestion[]
  targetCities: string[]
  targetGender: 'all' | 'M' | 'F'
  targetAgeRanges: string[]
}

export const mockPublicSurvey: PublicSurveyData = {
  id: '1',
  title: 'Intenção de voto – Eleição Municipal',
  description: 'Pesquisa de intenção de voto para eleição municipal de 2026.',
  questions: [
    {
      id: 'q1',
      order: 1,
      text: 'Quem você pretende votar para prefeito nas próximas eleições?',
      options: [
        { id: 'q1a', text: 'Candidato A' },
        { id: 'q1b', text: 'Candidato B' },
        { id: 'q1c', text: 'Candidato C' },
        { id: 'q1d', text: 'Nenhum / em branco' },
      ],
    },
    {
      id: 'q2',
      order: 2,
      text: 'Como você avalia a atual gestão municipal?',
      options: [
        { id: 'q2a', text: 'Ótimo' },
        { id: 'q2b', text: 'Bom' },
        { id: 'q2c', text: 'Regular' },
        { id: 'q2d', text: 'Ruim' },
        { id: 'q2e', text: 'Péssimo' },
      ],
    },
    {
      id: 'q3',
      order: 3,
      text: 'Qual é o principal problema da sua cidade hoje?',
      options: [
        { id: 'q3a', text: 'Saúde' },
        { id: 'q3b', text: 'Segurança' },
        { id: 'q3c', text: 'Educação' },
        { id: 'q3d', text: 'Infraestrutura' },
        { id: 'q3e', text: 'Emprego' },
      ],
    },
  ],
  targetCities: ['João Pessoa', 'Campina Grande', 'Patos', 'Sousa', 'Cajazeiras', 'Bayeux'],
  targetGender: 'all',
  targetAgeRanges: ['18-24', '25-34', '35-44', '45-59', '60+'],
}

export const AGE_RANGES = [
  { value: '16-17', label: '16–17 anos' },
  { value: '18-24', label: '18–24 anos' },
  { value: '25-34', label: '25–34 anos' },
  { value: '35-44', label: '35–44 anos' },
  { value: '45-59', label: '45–59 anos' },
  { value: '60+', label: '60+ anos' },
]
