import type { Survey } from '@/shared/types'

export const mockSurveyList: Survey[] = [
  {
    id: '1',
    title: 'Intenção de voto – Eleição Municipal',
    description: 'Pesquisa de intenção de voto para eleição municipal de 2026',
    status: 'active',
    channel: 'both',
    cities: ['João Pessoa', 'Campina Grande', 'Patos', 'Sousa', 'Cajazeiras', 'Bayeux'],
    createdAt: '2026-03-01',
    startsAt: '2026-03-10',
    endsAt: '2026-04-10',
  },
  {
    id: '2',
    title: 'Aprovação do prefeito – Mar/2026',
    description: 'Pesquisa de aprovação do prefeito em exercício',
    status: 'active',
    channel: 'whatsapp',
    cities: ['João Pessoa', 'Campina Grande', 'Bayeux'],
    createdAt: '2026-03-05',
    startsAt: '2026-03-15',
    endsAt: '2026-03-31',
  },
  {
    id: '3',
    title: 'Avaliação de serviços públicos',
    description: 'Avaliação da satisfação com serviços públicos municipais',
    status: 'closed',
    channel: 'form',
    cities: [
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
    ],
    createdAt: '2026-01-10',
    startsAt: '2026-01-20',
    endsAt: '2026-02-28',
  },
]

export const mockMetrics = {
  active: 2,
  responsesToday: 847,
  citiesCovered: 14,
}
