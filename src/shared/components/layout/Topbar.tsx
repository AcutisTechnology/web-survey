'use client'

import { usePathname } from 'next/navigation'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Painel geral',
  '/surveys': 'Pesquisas',
  '/surveys/new': 'Nova pesquisa',
  '/reports': 'Relatórios',
  '/contacts': 'Contatos',
}

function getTitle(pathname: string): string {
  if (pathname.endsWith('/realtime')) return 'Tempo real'
  return pageTitles[pathname] ?? 'SurveyOps'
}

export default function Topbar() {
  const pathname = usePathname()
  const title = getTitle(pathname)

  return (
    <header
      style={{
        height: '52px',
        backgroundColor: 'var(--color-background-primary)',
        borderBottom: '1px solid var(--color-border-tertiary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        flexShrink: 0,
      }}
    >
      <h1 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
        {title}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: '#EAF3DE',
            color: '#3B6D11',
            border: '1px solid #c3e09a',
            padding: '3px 10px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 500,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#3B6D11',
            }}
          />
          2 ao vivo
        </span>
      </div>
    </header>
  )
}
