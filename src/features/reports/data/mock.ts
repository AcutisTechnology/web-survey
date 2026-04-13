import type { ReportEntry } from '@/shared/types'

export const mockReports: ReportEntry[] = [
  {
    id: '1',
    title: 'Intenção de voto – Eleição Municipal',
    responses: 847,
    cities: 6,
    period: '10/03/2026 – 10/04/2026',
    status: 'active',
  },
  {
    id: '2',
    title: 'Aprovação do prefeito – Mar/2026',
    responses: 412,
    cities: 3,
    period: '15/03/2026 – 31/03/2026',
    status: 'active',
  },
  {
    id: '3',
    title: 'Avaliação de serviços públicos',
    responses: 2340,
    cities: 10,
    period: '20/01/2026 – 28/02/2026',
    status: 'closed',
  },
]
