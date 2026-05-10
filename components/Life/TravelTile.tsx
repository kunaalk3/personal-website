'use client'

import { motion } from 'framer-motion'
import { TRAVEL_PILLS, INDIA_REGIONS, INTL_CITIES } from '@/lib/data'

const MAP_DOTS = [
  { top: '74%', left: '80%', delay: 0, sm: false },      // Australia
  { top: '27%', left: '84%', delay: 0.3, sm: true },     // Japan
  { top: '43%', left: '63%', delay: 0.5, sm: false },    // India
  { top: '41%', left: '57%', delay: 0.7, sm: true },     // UAE
  { top: '60%', left: '77%', delay: 0.9, sm: true },     // Bali
  { top: '47%', left: '73%', delay: 1.1, sm: true },     // Thailand
  { top: '55%', left: '74%', delay: 1.3, sm: true },     // Singapore / Malaysia
  { top: '36%', left: '78%', delay: 1.5, sm: true },     // Hong Kong / China
  { top: '50%', left: '64%', delay: 1.7, sm: true },     // Sri Lanka
]

export default function TravelTile() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ borderColor: 'rgba(255,255,255,0.18)', y: -2 }}
      className="travel-tile"
      style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 4,
        padding: 24,
        overflow: 'hidden',
        transition: 'border-color 0.3s',
      }}
    >
      <p style={{ fontSize: 8, letterSpacing: '0.4em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', marginBottom: 14 }}>
        Passport
      </p>
      <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6, lineHeight: 1.1 }}>
        15+ Countries<br />& Counting
      </h3>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, marginBottom: 16 }}>
        From Chennai to the world — no plans to stop.
      </p>

      {/* World map */}
      <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, height: 110, marginBottom: 14, position: 'relative', overflow: 'hidden' }}>
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }} />
        {/* Dots */}
        {MAP_DOTS.map((d, i) => (
          <div key={i} style={{ position: 'absolute', top: d.top, left: d.left }}>
            <div style={{
              width: d.sm ? 4 : 5,
              height: d.sm ? 4 : 5,
              background: '#fff',
              borderRadius: '50%',
              boxShadow: '0 0 6px rgba(255,255,255,0.7)',
              animation: `dotPulse 2s ${d.delay}s ease-in-out infinite`,
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                inset: -3,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.25)',
                animation: `ringExpand 2s ${d.delay}s ease-out infinite`,
              }} />
            </div>
          </div>
        ))}
        <span style={{ position: 'absolute', bottom: 6, right: 8, fontSize: 8, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase' }}>
          Glowing dots = visited
        </span>
      </div>

      {/* Stat pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {TRAVEL_PILLS.map((p) => (
          <span
            key={p.label}
            style={{
              fontSize: 10,
              color: p.highlight ? '#fff' : 'rgba(255,255,255,0.45)',
              border: `1px solid ${p.highlight ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
              padding: '4px 9px',
              borderRadius: 2,
              fontWeight: p.highlight ? 700 : 400,
            }}
          >
            {p.label}
          </span>
        ))}
      </div>

      {/* India by region */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 9, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
            🇮🇳 India — Across the country
          </span>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)' }}>15+ cities</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {INDIA_REGIONS.map((r) => (
            <div key={r.region} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 8, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', flexShrink: 0, width: 48 }}>
                {r.region}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {r.cities.map((c, i) => (
                  <span key={c} style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>
                    {c}{i < r.cities.length - 1 && <span style={{ color: 'rgba(255,255,255,0.1)', marginLeft: 4 }}>·</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 10 }} />

      {/* Intl cities */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {INTL_CITIES.map((c, i) => (
          <span key={c} style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)' }}>
            {c}{i < INTL_CITIES.length - 1 && <span style={{ color: 'rgba(255,255,255,0.08)', marginLeft: 4 }}>·</span>}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
