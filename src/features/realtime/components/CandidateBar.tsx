import React from 'react'
import ProgressBar from '@/shared/components/ui/ProgressBar'

interface CandidateBarProps {
  option: {
    text: string
    pct: number
    color: string
  }
  total: number
}

export default function CandidateBar({ option, total }: CandidateBarProps) {
  const count = Math.round((option.pct / 100) * total)

  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: option.color, flexShrink: 0 }} />
          <span style={{ fontSize: '13px', fontWeight: 500 }}>{option.text}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: option.color }}>{option.pct}%</span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            ({count.toLocaleString('pt-BR')} resp.)
          </span>
        </div>
      </div>
      <ProgressBar value={option.pct} color={option.color} height={10} />
    </div>
  )
}
