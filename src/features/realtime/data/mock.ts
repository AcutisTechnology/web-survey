export interface RealtimeOption {
  id: string
  text: string
  pct: number
  pctInTarget: number
  color: string
  byCity: Record<string, { pct: number }>
}

export interface RealtimeCity {
  name: string
  lat: number
  lng: number
  top: string
  left: string
  leadingOption: string
  leadingColor: string
}

export interface RealtimeData {
  surveyTitle: string
  totalResponses: number
  whatsappCount: number
  formCount: number
  targetResponses: number
  targetWhatsappCount: number
  targetFormCount: number
  options: RealtimeOption[]
  cities: RealtimeCity[]
}

export const mockRealtimeData: RealtimeData = {
  surveyTitle: 'Intenção de voto – Eleição Municipal',
  totalResponses: 847,
  whatsappCount: 612,
  formCount: 235,
  targetResponses: 612,
  targetWhatsappCount: 480,
  targetFormCount: 132,
  options: [
    {
      id: '1',
      text: 'Candidato A',
      pct: 38,
      pctInTarget: 42,
      color: '#185FA5',
      byCity: {
        'João Pessoa': { pct: 41 },
        'Campina Grande': { pct: 31 },
        Patos: { pct: 44 },
        Sousa: { pct: 29 },
        Cajazeiras: { pct: 39 },
        Bayeux: { pct: 33 },
      },
    },
    {
      id: '2',
      text: 'Candidato B',
      pct: 27,
      pctInTarget: 24,
      color: '#993C1D',
      byCity: {
        'João Pessoa': { pct: 25 },
        'Campina Grande': { pct: 35 },
        Patos: { pct: 22 },
        Sousa: { pct: 26 },
        Cajazeiras: { pct: 28 },
        Bayeux: { pct: 38 },
      },
    },
    {
      id: '3',
      text: 'Candidato C',
      pct: 21,
      pctInTarget: 22,
      color: '#3B6D11',
      byCity: {
        'João Pessoa': { pct: 22 },
        'Campina Grande': { pct: 20 },
        Patos: { pct: 19 },
        Sousa: { pct: 33 },
        Cajazeiras: { pct: 18 },
        Bayeux: { pct: 17 },
      },
    },
    {
      id: '4',
      text: 'Nenhum / branco',
      pct: 14,
      pctInTarget: 12,
      color: '#888780',
      byCity: {},
    },
  ],
  cities: [
    {
      name: 'João Pessoa',
      lat: -7.115,
      lng: -34.861,
      top: '40%',
      left: '30%',
      leadingOption: 'Candidato A',
      leadingColor: '#185FA5',
    },
    {
      name: 'Campina Grande',
      lat: -7.23,
      lng: -35.88,
      top: '30%',
      left: '55%',
      leadingOption: 'Candidato B',
      leadingColor: '#993C1D',
    },
    {
      name: 'Patos',
      lat: -7.02,
      lng: -37.28,
      top: '55%',
      left: '70%',
      leadingOption: 'Candidato A',
      leadingColor: '#185FA5',
    },
    {
      name: 'Sousa',
      lat: -6.75,
      lng: -38.23,
      top: '65%',
      left: '45%',
      leadingOption: 'Candidato C',
      leadingColor: '#3B6D11',
    },
    {
      name: 'Cajazeiras',
      lat: -6.89,
      lng: -38.56,
      top: '25%',
      left: '80%',
      leadingOption: 'Candidato A',
      leadingColor: '#185FA5',
    },
    {
      name: 'Bayeux',
      lat: -7.12,
      lng: -34.93,
      top: '75%',
      left: '25%',
      leadingOption: 'Candidato B',
      leadingColor: '#993C1D',
    },
  ],
}
