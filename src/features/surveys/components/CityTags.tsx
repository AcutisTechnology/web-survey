'use client'

import React, { useState } from 'react'

interface CityTagsProps {
  cities: string[]
  onChange: (cities: string[]) => void
}

export default function CityTags({ cities, onChange }: CityTagsProps) {
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const removeCity = (city: string) => {
    onChange(cities.filter((c) => c !== city))
  }

  const addCity = () => {
    const trimmed = inputValue.trim()
    if (trimmed && !cities.includes(trimmed)) {
      onChange([...cities, trimmed])
    }
    setInputValue('')
    setInputVisible(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCity()
    }
    if (e.key === 'Escape') {
      setInputVisible(false)
      setInputValue('')
    }
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
      {cities.map((city) => (
        <span
          key={city}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            backgroundColor: '#e8f0fb',
            color: 'var(--color-brand)',
            border: '1px solid #b8d0f0',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 500,
          }}
        >
          {city}
          <button
            type="button"
            onClick={() => removeCity(city)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-brand)',
              fontSize: '14px',
              lineHeight: 1,
              padding: '0',
              marginLeft: '2px',
            }}
          >
            ×
          </button>
        </span>
      ))}

      {inputVisible ? (
        <input
          autoFocus
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addCity}
          placeholder="Nome da cidade"
          style={{
            padding: '4px 10px',
            fontSize: '12px',
            border: '1px dashed var(--color-brand)',
            borderRadius: '12px',
            outline: 'none',
            color: 'var(--color-brand)',
            width: '140px',
            fontFamily: 'var(--font-sans)',
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setInputVisible(true)}
          style={{
            padding: '4px 10px',
            fontSize: '12px',
            border: '1px dashed var(--color-border-secondary)',
            borderRadius: '12px',
            backgroundColor: 'transparent',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}
        >
          + Adicionar cidade
        </button>
      )}
    </div>
  )
}
