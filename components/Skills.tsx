'use client'

import { useRef } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'
import { SKILLS, STATS } from '@/lib/data'
import TiltCard from './TiltCard'

function StatBlock({ stat, index }: { stat: (typeof STATS)[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const count = useMotionValue(0)
  const rounded = useTransform<number, string>(count, (v) => {
    if (stat.suffix === 'M') return v.toFixed(1)
    return String(Math.round(v))
  })

  useEffect(() => {
    if (inView) {
      animate(count, stat.number, { duration: 1.5, delay: index * 0.1, ease: 'easeOut' })
    }
  }, [inView, count, stat.number, index])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <TiltCard
        className="card-sweep"
        style={{
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 4,
          padding: '20px 22px',
          textAlign: 'center',
          height: '100%',
        }}
      >
        <div style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: 6 }}>
          {stat.prefix || ''}
          <motion.span>{rounded}</motion.span>
          {stat.suffix}
        </div>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', lineHeight: 1.4 }}>
          {stat.label}
        </div>
      </TiltCard>
    </motion.div>
  )
}

function SkillBlock({ skill, index }: { skill: (typeof SKILLS)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <TiltCard
        className="card-sweep"
        style={{
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 4,
          padding: '22px 24px',
          position: 'relative',
          height: '100%',
        }}
      >
        <p style={{ fontSize: 8, letterSpacing: '0.4em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', marginBottom: 12 }}>
          {skill.label}
        </p>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 16 }}>{skill.title}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {skill.pills.map((pill, i) => (
            <motion.span
              key={pill.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + i * 0.04 }}
              style={{
                fontSize: 10,
                letterSpacing: '0.05em',
                color: pill.primary ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
                border: `1px solid ${pill.primary ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)'}`,
                padding: '5px 12px',
                borderRadius: 2,
                transition: 'color 0.2s, border-color 0.2s',
              }}
              whileHover={{ color: '#fff', borderColor: 'rgba(255,255,255,0.35)' }}
            >
              {pill.name}
            </motion.span>
          ))}
        </div>
      </TiltCard>
    </motion.div>
  )
}

export default function Skills() {
  return (
    <section id="skills" style={{ background: '#000', padding: '100px 0 80px' }}>
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 32 }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 6 }}>
            <span style={{ fontSize: 10, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.2)' }}>03</span>
            {/* Skills is section 03 — sits between Work and Projects */}
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.5px' }}>
              The Skills
            </h2>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
            What I work with · What I build
          </p>
        </motion.div>

        {/* Stats */}
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <StatBlock key={s.label} stat={s} index={i} />
          ))}
        </div>

        {/* Skill grid */}
        <div className="skills-grid">
          {SKILLS.map((skill, i) => (
            <SkillBlock key={skill.title} skill={skill} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
