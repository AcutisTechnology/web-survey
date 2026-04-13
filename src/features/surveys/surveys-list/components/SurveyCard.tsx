'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SurveyDefinition, Channel } from '@/shared/types'
import Card from '@/shared/components/ui/Card'
import Badge from '@/shared/components/ui/Badge'
import Button from '@/shared/components/ui/Button'
import { formatDateShort } from '@/shared/lib/demo-store'

interface SurveyCardProps {
  survey: SurveyDefinition
}

const channelLabel: Record<Channel, string> = {
  whatsapp: '📱 WhatsApp',
  form: '🔗 Anúncio',
  both: '📱+🔗 Ambos',
}

export default function SurveyCard({ survey }: SurveyCardProps) {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Card
        style={{
          boxShadow: hovered
            ? '0 4px 12px rgba(0,0,0,0.08)'
            : '0 1px 3px rgba(0,0,0,0.04)',
          transition: 'box-shadow 0.15s',
        }}
      >
        {/* Row 1: title + badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '6px',
          }}
        >
          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
            }}
          >
            {survey.title}
          </span>
          <Badge variant={survey.status} />
        </div>

        {/* Row 2: description */}
        <p
          style={{
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            margin: '0 0 8px 0',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.5',
          }}
        >
          {survey.description}
        </p>

        {/* Row 3: metadata */}
        <p
          style={{
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            margin: '0 0 12px 0',
          }}
        >
          {channelLabel[survey.channel]}
          {' · '}
          {survey.cities.length} municípios
          {' · '}
          {formatDateShort(survey.startsAt)} - {formatDateShort(survey.endsAt)}
        </p>

        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 12px 0' }}>
          {survey.questions.length} pergunta{survey.questions.length !== 1 ? 's' : ''}
          {' · '}
          target: {survey.targetConfig.gender === 'all' ? 'todos os generos' : survey.targetConfig.gender}
          {' · '}
          alcance estimado {survey.estimatedReach.toLocaleString('pt-BR')}
        </p>

        {/* Row 4: actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          {survey.status === 'active' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push(`/surveys/${survey.id}/realtime`)}
            >
              ◉ Tempo real
            </Button>
          )}
          {survey.status === 'active' && (survey.channel === 'form' || survey.channel === 'both') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/surveys/${survey.id}/form`)}
            >
              🔗 Formulário público
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/reports')}
          >
            Relatório
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => router.push('/surveys/new')}
          >
            Editar
          </Button>
        </div>
      </Card>
    </div>
  )
}
