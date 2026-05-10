'use client'

import { motion } from 'framer-motion'

export default function MoreTile() {
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
        Then & Now
      </p>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8, lineHeight: 1.1 }}>
        Gamer.<br />Photographer.
      </h3>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 16 }}>
        Grew up obsessed with NFS, God of War, GTA, and Road Rash. Peaked at CoD 4 — good enough to go to a university cultural in high school and beat their team. Now the obsession channels into photography and capturing the world.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {['Photography', 'CoD 4', 'NFS', 'GTA', 'God of War', 'Naruto'].map((t) => (
          <span key={t} className="tag-pill">{t}</span>
        ))}
      </div>
    </motion.div>
  )
}
