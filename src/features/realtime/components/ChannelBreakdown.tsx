import React from 'react'
import ProgressBar from '@/shared/components/ui/ProgressBar'

interface ChannelBreakdownProps {
  whatsapp: number
  form: number
  total: number
}

export default function ChannelBreakdown({ whatsapp, form, total }: ChannelBreakdownProps) {
  const whatsappPct = total > 0 ? Math.round((whatsapp / total) * 100) : 0
  const formPct = total > 0 ? Math.round((form / total) * 100) : 0

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '5px',
            fontSize: '12px',
          }}
        >
          <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>WhatsApp</span>
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
            {whatsapp.toLocaleString('pt-BR')} ({whatsappPct}%)
          </span>
        </div>
        <ProgressBar value={whatsappPct} color="#25D366" height={7} />
      </div>

      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '5px',
            fontSize: '12px',
          }}
        >
          <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Anúncio / Form</span>
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
            {form.toLocaleString('pt-BR')} ({formPct}%)
          </span>
        </div>
        <ProgressBar value={formPct} color="#6366f1" height={7} />
      </div>
    </div>
  )
}
