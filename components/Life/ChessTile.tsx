'use client'

import { motion } from 'framer-motion'
import { LINKS } from '@/lib/data'

const BOARD = [
  ['♜','','♜','♞'],
  ['♟','','♟',''],
  ['','','','♗'],
  ['♙','','♙','♔'],
]
const LIGHT = [
  [true,false,true,false],
  [false,true,false,true],
  [true,false,true,false],
  [false,true,false,true],
]

export default function ChessTile() {
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
        Mind Games
      </p>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Chess</h3>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, marginBottom: 16 }}>
        Strategy on and off the board.
      </p>

      {/* Mini board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2, marginBottom: 16, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
        {BOARD.map((row, r) =>
          row.map((piece, c) => (
            <div
              key={`${r}-${c}`}
              style={{
                height: 22,
                background: LIGHT[r][c] ? '#1a1a1a' : '#111',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              {piece}
            </div>
          ))
        )}
      </div>

      <a
        href={LINKS.chess}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#0f0f0f',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 3,
          padding: '11px 14px',
          textDecoration: 'none',
          transition: 'border-color 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)')}
        onMouseOut={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>kunaal_k3</div>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginTop: 2 }}>
            chess.com · Let&apos;s play ↗
          </div>
        </div>
        <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.2)' }}>♟</span>
      </a>
    </motion.div>
  )
}
