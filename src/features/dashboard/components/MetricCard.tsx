import React from 'react'
import Card from '@/shared/components/ui/Card'

interface MetricCardProps {
  label: string
  value: string | number
  description?: string
  accent?: string
}

export default function MetricCard({ label, value, description, accent }: MetricCardProps) {
  return (
    <Card>
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
        {label}
      </div>
      <div
        style={{
          fontSize: '30px',
          fontWeight: 700,
          color: accent ?? 'var(--color-text-primary)',
          lineHeight: 1.1,
          marginBottom: description ? '4px' : 0,
        }}
      >
        {value}
      </div>
      {description && (
        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          {description}
        </div>
      )}
    </Card>
  )
}
