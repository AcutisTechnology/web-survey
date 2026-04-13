import React from 'react'

interface CardProps {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
}

export default function Card({ children, style, className }: CardProps) {
  return (
    <div
      className={className}
      style={{
        backgroundColor: 'var(--color-background-primary)',
        border: '1px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-lg)',
        padding: '16px',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
