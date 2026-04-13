import React from 'react'
import ProgressBar from '@/shared/components/ui/ProgressBar'

interface CityDist {
  city: string
  count: number
  pct: number
}

interface CityDistributionProps {
  data: CityDist[]
}

const colors = ['var(--color-brand)', '#3B6D11', '#888780']

export default function CityDistribution({ data }: CityDistributionProps) {
  return (
    <div>
      {data.map((item, idx) => (
        <div key={item.city} style={{ marginBottom: '14px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '5px',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
              {item.city}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              {item.count.toLocaleString('pt-BR')} ({item.pct}%)
            </span>
          </div>
          <ProgressBar value={item.pct} color={colors[idx % colors.length]} height={8} />
        </div>
      ))}
    </div>
  )
}
