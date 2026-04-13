import React from 'react'
import Link from 'next/link'
import type { Survey } from '@/shared/types'
import Badge from '@/shared/components/ui/Badge'
import Button from '@/shared/components/ui/Button'

interface SurveyListItemProps {
  survey: Survey
}

const channelLabel: Record<string, string> = {
  whatsapp: 'WhatsApp',
  form: 'Anúncio',
  both: 'WhatsApp + Anúncio',
}

export default function SurveyListItem({ survey }: SurveyListItemProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: '1px solid var(--color-border-tertiary)',
        gap: '12px',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {survey.title}
          </span>
          <Badge variant={survey.status === 'active' ? 'live' : survey.status} />
        </div>
        <div
          style={{
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <span>Canal: {channelLabel[survey.channel]}</span>
          <span>·</span>
          <span>{survey.cities.length} cidade{survey.cities.length !== 1 ? 's' : ''}</span>
          <span>·</span>
          <span>Início: {new Date(survey.startsAt).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
        {survey.status === 'active' && (
          <Link href={`/surveys/${survey.id}/realtime`}>
            <Button variant="outline" size="sm">
              Tempo real
            </Button>
          </Link>
        )}
        <Link href={`/reports`}>
          <Button variant="default" size="sm">
            Relatório
          </Button>
        </Link>
      </div>
    </div>
  )
}
