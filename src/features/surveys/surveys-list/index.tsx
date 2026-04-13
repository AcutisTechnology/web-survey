'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { SurveyDefinition, SurveyStatus } from '@/shared/types'
import SectionTitle from '@/shared/components/ui/SectionTitle'
import Button from '@/shared/components/ui/Button'
import Card from '@/shared/components/ui/Card'
import SurveyCard from './components/SurveyCard'
import { getAllSurveys } from '@/shared/lib/demo-store'

type FilterTab = 'all' | SurveyStatus

const tabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'active', label: 'Ativas' },
  { key: 'closed', label: 'Encerradas' },
  { key: 'draft', label: 'Rascunhos' },
]

export default function SurveysListScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [surveys, setSurveys] = useState<SurveyDefinition[]>([])

  useEffect(() => {
    setSurveys(getAllSurveys())
  }, [])

  const filtered = useMemo(
    () =>
      activeFilter === 'all' ? surveys : surveys.filter((survey) => survey.status === activeFilter),
    [activeFilter, surveys],
  )

  return (
    <div style={{ maxWidth: '980px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <SectionTitle style={{ marginBottom: 0 }}>Pesquisas</SectionTitle>
        <Link href="/surveys/new">
          <Button variant="primary" size="sm">
            Nova pesquisa →
          </Button>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeFilter
          return (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              style={{
                padding: '5px 14px',
                fontSize: '12px',
                fontWeight: isActive ? 600 : 400,
                borderRadius: '20px',
                border: isActive
                  ? '1px solid var(--color-brand)'
                  : '1px solid var(--color-border-secondary)',
                backgroundColor: isActive ? 'var(--color-brand)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <Card
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 24px',
            gap: '8px',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '24px' }}>📋</span>
          <p style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>Nenhuma pesquisa encontrada</p>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>
            Nao ha pesquisas com o filtro selecionado.
          </p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((survey) => (
            <SurveyCard key={survey.id} survey={survey} />
          ))}
        </div>
      )}
    </div>
  )
}
