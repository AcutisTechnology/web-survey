'use client'

import React from 'react'
import Button from '@/shared/components/ui/Button'

const selectStyle: React.CSSProperties = {
  padding: '7px 12px',
  fontSize: '13px',
  border: '1px solid var(--color-border-secondary)',
  borderRadius: 'var(--border-radius-md)',
  fontFamily: 'var(--font-sans)',
  color: 'var(--color-text-primary)',
  backgroundColor: 'var(--color-background-primary)',
  minWidth: '160px',
}

interface ExportFiltersProps {
  city: string
  channel: string
  targetStatus: string
  question: string
  onChange: (patch: Partial<{ city: string; channel: string; targetStatus: string; question: string }>) => void
  availableCities: string[]
  availableQuestions: string[]
  onClear: () => void
}

export default function ExportFilters({ city, channel, targetStatus, question, onChange, availableCities, availableQuestions, onClear }: ExportFiltersProps) {
  return (
    <div>
      <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
        Filtros de exportacao
      </h3>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={filterLabelStyle}>Cidade</label>
          <select style={selectStyle} value={city} onChange={(e) => onChange({ city: e.target.value })}>
            <option value="">Todas</option>
            {availableCities.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div>
          <label style={filterLabelStyle}>Canal</label>
          <select style={selectStyle} value={channel} onChange={(e) => onChange({ channel: e.target.value })}>
            <option value="">Todos</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="form">Anuncio</option>
            <option value="both">Ambos</option>
          </select>
        </div>

        <div>
          <label style={filterLabelStyle}>Pergunta</label>
          <select style={selectStyle} value={question} onChange={(e) => onChange({ question: e.target.value })}>
            <option value="">Todas</option>
            {availableQuestions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div>
          <label style={filterLabelStyle}>Target status</label>
          <select style={selectStyle} value={targetStatus} onChange={(e) => onChange({ targetStatus: e.target.value })}>
            <option value="">Todos</option>
            <option value="within_target">within_target</option>
            <option value="out_of_target">out_of_target</option>
            <option value="partial_target">partial_target</option>
            <option value="unqualified">unqualified</option>
          </select>
        </div>

        <Button variant="default" size="md" onClick={onClear}>
          Limpar
        </Button>
      </div>
    </div>
  )
}

const filterLabelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  color: 'var(--color-text-secondary)',
  marginBottom: '4px',
  fontWeight: 500,
}
