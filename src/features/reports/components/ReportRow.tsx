import React from 'react'
import type { ReportEntry } from '@/shared/types'
import Badge from '@/shared/components/ui/Badge'
import Button from '@/shared/components/ui/Button'

interface ReportRowProps {
  report: ReportEntry
  selected: boolean
  onSelect: () => void
  onExportCsv: () => void
  onExportPdf: () => void
}

export default function ReportRow({ report, selected, onSelect, onExportCsv, onExportPdf }: ReportRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: '1px solid var(--color-border-tertiary)',
        gap: '12px',
        backgroundColor: selected ? '#F8FBFF' : 'transparent',
      }}
    >
      <button onClick={onSelect} style={{ flex: 1, minWidth: 0, border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>{report.title}</span>
          <Badge variant={report.status === 'active' ? 'live' : report.status} />
        </div>
        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <span>{report.responses.toLocaleString('pt-BR')} respostas</span>
          <span>·</span>
          <span>{report.cities} cidades</span>
          <span>·</span>
          <span>{report.period}</span>
        </div>
      </button>

      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
        <Button variant="default" size="sm" onClick={onExportCsv}>
          CSV
        </Button>
        <Button variant="default" size="sm" onClick={onExportPdf}>
          PDF
        </Button>
      </div>
    </div>
  )
}
