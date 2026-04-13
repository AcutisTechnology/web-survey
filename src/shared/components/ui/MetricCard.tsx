import React from 'react'
import Card from './Card'

interface MetricCardProps {
  label: string
  value: string | number
  description?: string
  accent?: string
}

export default function MetricCard({ label, value, description, accent }: MetricCardProps) {
  return (
    <Card>
      <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
        {label}
      </div>
      <div
        style={{
          fontSize: '28px',
          fontWeight: 700,
          color: accent ?? 'var(--color-text-primary)',
          lineHeight: 1.1,
          marginBottom: description ? '4px' : 0,
        }}
      >
        {value}
      </div>
      {description && (
        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          {description}
        </div>
      )}
    </Card>
  )
}
