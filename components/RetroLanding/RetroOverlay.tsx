'use client'

import { useEffect, useState } from 'react'
import RetroLanding from './RetroLanding'

export default function RetroOverlay() {
  const [mounted, setMounted] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [closing, setClosing] = useState(false)

  // Lock body scroll while overlay is open
  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const enter = () => {
    setClosing(true)
    document.body.style.overflow = ''
    setTimeout(() => setHidden(true), 420)
  }

  if (!mounted || hidden) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 80,
        transition: 'opacity 0.42s ease, transform 0.42s ease',
        opacity: closing ? 0 : 1,
        transform: closing ? 'scale(1.04)' : 'scale(1)',
        pointerEvents: closing ? 'none' : 'auto',
      }}
    >
      <RetroLanding onEnterSite={enter} />
    </div>
  )
}
