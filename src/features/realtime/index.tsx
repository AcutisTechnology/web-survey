'use client'

import React, { useEffect, useMemo, useState } from 'react'
import CandidateBar from './components/CandidateBar'
import MapView from './components/MapView'
import ChannelBreakdown from './components/ChannelBreakdown'
import Card from '@/shared/components/ui/Card'
import SectionTitle from '@/shared/components/ui/SectionTitle'
import Badge from '@/shared/components/ui/Badge'
import type { RealtimeCityResult, RealtimeSnapshot, SurveyDefinition } from '@/shared/types'
import { getRealtimeSnapshot, getSurveyById } from '@/shared/lib/demo-store'

interface RealtimeScreenProps {
  surveyId: string
}

export default function RealtimeScreen({ surveyId }: RealtimeScreenProps) {
  const [survey, setSurvey] = useState<SurveyDefinition | null>(null)
  const [snapshot, setSnapshot] = useState<RealtimeSnapshot | null>(null)
  const [showOnlyTarget, setShowOnlyTarget] = useState(true)
  const [selectedCity, setSelectedCity] = useState<RealtimeCityResult | null>(null)

  function reloadSnapshot() {
    const nextSnapshot = getRealtimeSnapshot(surveyId)
    setSnapshot(nextSnapshot)
    setSelectedCity((current) => {
      if (!current) return nextSnapshot.cities[0] ?? null
      return nextSnapshot.cities.find((city) => city.id === current.id) ?? nextSnapshot.cities[0] ?? null
    })
  }

  useEffect(() => {
    setSurvey(getSurveyById(surveyId) ?? null)
    reloadSnapshot()
  }, [surveyId])

  useEffect(() => {
    if (!snapshot) return
    const interval = window.setInterval(() => {
      reloadSnapshot()
    }, 15000)

    const handleStorage = (event: StorageEvent) => {
      if (event.key?.includes('surveyops_form_submissions')) {
        reloadSnapshot()
      }
    }

    window.addEventListener('storage', handleStorage)

    return () => {
      window.clearInterval(interval)
      window.removeEventListener('storage', handleStorage)
    }
  }, [showOnlyTarget, snapshot, surveyId])

  const activeSnapshot = useMemo(() => snapshot, [snapshot])
  const selectedDetails = selectedCity ?? activeSnapshot?.cities[0] ?? null

  if (!activeSnapshot || !survey) {
    return <div>Carregando painel...</div>
  }

  const activeTotal = showOnlyTarget ? activeSnapshot.targetResponses : activeSnapshot.totalResponses
  const activeWhatsapp = showOnlyTarget ? activeSnapshot.targetWhatsappCount : activeSnapshot.whatsappCount
  const activeForm = showOnlyTarget ? activeSnapshot.targetFormCount : activeSnapshot.formCount

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700 }}>{survey.title}</h2>
          <Badge variant="live" />
          {(survey.channel === 'form' || survey.channel === 'both') && (
            <button
              onClick={() => window.open(`/surveys/${survey.id}/form`, '_blank', 'noopener,noreferrer')}
              style={{
                padding: '6px 10px',
                borderRadius: '999px',
                border: '1px solid var(--color-brand)',
                backgroundColor: '#EBF3FB',
                color: 'var(--color-brand)',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              Abrir formulario publico ↗
            </button>
          )}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
          {activeSnapshot.totalResponses.toLocaleString('pt-BR')} respostas ({activeSnapshot.targetResponses.toLocaleString('pt-BR')} no target)
          {' · '}
          atualizacao simulada a cada 15 segundos
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        <Card style={{ flex: '0 0 auto', minWidth: '200px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {showOnlyTarget ? 'No target' : 'Total bruto'}
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-brand)', fontVariantNumeric: 'tabular-nums' }}>
            {activeTotal.toLocaleString('pt-BR')}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Fora do target: {activeSnapshot.outsideTargetCount} · Parcial: {activeSnapshot.partialTargetCount}
          </div>
        </Card>

        <button
          onClick={() => setShowOnlyTarget((value) => !value)}
          style={{
            padding: '8px 14px',
            fontSize: '12px',
            borderRadius: '20px',
            border: `1px solid ${showOnlyTarget ? 'var(--color-brand)' : 'var(--color-border-secondary)'}`,
            backgroundColor: showOnlyTarget ? '#EBF3FB' : 'var(--color-background-primary)',
            color: showOnlyTarget ? 'var(--color-brand)' : 'var(--color-text-secondary)',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {showOnlyTarget ? 'Exibindo apenas no target' : 'Exibir apenas respondentes no target'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 0.9fr) minmax(520px, 1.4fr)', gap: '16px', alignItems: 'start' }}>
        <div>
          <Card>
            <SectionTitle>Resultado consolidado</SectionTitle>
            {activeSnapshot.options.map((option) => (
              <CandidateBar
                key={option.id}
                option={{
                  text: option.text,
                  color: option.color,
                  pct: showOnlyTarget ? option.pctInTarget : option.pct,
                }}
                total={activeTotal}
              />
            ))}
          </Card>

          <Card style={{ marginTop: '12px' }}>
            <SectionTitle>Distribuicao por canal</SectionTitle>
            <ChannelBreakdown whatsapp={activeWhatsapp} form={activeForm} total={activeTotal} />
          </Card>

          <Card style={{ marginTop: '12px' }}>
            <SectionTitle>Recortes estatisticos</SectionTitle>
            <div style={{ display: 'grid', gap: '10px', fontSize: '13px' }}>
              <div>within_target: {activeSnapshot.targetResponses.toLocaleString('pt-BR')}</div>
              <div>out_of_target: {activeSnapshot.outsideTargetCount.toLocaleString('pt-BR')}</div>
              <div>partial_target: {activeSnapshot.partialTargetCount.toLocaleString('pt-BR')}</div>
              <div>unqualified: {activeSnapshot.unqualifiedCount.toLocaleString('pt-BR')}</div>
            </div>
          </Card>
        </div>

        <div>
          <Card style={{ padding: '14px' }}>
            <SectionTitle>Mapa de municipios</SectionTitle>
            <MapView
              cities={activeSnapshot.cities}
              selectedCityId={selectedDetails?.id ?? null}
              onSelectCity={setSelectedCity}
            />
          </Card>

          <Card style={{ marginTop: '12px', padding: 0 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-tertiary)' }}>
              <SectionTitle style={{ marginBottom: 0 }}>Breakdown por cidade</SectionTitle>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-background-secondary)' }}>
                  <th style={{ padding: '8px 16px', textAlign: 'left' }}>Cidade</th>
                  {activeSnapshot.options.slice(0, 3).map((option) => (
                    <th key={option.id} style={{ padding: '8px 12px', textAlign: 'center', color: option.color }}>
                      {option.text}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeSnapshot.cities.map((city) => (
                  <tr
                    key={city.id}
                    style={{ borderTop: '1px solid var(--color-border-tertiary)', cursor: 'pointer' }}
                    onClick={() => setSelectedCity(city)}
                  >
                    <td style={{ padding: '8px 16px', fontWeight: 500 }}>{city.name}</td>
                    {activeSnapshot.options.slice(0, 3).map((option) => (
                      <td key={option.id} style={{ padding: '8px 12px', textAlign: 'center', color: city.leadingOption === option.text ? option.color : 'var(--color-text-secondary)', fontWeight: city.leadingOption === option.text ? 700 : 400 }}>
                        {city.breakdown[option.text]?.pct.toFixed(1).replace('.', ',') ?? '0,0'}%
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  )
}
