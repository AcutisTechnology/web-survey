import React from 'react'
import type { TargetStatus } from '@/shared/types'

interface ThankYouScreenProps {
  targetStatus: TargetStatus
  geolocationLabel?: string | null
}

const copyMap: Record<TargetStatus, { icon: string; title: string; body: string }> = {
  within_target: {
    icon: '🎉',
    title: 'Obrigado pela sua participacao!',
    body: 'Sua resposta foi registrada com sucesso e entrara no consolidado principal desta pesquisa.',
  },
  out_of_target: {
    icon: '📋',
    title: 'Resposta recebida',
    body: 'Sua resposta foi registrada, mas ficara separada do consolidado principal por estar fora do target configurado.',
  },
  partial_target: {
    icon: '📊',
    title: 'Resposta recebida parcialmente no target',
    body: 'Sua resposta foi salva e aparecera na visao estatistica separada como parcial.',
  },
  unqualified: {
    icon: '📝',
    title: 'Resposta recebida como nao qualificada',
    body: 'A pesquisa foi registrada, mas faltaram dados de qualificacao para entrar no consolidado oficial.',
  },
}

export default function ThankYouScreen({ targetStatus, geolocationLabel }: ThankYouScreenProps) {
  const copy = copyMap[targetStatus]

  return (
    <div style={{ textAlign: 'center', padding: '16px 0' }}>
      <div style={{ fontSize: '44px', marginBottom: '16px' }}>{copy.icon}</div>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', marginBottom: '10px' }}>{copy.title}</h2>
      <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.7, marginBottom: '18px' }}>{copy.body}</p>

      <div style={{ backgroundColor: '#F3F4F6', borderRadius: '8px', padding: '12px 16px', fontSize: '12px', color: '#6b7280', marginBottom: '20px', textAlign: 'left' }}>
        <strong style={{ color: '#1a1a1a' }}>Status estatistico:</strong> {targetStatus}
        <br />
        Timestamp de envio capturado no front. {geolocationLabel ? `Geolocalizacao: ${geolocationLabel}.` : 'Geolocalizacao nao autorizada ou indisponivel.'}
      </div>

      <div style={{ width: '48px', height: '4px', backgroundColor: '#185FA5', borderRadius: '4px', margin: '0 auto' }} />
    </div>
  )
}
