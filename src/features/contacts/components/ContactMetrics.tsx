import React from 'react'
import Card from '@/shared/components/ui/Card'

interface ContactMetricsProps {
  total: number
  cities: number
  whatsappValid: number
}

export default function ContactMetrics({ total, cities, whatsappValid }: ContactMetricsProps) {
  const validPct = total > 0 ? Math.round((whatsappValid / total) * 100) : 0

  const metrics = [
    {
      label: 'Total de contatos',
      value: total.toLocaleString('pt-BR'),
      description: 'na base de dados',
      accent: 'var(--color-brand)',
    },
    {
      label: 'Municípios',
      value: cities,
      description: 'cidades mapeadas',
      accent: undefined,
    },
    {
      label: 'WhatsApp válido',
      value: whatsappValid.toLocaleString('pt-BR'),
      description: `${validPct}% do total`,
      accent: '#3B6D11',
    },
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
        marginBottom: '24px',
      }}
    >
      {metrics.map((m) => (
        <Card key={m.label}>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontWeight: 500,
            }}
          >
            {m.label}
          </div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: m.accent ?? 'var(--color-text-primary)',
              lineHeight: 1.1,
              marginBottom: '4px',
            }}
          >
            {m.value}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            {m.description}
          </div>
        </Card>
      ))}
    </div>
  )
}
