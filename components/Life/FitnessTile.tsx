'use client'

import { motion } from 'framer-motion'

export default function FitnessTile() {
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
        The Journey
      </p>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8, lineHeight: 1.1 }}>
        Built from<br />Zero
      </h3>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 16 }}>
        Started in 2019 — one push-up in a bedroom, driven by adversity. What began as a response to body shaming became a deep obsession with the science of the body: training, nutrition, and discipline.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {['Gym · Since 2019', 'Strength Training', 'Nutrition', 'Diet Science', 'Body Recomposition'].map((t) => (
          <span key={t} className="tag-pill">{t}</span>
        ))}
      </div>
    </motion.div>
  )
}
