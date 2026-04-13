'use client'

import React from 'react'
import Button from '@/shared/components/ui/Button'
import type { Channel, SurveyQuestionDefinition, TargetConfig } from '@/shared/types'
import { formatDateShort, formatEducationLabel, formatGenderLabel } from '@/shared/lib/demo-store'

interface DispatchConfirmModalProps {
  summary: {
    title: string
    channel: Channel
    startsAt: string
    endsAt: string
    targetConfig: TargetConfig
    questions: SurveyQuestionDefinition[]
    cityBreakdown: { city: string; contacts: number; whatsappValid: number }[]
    estimatedReach: number
    estimatedCost: number
  }
  onConfirm: () => void
  onCancel: () => void
}

function channelLabel(channel: Channel): string {
  if (channel === 'whatsapp') return 'WhatsApp'
  if (channel === 'form') return 'Anuncio / formulario web'
  return 'WhatsApp + formulario web'
}

const summaryLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--color-text-secondary)',
  marginBottom: '2px',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
}

const summaryValueStyle: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--color-text-primary)',
  fontWeight: 500,
}

export default function DispatchConfirmModal({ summary, onConfirm, onCancel }: DispatchConfirmModalProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-background-primary)',
          borderRadius: '12px',
          padding: '28px',
          maxWidth: '720px',
          width: '100%',
          margin: '0 16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        }}
      >
        <div style={{ marginBottom: '8px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Confirmar disparo</h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px', marginBottom: 0 }}>
            Resumo pre-disparo com alcance, canais e recorte territorial afetado.
          </p>
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--color-border-tertiary)', margin: '16px 0' }} />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '18px',
          }}
        >
          <div>
            <p style={summaryLabelStyle}>Pesquisa</p>
            <p style={summaryValueStyle}>{summary.title}</p>
          </div>
          <div>
            <p style={summaryLabelStyle}>Canal</p>
            <p style={summaryValueStyle}>{channelLabel(summary.channel)}</p>
          </div>
          <div>
            <p style={summaryLabelStyle}>Periodo</p>
            <p style={summaryValueStyle}>
              {formatDateShort(summary.startsAt)} - {formatDateShort(summary.endsAt)}
            </p>
          </div>
          <div>
            <p style={summaryLabelStyle}>Perguntas</p>
            <p style={summaryValueStyle}>{summary.questions.length}</p>
          </div>
          <div>
            <p style={summaryLabelStyle}>Target genero</p>
            <p style={summaryValueStyle}>{formatGenderLabel(summary.targetConfig.gender)}</p>
          </div>
          <div>
            <p style={summaryLabelStyle}>Escolaridade</p>
            <p style={summaryValueStyle}>
              {summary.targetConfig.educationEnabled
                ? formatEducationLabel(summary.targetConfig.education)
                : 'Nao habilitada'}
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '16px',
            alignItems: 'start',
          }}
        >
          <div
            style={{
              border: '1px solid var(--color-border-tertiary)',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '12px 14px', backgroundColor: 'var(--color-background-secondary)', fontWeight: 600 }}>
              Contatos afetados por cidade
            </div>
            <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
              {summary.cityBreakdown.map((city) => (
                <div
                  key={city.city}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto',
                    gap: '14px',
                    padding: '11px 14px',
                    borderTop: '1px solid var(--color-border-tertiary)',
                    fontSize: '12px',
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{city.city}</span>
                  <span>{city.contacts.toLocaleString('pt-BR')} contatos</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    {city.whatsappValid.toLocaleString('pt-BR')} WA validos
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div
              style={{
                backgroundColor: '#EBF3FB',
                borderRadius: '10px',
                padding: '14px',
                marginBottom: '12px',
              }}
            >
              <p style={summaryLabelStyle}>Alcance estimado</p>
              <p style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-brand)', margin: '0 0 4px 0' }}>
                {summary.estimatedReach.toLocaleString('pt-BR')}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>
                contatos elegiveis no front atual
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#F7F8FA',
                borderRadius: '10px',
                padding: '14px',
              }}
            >
              <p style={summaryLabelStyle}>Custo estimado</p>
              <p style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px 0' }}>
                R$ {summary.estimatedCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>
                simulacao para integracao futura com provedor de envio
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
          <Button variant="default" size="md" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="primary" size="md" onClick={onConfirm}>
            Confirmar e ativar →
          </Button>
        </div>
      </div>
    </div>
  )
}
