'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CUISINES } from '@/lib/data'

const FOOD_ICONS = ['🔪', '🍳', '🍜', '🌶️', '🍱', '🫕']

export default function FoodTile() {
  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ borderColor: 'rgba(255,255,255,0.18)', y: -2 }}
      className="food-tile"
      style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 4,
        padding: 24,
        transition: 'border-color 0.3s',
        display: 'flex',
        gap: 24,
        alignItems: 'flex-start',
      }}
    >
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 8, letterSpacing: '0.4em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', marginBottom: 14 }}>
          In the Kitchen
        </p>
        <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 8, lineHeight: 1.1 }}>
          Sous Chef<br />by Passion
        </h3>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 16 }}>
          Engineer by day, cook by night. Trained as a sous chef — food is a second language. Favourite cuisines span continents.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {CUISINES.map((c) => (
            <motion.span
              key={c.name}
              whileHover={{ color: '#fff', borderColor: 'rgba(255,255,255,0.35)' }}
              style={{
                fontSize: 10,
                color: c.primary ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.35)',
                border: `1px solid ${c.primary ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)'}`,
                padding: '4px 12px',
                borderRadius: 2,
                transition: 'all 0.2s',
              }}
            >
              {c.name}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Icon grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8, flexShrink: 0, paddingTop: 4 }}>
        {FOOD_ICONS.map((icon, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoveredIcon(i)}
            onMouseLeave={() => setHoveredIcon(null)}
            style={{
              fontSize: 28,
              filter: hoveredIcon === i ? 'none' : 'grayscale(1) brightness(0.7)',
              transform: hoveredIcon === i ? 'scale(1.2)' : 'scale(1)',
              transition: 'filter 0.25s, transform 0.25s',
              cursor: 'default',
              textAlign: 'center',
            }}
          >
            {icon}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
