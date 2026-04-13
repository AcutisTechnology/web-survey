import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export default function Button({
  variant = 'default',
  size = 'md',
  children,
  style,
  ...props
}: ButtonProps) {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
    borderRadius: 'var(--border-radius-md)',
    transition: 'background 0.15s, border-color 0.15s',
    whiteSpace: 'nowrap',
  }

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { fontSize: '12px', padding: '5px 10px' },
    md: { fontSize: '13px', padding: '7px 14px' },
    lg: { fontSize: '14px', padding: '9px 18px' },
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      backgroundColor: 'var(--color-background-primary)',
      color: 'var(--color-text-primary)',
      border: '1px solid var(--color-border-secondary)',
    },
    primary: {
      backgroundColor: 'var(--color-brand)',
      color: '#ffffff',
      border: '1px solid var(--color-brand)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--color-brand)',
      border: '1px solid var(--color-brand)',
    },
  }

  return (
    <button
      style={{
        ...base,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  )
}
