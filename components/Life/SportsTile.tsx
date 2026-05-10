'use client'

import { motion } from 'framer-motion'
import { SPORTS } from '@/lib/data'

export default function SportsTile() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ borderColor: 'rgba(255,255,255,0.18)', y: -2 }}
      style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 4,
        padding: 24,
        transition: 'border-color 0.3s',
      }}
    >
      <p style={{ fontSize: 8, letterSpacing: '0.4em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', marginBottom: 14 }}>
        On the Court
      </p>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6, lineHeight: 1.1 }}>
        Rackets &<br />Paddles
      </h3>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, marginBottom: 16 }}>
        Above amateur, below pro — always improving.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {SPORTS.map((s) => (
          <motion.div
            key={s.name}
            whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 12px',
              background: '#0f0f0f',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 3,
              transition: 'border-color 0.2s',
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{s.name}</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: i < s.level ? '#fff' : 'rgba(255,255,255,0.12)',
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: 8, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>
                {s.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
