'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const ringX = useSpring(cursorX, { stiffness: 120, damping: 18 })
  const ringY = useSpring(cursorY, { stiffness: 120, damping: 18 })
  const [hovering, setHovering] = useState(false)
  const [clicking, setClicking] = useState(false)
  const rafRef = useRef<number>()

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        cursorX.set(e.clientX)
        cursorY.set(e.clientY)
      })
    }
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      setHovering(!!(t.closest('a') || t.closest('button') || t.closest('[data-hover]')))
    }
    const onDown = () => setClicking(true)
    const onUp = () => setClicking(false)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [cursorX, cursorY])

  return (
    <>
      {/* Dot */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          position: 'fixed',
          top: 0, left: 0,
          width: hovering ? 6 : 4,
          height: hovering ? 6 : 4,
          borderRadius: '50%',
          background: '#fff',
          pointerEvents: 'none',
          zIndex: 9999,
          translateX: '-50%',
          translateY: '-50%',
          mixBlendMode: 'difference',
          transition: 'width 0.2s, height 0.2s',
        }}
      />
      {/* Ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          position: 'fixed',
          top: 0, left: 0,
          width: clicking ? 28 : hovering ? 44 : 36,
          height: clicking ? 28 : hovering ? 44 : 36,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.4)',
          pointerEvents: 'none',
          zIndex: 9998,
          translateX: '-50%',
          translateY: '-50%',
          transition: 'width 0.2s, height 0.2s, border-color 0.2s',
          mixBlendMode: 'difference',
        }}
      />
    </>
  )
}
