'use client'

import React, { useEffect, useMemo, useState } from 'react'
import ReportRow from './components/ReportRow'
import ExportFilters from './components/ExportFilters'
import Card from '@/shared/components/ui/Card'
import SectionTitle from '@/shared/components/ui/SectionTitle'
import type { ExportRow, ReportEntry, SurveyDefinition } from '@/shared/types'
import { getAllSurveys, getExportRows, getReportEntries } from '@/shared/lib/demo-store'

function downloadCsv(rows: ExportRow[], reportTitle: string) {
  const header = 'id_resposta,id_pesquisa,cidade,canal,pergunta,resposta,data_hora,target_status'
  const lines = rows.map((row) => [
    row.responseId,
    row.surveyId,
    row.city,
    row.channel,
    row.question,
    row.answer,
    row.answeredAt,
    row.targetStatus,
  ].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
  const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${reportTitle.toLowerCase().replace(/\s+/g, '-')}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function openPdfPreview(report: ReportEntry, rows: ExportRow[]) {
  const popup = window.open('', '_blank', 'width=960,height=760')
  if (!popup) return
  const topRows = rows.slice(0, 12)
  popup.document.write(`
    <html>
      <head>
        <title>${report.title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #111827; }
          h1 { font-size: 20px; margin-bottom: 8px; }
          p { font-size: 13px; color: #4b5563; }
          table { width: 100%; border-collapse: collapse; margin-top: 18px; }
          th, td { border: 1px solid #e5e7eb; padding: 8px 10px; font-size: 12px; text-align: left; }
          th { background: #f3f4f6; }
          .note { margin-top: 18px; padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <h1>${report.title}</h1>
        <p>${report.responses.toLocaleString('pt-BR')} respostas · ${report.cities} cidades · ${report.period}</p>
        <div class="note">Respostas fora do target sao exibidas em secao separada no backend final. Este PDF do front serve como preview imprimivel.</div>
        <table>
          <thead>
            <tr>
              <th>Cidade</th>
              <th>Canal</th>
              <th>Pergunta</th>
              <th>Resposta</th>
              <th>Target status</th>
            </tr>
          </thead>
          <tbody>
            ${topRows.map((row) => `<tr><td>${row.city}</td><td>${row.channel}</td><td>${row.question}</td><td>${row.answer}</td><td>${row.targetStatus}</td></tr>`).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `)
  popup.document.close()
  popup.focus()
}

export default function ReportsScreen() {
  const [reports, setReports] = useState<ReportEntry[]>([])
  const [surveys, setSurveys] = useState<SurveyDefinition[]>([])
  const [selectedId, setSelectedId] = useState('1')
  const [filters, setFilters] = useState({ city: '', channel: '', targetStatus: '', question: '' })

  useEffect(() => {
    setReports(getReportEntries())
    setSurveys(getAllSurveys())
  }, [])

  const selectedReport = reports.find((report) => report.id === selectedId) ?? reports[0]
  const selectedSurvey = surveys.find((survey) => survey.id === selectedId) ?? surveys[0]
  const rows = useMemo(() => selectedReport ? getExportRows(selectedReport.id) : [], [selectedReport])

  const filteredRows = useMemo(
    () => rows.filter((row) => {
      if (filters.city && row.city !== filters.city) return false
      if (filters.channel && row.channel !== filters.channel && !(filters.channel === 'both' && ['whatsapp', 'form'].includes(row.channel))) return false
      if (filters.targetStatus && row.targetStatus !== filters.targetStatus) return false
      if (filters.question && row.question !== filters.question) return false
      return true
    }),
    [filters, rows],
  )

  return (
    <div style={{ maxWidth: '1080px' }}>
      <SectionTitle>Pesquisas disponiveis</SectionTitle>
      <Card style={{ padding: 0, marginBottom: '24px' }}>
        {reports.map((report) => (
          <ReportRow
            key={report.id}
            report={report}
            selected={report.id === selectedId}
            onSelect={() => setSelectedId(report.id)}
            onExportCsv={() => downloadCsv(getExportRows(report.id), report.title)}
            onExportPdf={() => openPdfPreview(report, getExportRows(report.id))}
          />
        ))}
      </Card>

      <Card>
        <ExportFilters
          city={filters.city}
          channel={filters.channel}
          targetStatus={filters.targetStatus}
          question={filters.question}
          onChange={(patch) => setFilters((current) => ({ ...current, ...patch }))}
          availableCities={selectedSurvey?.cities ?? []}
          availableQuestions={selectedSurvey?.questions.map((question) => question.text) ?? []}
          onClear={() => setFilters({ city: '', channel: '', targetStatus: '', question: '' })}
        />

        <div style={{ marginTop: '18px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'center' }}>
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            Preview com {filteredRows.length.toLocaleString('pt-BR')} linhas prontas para exportacao bruta.
          </div>
          {selectedReport && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => downloadCsv(filteredRows, selectedReport.title)} style={actionButtonStyle}>Baixar CSV filtrado</button>
              <button onClick={() => openPdfPreview(selectedReport, filteredRows)} style={actionButtonStyle}>Abrir PDF</button>
            </div>
          )}
        </div>

        <div style={{ marginTop: '16px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-background-secondary)' }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Cidade</th>
                <th style={thStyle}>Canal</th>
                <th style={thStyle}>Pergunta</th>
                <th style={thStyle}>Resposta</th>
                <th style={thStyle}>Target status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.slice(0, 18).map((row) => (
                <tr key={row.responseId} style={{ borderTop: '1px solid var(--color-border-tertiary)' }}>
                  <td style={tdStyle}>{row.responseId}</td>
                  <td style={tdStyle}>{row.city}</td>
                  <td style={tdStyle}>{row.channel}</td>
                  <td style={tdStyle}>{row.question}</td>
                  <td style={tdStyle}>{row.answer}</td>
                  <td style={tdStyle}>{row.targetStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

const actionButtonStyle: React.CSSProperties = {
  padding: '7px 12px',
  borderRadius: 'var(--border-radius-md)',
  border: '1px solid var(--color-border-secondary)',
  backgroundColor: '#fff',
  cursor: 'pointer',
}

const thStyle: React.CSSProperties = {
  padding: '8px 12px',
  textAlign: 'left',
}

const tdStyle: React.CSSProperties = {
  padding: '8px 12px',
}
