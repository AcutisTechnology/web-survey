import React from 'react'
import type { Channel } from '@/shared/types'

interface ChannelToggleProps {
  value: Channel
  onChange: (val: Channel) => void
}

const options: { value: Channel; label: string }[] = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'form', label: 'Anúncio' },
  { value: 'both', label: 'Ambos' },
]

export default function ChannelToggle({ value, onChange }: ChannelToggleProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        border: '1px solid var(--color-border-secondary)',
        borderRadius: 'var(--border-radius-md)',
        overflow: 'hidden',
      }}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          style={{
            padding: '7px 16px',
            fontSize: '13px',
            fontWeight: value === opt.value ? 600 : 400,
            cursor: 'pointer',
            border: 'none',
            borderRight: '1px solid var(--color-border-secondary)',
            backgroundColor: value === opt.value ? 'var(--color-brand)' : 'var(--color-background-primary)',
            color: value === opt.value ? '#ffffff' : 'var(--color-text-secondary)',
            transition: 'background 0.15s, color 0.15s',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
