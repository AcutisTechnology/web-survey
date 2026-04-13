'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { RealtimeCityResult } from '@/shared/types'
import ProgressBar from '@/shared/components/ui/ProgressBar'

interface MapViewProps {
  cities: RealtimeCityResult[]
  selectedCityId: string | null
  onSelectCity: (city: RealtimeCityResult) => void
}

function normalizeSvgMarkup(rawSvg: string) {
  return rawSvg
    .replace(/width="[^"]*"/i, 'width="100%"')
    .replace(/height="[^"]*"/i, 'height="100%"')
    .replace('<svg', '<svg preserveAspectRatio="xMidYMid meet"')
}

export default function MapView({ cities, selectedCityId, onSelectCity }: MapViewProps) {
  const [svgHtml, setSvgHtml] = useState('')
  const containerRef = useRef<HTMLDivElement | null>(null)

  const cityMap = useMemo(() => new Map(cities.map((city) => [city.mapId, city])), [cities])
  const selectedCity = cities.find((city) => city.id === selectedCityId) ?? cities[0] ?? null

  useEffect(() => {
    let active = true

    async function loadSvg() {
      const response = await fetch('/PB_Microregions.svg')
      const text = await response.text()
      if (active) {
        setSvgHtml(normalizeSvgMarkup(text))
      }
    }

    void loadSvg()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current || !svgHtml) return

    const root = containerRef.current
    const svg = root.querySelector('svg')
    if (!svg) return

    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
    svg.style.display = 'block'
    svg.style.width = '100%'
    svg.style.height = '100%'

    const allPaths = Array.from(root.querySelectorAll<SVGPathElement>('path'))
    const interactivePaths = Array.from(root.querySelectorAll<SVGPathElement>('path[id^="mun_"]'))

    allPaths.forEach((path) => {
      const city = cityMap.get(path.id)

      if (city) {
        const isSelected = selectedCityId === city.id
        path.style.cursor = 'pointer'
        path.style.pointerEvents = 'auto'
        path.style.transition = 'filter 140ms ease, stroke 140ms ease, stroke-width 140ms ease, opacity 140ms ease'
        path.style.vectorEffect = 'non-scaling-stroke'
        path.style.stroke = isSelected ? '#185FA5' : '#FFFFFF'
        path.style.strokeWidth = isSelected ? '5' : '2'
        path.style.opacity = '1'
        path.style.filter = isSelected ? 'drop-shadow(0 4px 10px rgba(24,95,165,0.35)) brightness(1.02)' : 'none'
      } else if (path.id.startsWith('mun_')) {
        path.style.cursor = 'default'
        path.style.pointerEvents = 'none'
        path.style.opacity = '0.88'
      }
    })

    function handleClick(event: Event) {
      const element = event.currentTarget as SVGPathElement
      const city = cityMap.get(element.id)
      if (city) onSelectCity(city)
    }

    interactivePaths.forEach((path) => {
      if (cityMap.has(path.id)) {
        path.addEventListener('click', handleClick)
      }
    })

    return () => {
      interactivePaths.forEach((path) => {
        path.removeEventListener('click', handleClick)
      })
    }
  }, [cityMap, onSelectCity, selectedCityId, svgHtml])

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.9fr) minmax(280px, 0.75fr)',
        gap: '16px',
        alignItems: 'stretch',
      }}
    >
      <div
        style={{
          position: 'relative',
          minHeight: '520px',
          backgroundColor: '#EDF4FB',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid var(--color-border-tertiary)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 2,
            fontSize: '11px',
            color: '#4A6782',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            backgroundColor: 'rgba(255,255,255,0.92)',
            padding: '5px 10px',
            borderRadius: '14px',
          }}
        >
          Clique no municipio para ver os dados
        </div>

        <div
          ref={containerRef}
          style={{
            position: 'absolute',
            inset: 0,
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          dangerouslySetInnerHTML={{ __html: svgHtml }}
        />
      </div>

      <div style={{ display: 'grid', gap: '12px' }}>
        <div
          style={{
            border: '1px solid var(--color-border-tertiary)',
            borderRadius: '12px',
            padding: '14px',
            backgroundColor: '#F8FBFF',
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
            Municipio selecionado
          </div>

          {selectedCity ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '999px', backgroundColor: selectedCity.leadingColor }} />
                <strong style={{ fontSize: '17px' }}>{selectedCity.name}</strong>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                Lider no municipio: {selectedCity.leadingOption}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <Metric label="No target" value={selectedCity.withinTarget.toLocaleString('pt-BR')} />
                <Metric label="Total bruto" value={selectedCity.total.toLocaleString('pt-BR')} />
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                {Object.entries(selectedCity.breakdown).map(([label, info]) => (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: selectedCity.leadingOption === label ? 700 : 500 }}>{label}</span>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{info.count.toLocaleString('pt-BR')} · {info.pct.toFixed(1).replace('.', ',')}%</span>
                    </div>
                    <ProgressBar value={info.pct} color={selectedCity.leadingOption === label ? selectedCity.leadingColor : '#CBD5E1'} height={8} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Selecione uma cidade.</div>
          )}
        </div>

        <div
          style={{
            border: '1px solid var(--color-border-tertiary)',
            borderRadius: '12px',
            padding: '14px',
            backgroundColor: 'var(--color-background-primary)',
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '10px' }}>
            Cidades com dados
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {cities.map((city) => {
              const active = selectedCityId === city.id
              return (
                <button
                  key={city.id}
                  onClick={() => onSelectCity(city)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: `1px solid ${active ? city.leadingColor : 'var(--color-border-secondary)'}`,
                    backgroundColor: active ? `${city.leadingColor}14` : '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '999px', backgroundColor: city.leadingColor }} />
                    <span style={{ fontSize: '13px', fontWeight: active ? 700 : 500 }}>{city.name}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{city.leadingOption}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--color-border-tertiary)',
        borderRadius: '10px',
        padding: '10px 12px',
      }}
    >
      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontSize: '18px', fontWeight: 700 }}>{value}</div>
    </div>
  )
}
