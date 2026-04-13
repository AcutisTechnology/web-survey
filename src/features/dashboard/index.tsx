'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import MetricCard from './components/MetricCard'
import SurveyListItem from './components/SurveyListItem'
import Card from '@/shared/components/ui/Card'
import Button from '@/shared/components/ui/Button'
import SectionTitle from '@/shared/components/ui/SectionTitle'
import type { SurveyDefinition } from '@/shared/types'
import { getAllSurveys, getDashboardMetrics } from '@/shared/lib/demo-store'

export default function DashboardScreen() {
  const [surveys, setSurveys] = useState<SurveyDefinition[]>([])
  const [metrics, setMetrics] = useState({ active: 0, responsesToday: 0, citiesCovered: 0 })

  useEffect(() => {
    setSurveys(getAllSurveys().slice(0, 4))
    setMetrics(getDashboardMetrics())
  }, [])

  return (
    <div style={{ maxWidth: '980px' }}>
      <SectionTitle>Resumo</SectionTitle>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <MetricCard
          label="Pesquisas ativas"
          value={metrics.active}
          description="em andamento"
          accent="var(--color-brand)"
        />
        <MetricCard
          label="Respostas hoje"
          value={metrics.responsesToday.toLocaleString('pt-BR')}
          description="estimativa com base no painel ao vivo"
        />
        <MetricCard
          label="Municipios cobertos"
          value={metrics.citiesCovered}
          description="em pesquisas ativas"
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <SectionTitle style={{ marginBottom: 0 }}>Pesquisas recentes</SectionTitle>
        <Link href="/surveys/new">
          <Button variant="primary" size="sm">
            + Nova pesquisa
          </Button>
        </Link>
      </div>

      <Card style={{ padding: 0 }}>
        {surveys.map((survey) => (
          <SurveyListItem key={survey.id} survey={survey} />
        ))}
      </Card>
    </div>
  )
}
