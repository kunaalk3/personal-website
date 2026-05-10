'use client'

import { motion } from 'framer-motion'
import { useTypewriter } from '@/lib/useTypewriter'
import { TYPEWRITER_ROLES, LINKS } from '@/lib/data'

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 90 + 5}%`,
  left: `${Math.random() * 90 + 5}%`,
  size: Math.random() > 0.6 ? 2 : 1,
  opacity: Math.random() * 0.3 + 0.1,
  duration: Math.random() * 3 + 2.5,
  delay: Math.random() * 2,
}))

const FIRST = 'KUNAAL'.split('')
const LAST = 'RAVINDRAN'.split('')

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18 } },
}

export default function Hero() {
  const role = useTypewriter(TYPEWRITER_ROLES, 80, 50, 1800)

  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#000' }}
    >
      {/* Particles */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            background: '#fff',
            ['--op' as string]: p.opacity,
            animation: `twinkle ${p.duration}s ${p.delay}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* Dot grid */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.032) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          zIndex: 0,
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 400,
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.05) 0%, transparent 70%)',
          animation: 'glowPulse 4s ease-in-out infinite',
        }}
      />

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center px-6"
      >
        <motion.p
          variants={fadeUp}
          style={{
            fontSize: 10,
            letterSpacing: '0.35em',
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          Adelaide, Australia · Open to opportunities
        </motion.p>

        {/* Character-by-character name reveal */}
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: 'clamp(48px, 8vw, 96px)',
              fontWeight: 800,
              letterSpacing: '-2px',
              lineHeight: 1,
              color: '#fff',
            }}
          >
            <span style={{ display: 'block' }}>
              {FIRST.map((c, i) => (
                <motion.span
                  key={`k${i}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.055, ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
                  style={{ display: 'inline-block' }}
                >
                  {c}
                </motion.span>
              ))}
            </span>
            <span style={{ display: 'block' }}>
              {LAST.map((c, i) => (
                <motion.span
                  key={`r${i}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.055, ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
                  style={{ display: 'inline-block' }}
                >
                  {c}
                </motion.span>
              ))}
            </span>
          </div>
        </div>

        <motion.div
          variants={fadeUp}
          style={{
            width: 40,
            height: 1,
            background: 'rgba(255,255,255,0.3)',
            margin: '0 auto 18px',
          }}
        />

        <motion.div
          variants={fadeUp}
          style={{
            fontSize: 12,
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.45)',
            textTransform: 'uppercase',
            marginBottom: 36,
            minHeight: 20,
          }}
        >
          {role}
          <span
            style={{
              display: 'inline-block',
              width: 1,
              height: '1em',
              background: 'rgba(255,255,255,0.5)',
              marginLeft: 2,
              verticalAlign: 'middle',
              animation: 'twinkle 0.8s ease-in-out infinite',
            }}
          />
        </motion.div>

        <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 flex-wrap">
          <a
            href={LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#fff',
              color: '#000',
              padding: '10px 24px',
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 700,
              borderRadius: 2,
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
          >
            LinkedIn
          </a>
          <a
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'transparent',
              color: 'rgba(255,255,255,0.6)',
              padding: '9px 24px',
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 2,
              textDecoration: 'none',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
            }}
          >
            GitHub
          </a>
          <button
            onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'transparent',
              color: 'rgba(255,255,255,0.4)',
              padding: '9px 24px',
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
            }}
          >
            View Work ↓
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: 0.4 }}
      >
        <span style={{ fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#fff' }}>
          Scroll
        </span>
        <div
          style={{
            width: 1,
            height: 36,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.8), transparent)',
            animation: 'scrollHint 1.8s ease-in-out infinite',
          }}
        />
      </div>
    </section>
  )
}
