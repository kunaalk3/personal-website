'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { PROJECTS } from '@/lib/data'
import TiltCard from './TiltCard'

function ProjectCard({ proj, index }: { proj: (typeof PROJECTS)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
    >
      <TiltCard
        className="card-sweep"
        style={{
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 4,
          padding: '18px 20px',
          height: '100%',
        }}
      >
        {proj.image && (
          <div style={{ position: 'relative', width: '100%', height: 140, marginBottom: 14, borderRadius: 2, overflow: 'hidden', background: '#111' }}>
            <Image src={proj.image} alt={proj.name} fill style={{ objectFit: 'cover', opacity: 0.7 }} />
          </div>
        )}
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{proj.name}</h3>
        <p style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: proj.link ? 6 : 14 }}>
          {proj.type}
        </p>
        {proj.link && (
          <a
            href={proj.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 9,
              color: 'rgba(255,255,255,0.2)',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              paddingBottom: 1,
              display: 'inline-block',
              marginBottom: 12,
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
          >
            {proj.linkLabel} ↗
          </a>
        )}
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: 12 }}>
          {proj.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {proj.tags.map((t) => (
            <span key={t} className="tag-pill">{t}</span>
          ))}
        </div>
      </TiltCard>
    </motion.div>
  )
}

export default function Projects() {
  return (
    <section id="projects" style={{ background: '#000', padding: '60px 0 80px' }}>
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 28 }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 6 }}>
            <span style={{ fontSize: 10, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.2)' }}>04</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.5px' }}>
              Projects
            </h2>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
            Builds · Dashboards · Systems
          </p>
        </motion.div>

        <div className="projects-grid">
          {PROJECTS.map((proj, i) => (
            <ProjectCard key={proj.name} proj={proj} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
