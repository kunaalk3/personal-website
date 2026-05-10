'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { EXPERIENCE } from '@/lib/data'
import TiltCard from './TiltCard'

function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const onMouseDown = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    dragging.current = true
    startX.current = e.pageX - el.offsetLeft
    scrollLeft.current = el.scrollLeft
    el.style.cursor = 'grabbing'

    const onMove = (ev: MouseEvent) => {
      if (!dragging.current || !el) return
      const x = ev.pageX - el.offsetLeft
      el.scrollLeft = scrollLeft.current - (x - startX.current) * 1.2
    }
    const onUp = () => {
      dragging.current = false
      if (el) el.style.cursor = 'grab'
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  return { ref, onMouseDown }
}

function ExperienceCard({ role, index }: { role: (typeof EXPERIENCE)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ opacity: 1 }}
      style={{
        flexShrink: 0,
        width: role.current ? 310 : 280,
        opacity: role.current ? 1 : 0.72,
      }}
    >
      <TiltCard
        className="card-sweep"
        style={{
          background: '#0a0a0a',
          border: `1px solid ${role.current ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'}`,
          borderRadius: 4,
          padding: '22px 20px 18px',
          position: 'relative',
          height: '100%',
        }}
      >
        {role.current && (
          <span
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              fontSize: 8,
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.35)',
              textTransform: 'uppercase',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '3px 8px',
              borderRadius: 2,
            }}
          >
            Current
          </span>
        )}
        {!role.current && (
          <span
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              fontSize: 8,
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.18)',
              textTransform: 'uppercase',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '3px 8px',
              borderRadius: 2,
            }}
          >
            Past
          </span>
        )}

        <p style={{ fontSize: 9, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', marginBottom: 10 }}>
          {role.year}
        </p>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 3, lineHeight: 1.2 }}>
          {role.company}
        </h3>
        <p style={{ fontSize: 10, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: role.link ? 8 : 22 }}>
          {role.role}
        </p>
        {role.link && (
          <a
            href={role.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 9,
              color: 'rgba(255,255,255,0.25)',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              paddingBottom: 1,
              display: 'inline-block',
              marginBottom: 14,
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
          >
            {role.linkLabel} ↗
          </a>
        )}
        <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.1)', marginBottom: 12 }} />
        <p style={{ fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.45)', marginBottom: 16 }}>
          {role.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {role.tags.map((t) => (
            <span key={t} className="tag-pill">{t}</span>
          ))}
        </div>
      </TiltCard>
    </motion.div>
  )
}

export default function Work() {
  const { ref: trackRef, onMouseDown } = useDragScroll()
  const current = EXPERIENCE.filter((e) => e.current)
  const past = EXPERIENCE.filter((e) => !e.current)

  return (
    <section id="work" style={{ background: '#000', padding: '100px 0 80px' }}>
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 32 }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 6 }}>
            <span style={{ fontSize: 10, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.2)' }}>02</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.5px' }}>
              The Work
            </h2>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
            Experience · Consulting · Impact
          </p>
        </motion.div>

        {/* Drag hint */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.15)', animation: `twinkle 1.5s ${i * 0.2}s ease-in-out infinite` }} />
            ))}
          </div>
          <span style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>
            Drag to explore
          </span>
        </div>

        {/* Scroll track — native overflow scroll (works on mobile touch + desktop drag) */}
        <div
          ref={trackRef}
          onMouseDown={onMouseDown}
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: 14,
            overflowX: 'auto',
            paddingBottom: 12,
            cursor: 'grab',
            userSelect: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {current.map((role, i) => (
            <ExperienceCard key={role.company} role={role} index={i} />
          ))}

          {/* Past divider */}
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, padding: '0 8px' }}>
            <div style={{ width: 1, height: 60, background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
            <span style={{ fontSize: 8, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase', writingMode: 'vertical-rl' }}>Past</span>
            <div style={{ width: 1, height: 60, background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
          </div>

          {past.map((role, i) => (
            <ExperienceCard key={role.company} role={role} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
