'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useActiveSection } from '@/lib/useActiveSection'

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'life', label: 'Life' },
  { id: 'connect', label: 'Connect' },
]

export default function SideNav() {
  const active = useActiveSection(SECTIONS.map((s) => s.id))
  const [hovered, setHovered] = useState<string | null>(null)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-5 hidden md:flex">
      {SECTIONS.map(({ id, label }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
            className="flex items-center gap-3 group"
            aria-label={label}
          >
            <motion.div
              animate={{
                width: isActive ? 8 : 5,
                height: isActive ? 8 : 5,
                backgroundColor: isActive ? '#fff' : 'rgba(255,255,255,0.25)',
                boxShadow: isActive ? '0 0 8px rgba(255,255,255,0.6)' : 'none',
              }}
              transition={{ duration: 0.3 }}
              style={{ borderRadius: '50%', flexShrink: 0 }}
            />
            <AnimatePresence>
              {hovered === id && (
                <motion.span
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: isActive ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        )
      })}
    </nav>
  )
}
