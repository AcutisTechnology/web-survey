'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import ContactMetrics from './components/ContactMetrics'
import CityDistribution from './components/CityDistribution'
import Card from '@/shared/components/ui/Card'
import Button from '@/shared/components/ui/Button'
import SectionTitle from '@/shared/components/ui/SectionTitle'
import type { ContactRecord } from '@/shared/types'
import { getContactMetrics, getContacts, importContactsFromCsv } from '@/shared/lib/demo-store'

export default function ContactsScreen() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [contacts, setContacts] = useState<ContactRecord[]>([])
  const [lastImported, setLastImported] = useState<ContactRecord[]>([])

  useEffect(() => {
    setContacts(getContacts())
  }, [])

  const metrics = useMemo(() => getContactMetrics(), [contacts])

  function handleImport() {
    fileInputRef.current?.click()
  }

  async function readCsv(file: File) {
    const text = await file.text()
    const imported = importContactsFromCsv(text)
    setLastImported(imported)
    setContacts(getContacts())
  }

  return (
    <div style={{ maxWidth: '980px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <SectionTitle style={{ marginBottom: 0 }}>Base de contatos</SectionTitle>
        <Button variant="primary" size="md" onClick={handleImport}>
          ↑ Importar CSV
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void readCsv(file)
          }}
        />
      </div>

      <ContactMetrics total={metrics.total} cities={metrics.cities} whatsappValid={metrics.whatsappValid} />

      <Card>
        <SectionTitle>Distribuicao por municipio</SectionTitle>
        <CityDistribution data={metrics.byCity.slice(0, 8)} />
      </Card>

      <Card style={{ marginTop: '16px' }}>
        <SectionTitle>Formato esperado para importacao</SectionTitle>
        <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
          CSV com cabecalho: <code>nome,telefone,cidade,estado</code>. Os telefones sao normalizados no front para E.164 (+55...).
        </div>
      </Card>

      <Card style={{ marginTop: '16px' }}>
        <SectionTitle>Ultimos contatos importados</SectionTitle>
        {lastImported.length === 0 ? (
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            Nenhuma importacao recente nesta sessao.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-background-secondary)' }}>
                <th style={tableHead}>Nome</th>
                <th style={tableHead}>Telefone bruto</th>
                <th style={tableHead}>Telefone normalizado</th>
                <th style={tableHead}>Cidade</th>
                <th style={tableHead}>WhatsApp</th>
              </tr>
            </thead>
            <tbody>
              {lastImported.map((contact) => (
                <tr key={contact.id} style={{ borderTop: '1px solid var(--color-border-tertiary)' }}>
                  <td style={tableCell}>{contact.name}</td>
                  <td style={tableCell}>{contact.phoneRaw}</td>
                  <td style={tableCell}>{contact.phoneE164 || 'invalido'}</td>
                  <td style={tableCell}>{contact.city}</td>
                  <td style={tableCell}>{contact.whatsappValid ? 'valido' : 'pendente'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}

const tableHead: React.CSSProperties = {
  padding: '8px 12px',
  textAlign: 'left',
}

const tableCell: React.CSSProperties = {
  padding: '8px 12px',
}
