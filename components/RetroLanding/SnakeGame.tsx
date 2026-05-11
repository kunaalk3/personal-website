'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const COLS = 20
const ROWS = 16
const TILE = 18
const W = COLS * TILE
const H = ROWS * TILE
const TICK_MS = 110

type Vec = { x: number; y: number }

const opposite = (a: Vec, b: Vec) => a.x === -b.x && a.y === -b.y

export default function SnakeGame({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const snakeRef = useRef<Vec[]>([])
  const dirRef = useRef<Vec>({ x: 1, y: 0 })
  const queuedDirRef = useRef<Vec | null>(null)
  const foodRef = useRef<Vec>({ x: 10, y: 8 })
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [state, setState] = useState<'ready' | 'playing' | 'gameover'>('ready')
  const lastTickRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  const reset = useCallback(() => {
    snakeRef.current = [
      { x: 6, y: 8 },
      { x: 5, y: 8 },
      { x: 4, y: 8 },
    ]
    dirRef.current = { x: 1, y: 0 }
    queuedDirRef.current = null
    foodRef.current = randomFood(snakeRef.current)
    setScore(0)
  }, [])

  useEffect(() => {
    reset()
    const saved = typeof window !== 'undefined' ? Number(localStorage.getItem('kr_snake_best') || 0) : 0
    setBest(saved)
  }, [reset])

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (k === 'arrowup' || k === 'w') tryQueueDir({ x: 0, y: -1 })
      else if (k === 'arrowdown' || k === 's') tryQueueDir({ x: 0, y: 1 })
      else if (k === 'arrowleft' || k === 'a') tryQueueDir({ x: -1, y: 0 })
      else if (k === 'arrowright' || k === 'd') tryQueueDir({ x: 1, y: 0 })
      else if (k === ' ' || k === 'enter') {
        if (state === 'ready') setState('playing')
        else if (state === 'gameover') {
          reset()
          setState('playing')
        }
      } else if (k === 'escape') onExit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state, reset, onExit])

  const tryQueueDir = (d: Vec) => {
    const cur = dirRef.current
    if (opposite(d, cur)) return
    queuedDirRef.current = d
    if (state === 'ready') setState('playing')
  }

  // Game loop
  useEffect(() => {
    const draw = () => {
      const ctx = canvasRef.current?.getContext('2d')
      if (!ctx) return
      // Background — dark grid
      ctx.fillStyle = '#0a0d1a'
      ctx.fillRect(0, 0, W, H)
      // Grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.04)'
      ctx.lineWidth = 1
      for (let x = 0; x <= COLS; x++) {
        ctx.beginPath()
        ctx.moveTo(x * TILE + 0.5, 0)
        ctx.lineTo(x * TILE + 0.5, H)
        ctx.stroke()
      }
      for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath()
        ctx.moveTo(0, y * TILE + 0.5)
        ctx.lineTo(W, y * TILE + 0.5)
        ctx.stroke()
      }
      // Border
      ctx.strokeStyle = 'rgba(255,255,255,0.35)'
      ctx.lineWidth = 2
      ctx.strokeRect(1, 1, W - 2, H - 2)
      // Food — red apple
      const f = foodRef.current
      ctx.fillStyle = '#ff3a6a'
      ctx.fillRect(f.x * TILE + 3, f.y * TILE + 3, TILE - 6, TILE - 6)
      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.fillRect(f.x * TILE + 5, f.y * TILE + 5, 3, 3)
      // Snake — green
      const snake = snakeRef.current
      snake.forEach((seg, i) => {
        const head = i === 0
        ctx.fillStyle = head ? '#9bff7a' : '#5fcc55'
        ctx.fillRect(seg.x * TILE + 2, seg.y * TILE + 2, TILE - 4, TILE - 4)
        if (head) {
          ctx.fillStyle = '#000'
          const d = dirRef.current
          const cx = seg.x * TILE + TILE / 2
          const cy = seg.y * TILE + TILE / 2
          const eye = (ox: number, oy: number) => ctx.fillRect(cx + ox - 1.5, cy + oy - 1.5, 3, 3)
          if (d.x === 1) { eye(3, -3); eye(3, 3) }
          else if (d.x === -1) { eye(-3, -3); eye(-3, 3) }
          else if (d.y === -1) { eye(-3, -3); eye(3, -3) }
          else { eye(-3, 3); eye(3, 3) }
        }
      })
    }

    const loop = (t: number) => {
      if (state === 'playing') {
        if (t - lastTickRef.current >= TICK_MS) {
          lastTickRef.current = t
          step()
        }
      }
      draw()
      rafRef.current = requestAnimationFrame(loop)
    }

    const step = () => {
      const snake = snakeRef.current
      if (queuedDirRef.current) {
        const q = queuedDirRef.current
        if (!opposite(q, dirRef.current)) dirRef.current = q
        queuedDirRef.current = null
      }
      const head = snake[0]
      const nx = head.x + dirRef.current.x
      const ny = head.y + dirRef.current.y
      // Wall collision
      if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) {
        return endGame()
      }
      // Self collision
      for (let i = 0; i < snake.length - 1; i++) {
        if (snake[i].x === nx && snake[i].y === ny) return endGame()
      }
      const newHead = { x: nx, y: ny }
      snake.unshift(newHead)
      const f = foodRef.current
      if (nx === f.x && ny === f.y) {
        setScore((s) => s + 1)
        foodRef.current = randomFood(snake)
      } else {
        snake.pop()
      }
    }

    const endGame = () => {
      setState('gameover')
      setBest((b) => {
        const newBest = Math.max(b, score)
        if (typeof window !== 'undefined') localStorage.setItem('kr_snake_best', String(newBest))
        return newBest
      })
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [state, score])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
        padding: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: 'min(96vw, 520px)',
          color: '#fff',
          fontFamily: 'monospace',
          fontSize: 12,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
      >
        <span>SCORE · {String(score).padStart(3, '0')}</span>
        <span style={{ opacity: 0.6 }}>BEST · {String(best).padStart(3, '0')}</span>
      </div>

      <div
        style={{
          position: 'relative',
          width: 'min(96vw, 520px)',
          aspectRatio: `${COLS} / ${ROWS}`,
          maxHeight: '60vh',
        }}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{
            width: '100%',
            height: '100%',
            imageRendering: 'pixelated',
            display: 'block',
            borderRadius: 4,
            boxShadow: '0 0 0 2px rgba(255,255,255,0.18), 0 30px 60px rgba(0,0,0,0.6)',
          }}
        />
        {state !== 'playing' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 12,
              color: '#fff',
              fontFamily: 'monospace',
              background: 'rgba(10,13,26,0.7)',
              textAlign: 'center',
              padding: 16,
            }}
          >
            <div style={{ fontSize: 22, letterSpacing: '0.25em', fontWeight: 700 }}>
              {state === 'ready' ? 'SNAKE' : 'GAME OVER'}
            </div>
            <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: '0.2em' }}>
              {state === 'ready'
                ? 'ARROWS / WASD / SWIPE TO MOVE'
                : `SCORE ${score} · BEST ${best}`}
            </div>
            <button
              onClick={() => {
                if (state === 'gameover') reset()
                setState('playing')
              }}
              style={pillBtn}
            >
              {state === 'ready' ? 'START ▶' : 'PLAY AGAIN ↻'}
            </button>
          </div>
        )}
      </div>

      {/* D-pad controls (mobile) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 56px)',
          gridTemplateRows: 'repeat(3, 56px)',
          gap: 4,
          marginTop: 8,
        }}
      >
        <span />
        <DpadBtn label="▲" onPress={() => tryQueueDir({ x: 0, y: -1 })} />
        <span />
        <DpadBtn label="◀" onPress={() => tryQueueDir({ x: -1, y: 0 })} />
        <span />
        <DpadBtn label="▶" onPress={() => tryQueueDir({ x: 1, y: 0 })} />
        <span />
        <DpadBtn label="▼" onPress={() => tryQueueDir({ x: 0, y: 1 })} />
        <span />
      </div>

      <button onClick={onExit} style={{ ...pillBtn, opacity: 0.7 }}>
        EXIT ✕
      </button>
    </div>
  )
}

function DpadBtn({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <button
      onPointerDown={(e) => {
        e.preventDefault()
        onPress()
      }}
      style={{
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.25)',
        borderRadius: 8,
        color: '#fff',
        fontSize: 18,
        cursor: 'pointer',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      {label}
    </button>
  )
}

const pillBtn: React.CSSProperties = {
  background: '#fff',
  color: '#000',
  border: 'none',
  padding: '10px 22px',
  fontSize: 11,
  letterSpacing: '0.25em',
  textTransform: 'uppercase',
  fontWeight: 700,
  borderRadius: 2,
  cursor: 'pointer',
  fontFamily: 'monospace',
}

function randomFood(snake: Vec[]): Vec {
  while (true) {
    const x = Math.floor(Math.random() * COLS)
    const y = Math.floor(Math.random() * ROWS)
    if (!snake.some((s) => s.x === x && s.y === y)) return { x, y }
  }
}
