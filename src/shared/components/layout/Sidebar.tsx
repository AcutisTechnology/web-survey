'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  label: string
  href: string
  icon: string
}

const navItems: NavItem[] = [
  { label: 'Painel geral', href: '/dashboard', icon: '⊞' },
  { label: 'Pesquisas', href: '/surveys', icon: '◫' },
  { label: 'Tempo real', href: '/surveys/1/realtime', icon: '◉' },
  { label: 'Relatórios', href: '/reports', icon: '≡' },
  { label: 'Contatos', href: '/contacts', icon: '●' },
]

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard' || pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <aside
      style={{
        width: '180px',
        flexShrink: 0,
        backgroundColor: 'var(--color-background-primary)',
        borderRight: '1px solid var(--color-border-tertiary)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid var(--color-border-tertiary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          height: '52px',
        }}
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            backgroundColor: 'var(--color-brand)',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>S</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-text-primary)' }}>
          SurveyOps
        </span>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '8px 0' }}>
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 16px',
                fontSize: '13px',
                fontWeight: active ? 600 : 400,
                color: active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                textDecoration: 'none',
                backgroundColor: active ? 'var(--color-background-secondary)' : 'transparent',
                borderLeft: active ? '2px solid var(--color-brand)' : '2px solid transparent',
                transition: 'background 0.1s',
              }}
            >
              <span style={{ fontSize: '14px', lineHeight: 1, width: '16px', textAlign: 'center' }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--color-border-tertiary)',
          fontSize: '11px',
          color: 'var(--color-text-secondary)',
        }}
      >
        v1.0.0
      </div>
    </aside>
  )
}
