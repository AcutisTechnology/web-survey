import React from 'react'

type BadgeVariant = 'live' | 'draft' | 'closed' | 'active'

interface BadgeProps {
  variant: BadgeVariant
  children?: React.ReactNode
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  live: {
    backgroundColor: '#EAF3DE',
    color: '#3B6D11',
    border: '1px solid #c3e09a',
  },
  active: {
    backgroundColor: '#EAF3DE',
    color: '#3B6D11',
    border: '1px solid #c3e09a',
  },
  draft: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    border: '1px solid #d1d5db',
  },
  closed: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    border: '1px solid #d1d5db',
  },
}

const variantLabels: Record<BadgeVariant, string> = {
  live: '● Ao vivo',
  active: '● Ativo',
  draft: 'Rascunho',
  closed: 'Encerrado',
}

export default function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      style={{
        ...variantStyles[variant],
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {children ?? variantLabels[variant]}
    </span>
  )
}
