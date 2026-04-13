import React from 'react'

interface DuplicateBlockProps {
  surveyTitle: string
}

export default function DuplicateBlock({ surveyTitle }: DuplicateBlockProps) {
  return (
    <div style={{ textAlign: 'center', padding: '16px 0' }}>
      <div style={{ fontSize: '40px', marginBottom: '16px' }}>🚫</div>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px' }}>
        Resposta já registrada
      </h2>
      <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6, marginBottom: '20px' }}>
        Identificamos que você já respondeu à pesquisa{' '}
        <strong style={{ color: '#1a1a1a' }}>{surveyTitle}</strong> neste dispositivo.
        <br />
        Cada participante pode responder apenas uma vez.
      </p>
      <div
        style={{
          backgroundColor: '#FEF3C7',
          border: '1px solid #FCD34D',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '12px',
          color: '#92400E',
          textAlign: 'left',
        }}
      >
        <strong>Por que isso acontece?</strong>
        <br />
        Para garantir a integridade dos dados, utilizamos uma identificação anônima do seu
        dispositivo. Isso evita respostas duplicadas sem armazenar seus dados pessoais.
      </div>
    </div>
  )
}
