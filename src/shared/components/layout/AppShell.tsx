'use client'

import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'var(--color-background-secondary)',
      }}
    >
      <Sidebar />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        <Topbar />
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
