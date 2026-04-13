import React from 'react'

interface ProgressBarProps {
  value: number
  color?: string
  height?: number
  style?: React.CSSProperties
}

export default function ProgressBar({
  value,
  color = 'var(--color-brand)',
  height = 8,
  style,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div
      style={{
        width: '100%',
        height: `${height}px`,
        backgroundColor: 'var(--color-background-tertiary)',
        borderRadius: '999px',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          width: `${clamped}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: '999px',
          transition: 'width 0.5s ease',
        }}
      />
    </div>
  )
}
