import React from 'react'

interface SectionTitleProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

export default function SectionTitle({ children, style }: SectionTitleProps) {
  return (
    <h2
      style={{
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--color-text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '12px',
        ...style,
      }}
    >
      {children}
    </h2>
  )
}
