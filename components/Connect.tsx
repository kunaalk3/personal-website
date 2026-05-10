'use client'

import { motion } from 'framer-motion'
import { LINKS } from '@/lib/data'

const HEADLINE_WORDS = ["Let's", 'build', 'something', 'great', 'together.']

export default function Connect() {
  return (
    <section id="connect" style={{ background: '#000', padding: '100px 0 80px' }}>
      <div className="section-inner">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 32 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.2)' }}>06</span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Let&apos;s Connect
          </h2>
        </div>

        {/* Animated headline */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{
            fontSize: 'clamp(32px, 5vw, 60px)',
            fontWeight: 800,
            letterSpacing: '-1.5px',
            lineHeight: 1.05,
            color: '#fff',
            marginBottom: 20,
            maxWidth: 700,
          }}
        >
          {HEADLINE_WORDS.map((word, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0, transition: { delay: i * 0.12 } },
              }}
              style={{
                display: 'inline-block',
                marginRight: '0.25em',
                color: word === 'great' ? 'rgba(255,255,255,0.25)' : '#fff',
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, maxWidth: 480, marginBottom: 40 }}
        >
          Whether it&apos;s an AI project, a tech conversation, a game of chess, or just a hello — I&apos;m always open to connecting with interesting people.
        </motion.p>

        {/* Link cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, maxWidth: 680, marginBottom: 32 }}
        >
          {/* LinkedIn — full width primary */}
          <motion.a
            href={LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, opacity: 0.9 }}
            style={{
              gridColumn: '1 / 3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 24px',
              background: '#fff',
              borderRadius: 4,
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
          >
            <div>
              <p style={{ fontSize: 8, letterSpacing: '0.3em', color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', marginBottom: 4 }}>Professional Network</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#000' }}>LinkedIn</p>
              <p style={{ fontSize: 10, color: 'rgba(0,0,0,0.4)', marginTop: 2 }}>Connect, collaborate, or just say hi</p>
            </div>
            <span style={{ fontSize: 20, color: 'rgba(0,0,0,0.2)' }}>↗</span>
          </motion.a>

          {/* GitHub */}
          <motion.a
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, borderColor: 'rgba(255,255,255,0.3)' }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 22px',
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4,
              textDecoration: 'none',
              transition: 'border-color 0.2s',
            }}
          >
            <div>
              <p style={{ fontSize: 8, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: 4 }}>Code & Projects</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>GitHub</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>ShopHunt · Spidey · FindUni</p>
            </div>
            <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.2)' }}>↗</span>
          </motion.a>

          {/* Chess */}
          <motion.a
            href={LINKS.chess}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, borderColor: 'rgba(255,255,255,0.3)' }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 22px',
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4,
              textDecoration: 'none',
              transition: 'border-color 0.2s',
            }}
          >
            <div>
              <p style={{ fontSize: 8, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: 4 }}>Chess</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>kunaal_k3</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>Challenge me — I&apos;ll accept</p>
            </div>
            <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.2)' }}>♟</span>
          </motion.a>
        </motion.div>

        {/* Emails */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          style={{ maxWidth: 680 }}
        >
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Personal', addr: LINKS.emailPersonal },
              { label: 'Work', addr: LINKS.emailWork },
            ].map(({ label, addr }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 9, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', width: 52, flexShrink: 0 }}>
                  {label}
                </span>
                <a
                  href={`mailto:${addr}`}
                  style={{
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.45)',
                    fontFamily: 'monospace',
                    letterSpacing: '0.02em',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                >
                  {addr}
                </a>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 28, paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase' }}>
              Kunaal Ravindran
            </span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.1)', letterSpacing: '0.05em' }}>
              Adelaide, Australia · 2025
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
