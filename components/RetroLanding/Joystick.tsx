'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Vec = { x: number; y: number }

export default function Joystick({
  onChange,
  size = 130,
}: {
  onChange: (v: Vec) => void
  size?: number
}) {
  const baseRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLDivElement>(null)
  const activeId = useRef<number | null>(null)
  const center = useRef<Vec>({ x: 0, y: 0 })
  const radius = size / 2
  const knobSize = size * 0.42
  const [active, setActive] = useState(false)

  const setKnob = useCallback((dx: number, dy: number) => {
    if (knobRef.current) {
      knobRef.current.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`
    }
  }, [])

  const computeCenter = useCallback(() => {
    if (!baseRef.current) return
    const r = baseRef.current.getBoundingClientRect()
    center.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  }, [])

  const handleStart = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      activeId.current = e.pointerId
      computeCenter()
      setActive(true)
    },
    [computeCenter]
  )

  const handleMove = useCallback(
    (e: React.PointerEvent) => {
      if (activeId.current !== e.pointerId) return
      const dx = e.clientX - center.current.x
      const dy = e.clientY - center.current.y
      const dist = Math.hypot(dx, dy)
      const max = radius * 0.7
      const clamped = Math.min(dist, max)
      const ux = dist > 0 ? dx / dist : 0
      const uy = dist > 0 ? dy / dist : 0
      const nx = ux * clamped
      const ny = uy * clamped
      setKnob(nx, ny)
      // Output normalized in [-1, 1] with a small deadzone
      const norm = clamped / max
      const out = norm < 0.18 ? { x: 0, y: 0 } : { x: ux * norm, y: uy * norm }
      onChange(out)
    },
    [radius, setKnob, onChange]
  )

  const handleEnd = useCallback(
    (e: React.PointerEvent) => {
      if (activeId.current !== e.pointerId) return
      activeId.current = null
      setKnob(0, 0)
      onChange({ x: 0, y: 0 })
      setActive(false)
    },
    [setKnob, onChange]
  )

  useEffect(() => {
    const onResize = () => computeCenter()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [computeCenter])

  return (
    <div
      ref={baseRef}
      onPointerDown={handleStart}
      onPointerMove={handleMove}
      onPointerUp={handleEnd}
      onPointerCancel={handleEnd}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        position: 'relative',
        background: 'rgba(0,0,0,0.45)',
        border: '2px solid rgba(255,255,255,0.35)',
        boxShadow: '0 0 0 4px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.5)',
        touchAction: 'none',
        userSelect: 'none',
        backdropFilter: 'blur(6px)',
        transition: 'border-color 0.15s, background 0.15s',
        borderColor: active ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.35)',
      }}
    >
      {/* Direction tick marks */}
      <div
        style={{
          position: 'absolute',
          inset: 6,
          borderRadius: '50%',
          border: '1px dashed rgba(255,255,255,0.18)',
          pointerEvents: 'none',
        }}
      />
      <span style={joyTick('top')}>▲</span>
      <span style={joyTick('bottom')}>▼</span>
      <span style={joyTick('left')}>◀</span>
      <span style={joyTick('right')}>▶</span>

      {/* Knob */}
      <div
        ref={knobRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: knobSize,
          height: knobSize,
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 30% 30%, #ffffff 0%, #c0c0c0 45%, #6a6a6a 100%)',
          border: '2px solid rgba(0,0,0,0.6)',
          boxShadow: 'inset 0 -4px 6px rgba(0,0,0,0.35), 0 4px 10px rgba(0,0,0,0.5)',
          transform: 'translate(-50%, -50%)',
          transition: active ? 'none' : 'transform 0.15s ease-out',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

function joyTick(side: 'top' | 'bottom' | 'left' | 'right'): React.CSSProperties {
  const base: React.CSSProperties = {
    position: 'absolute',
    fontSize: 10,
    color: 'rgba(255,255,255,0.45)',
    pointerEvents: 'none',
    fontFamily: 'monospace',
  }
  if (side === 'top') return { ...base, top: 6, left: '50%', transform: 'translateX(-50%)' }
  if (side === 'bottom') return { ...base, bottom: 6, left: '50%', transform: 'translateX(-50%)' }
  if (side === 'left') return { ...base, left: 6, top: '50%', transform: 'translateY(-50%)' }
  return { ...base, right: 6, top: '50%', transform: 'translateY(-50%)' }
}
