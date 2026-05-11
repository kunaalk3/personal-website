'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { LINKS } from '@/lib/data'
import Joystick from './Joystick'
import SnakeGame from './SnakeGame'

// --- World constants ---
const TILE = 16
const COLS = 20
const ROWS = 14
const W = COLS * TILE // 320
const H = ROWS * TILE // 224

// --- Map ---
// T = tree (solid), . = grass, , = grass alt, f = flower, B = bush (solid)
const MAP: string[] = [
  'TTTTTTTTTTTTTTTTTTTT',
  'T..,..f...,...f....T',
  'T,..............,..T',
  'T..................T',
  'T..,..f....f..,....T',
  'T...........,......T',
  'T..,..,..,..,..f...T',
  'T..................T',
  'T....f........,....T',
  'T,..,.....,........T',
  'T...........f..,...T',
  'T..f..,..,......,..T',
  'T..................T',
  'TTTTTTTTT..TTTTTTTTT',
]

const SOLID = new Set(['T', 'B'])

// --- Zones (interactive pedestals) ---
type ZoneId = 'linkedin' | 'github' | 'instagram' | 'snake' | 'portfolio'

type Zone = {
  id: ZoneId
  tx: number // top-left tile
  ty: number
  tw: number
  th: number
  label: string
  sub: string
  letter: string
  color: string // gem color
  action: 'link' | 'game' | 'enter'
  url?: string
}

const ZONES: Zone[] = [
  {
    id: 'linkedin',
    tx: 3, ty: 3, tw: 2, th: 2,
    label: 'LINKEDIN', sub: 'Open profile',
    letter: 'in', color: '#3aa0ff',
    action: 'link', url: LINKS.linkedin,
  },
  {
    id: 'github',
    tx: 15, ty: 3, tw: 2, th: 2,
    label: 'GITHUB', sub: 'View repos',
    letter: 'GH', color: '#ffffff',
    action: 'link', url: LINKS.github,
  },
  {
    id: 'instagram',
    tx: 3, ty: 9, tw: 2, th: 2,
    label: 'INSTAGRAM', sub: 'Follow',
    letter: 'IG', color: '#ff4f87',
    action: 'link', url: LINKS.instagram,
  },
  {
    id: 'snake',
    tx: 15, ty: 9, tw: 2, th: 2,
    label: 'ARCADE', sub: 'Play Snake',
    letter: 'AR', color: '#ffd13a',
    action: 'game',
  },
  {
    id: 'portfolio',
    tx: 9, ty: 11, tw: 2, th: 2,
    label: 'PORTFOLIO', sub: 'Enter the site',
    letter: 'KR', color: '#a06bff',
    action: 'enter',
  },
]

// --- Player physics ---
const PLAYER_W = 10
const PLAYER_H = 12
const PLAYER_SPEED = 60 // px/sec

type Vec = { x: number; y: number }
type Dir = 'down' | 'up' | 'left' | 'right'

export default function RetroLanding({ onEnterSite }: { onEnterSite: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Player + input state in refs (mutated by game loop, no re-render)
  const playerRef = useRef<Vec>({ x: W / 2 - PLAYER_W / 2, y: H / 2 })
  const dirRef = useRef<Dir>('down')
  const movingRef = useRef(false)
  const keysRef = useRef<Set<string>>(new Set())
  const joyRef = useRef<Vec>({ x: 0, y: 0 })
  const walkTRef = useRef(0)
  const tRef = useRef(0)

  const [activeZone, setActiveZone] = useState<Zone | null>(null)
  const [showSnake, setShowSnake] = useState(false)
  const [started, setStarted] = useState(false)

  const triggerZone = useCallback(
    (z: Zone) => {
      if (z.action === 'link' && z.url) {
        window.open(z.url, '_blank', 'noopener,noreferrer')
      } else if (z.action === 'game') {
        setShowSnake(true)
      } else if (z.action === 'enter') {
        onEnterSite()
      }
    },
    [onEnterSite]
  )

  // Keyboard
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (showSnake) return
      const k = e.key.toLowerCase()
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', ' '].includes(k)) {
        e.preventDefault()
      }
      keysRef.current.add(k)
      if (!started && (k === ' ' || k === 'enter')) setStarted(true)
      if ((k === 'e' || k === ' ' || k === 'enter') && started) {
        // Read activeZone fresh
        const z = activeZoneFromPos(playerRef.current)
        if (z) triggerZone(z)
      }
    }
    const onUp = (e: KeyboardEvent) => keysRef.current.delete(e.key.toLowerCase())
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [started, showSnake, triggerZone])

  // Canvas scaling — viewport-based, robust against any wrapper measurement quirks
  useEffect(() => {
    const fit = () => {
      const c = canvasRef.current
      if (!c) return
      const vw = window.innerWidth
      const vh = window.innerHeight
      // Reserve title bar (top) + controls dock (bottom) + horizontal safety
      const horizontalMargin = 40 // shadow + small buffer each side total
      const verticalMargin = 80 + (started ? 220 : 80) // title + dock
      const availW = vw - horizontalMargin
      const availH = vh - verticalMargin
      const scale = Math.min(availW / W, availH / H)
      const final = Math.max(0.5, scale)
      c.style.width = `${Math.floor(W * final)}px`
      c.style.height = `${Math.floor(H * final)}px`
    }
    fit()
    const t1 = window.setTimeout(fit, 60)
    const t2 = window.setTimeout(fit, 320)
    window.addEventListener('resize', fit)
    window.addEventListener('orientationchange', fit)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.removeEventListener('resize', fit)
      window.removeEventListener('orientationchange', fit)
    }
  }, [started])

  // Game loop
  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.imageSmoothingEnabled = false

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      tRef.current += dt

      // Input vector
      let ix = 0
      let iy = 0
      if (started && !showSnake) {
        const k = keysRef.current
        if (k.has('arrowleft') || k.has('a')) ix -= 1
        if (k.has('arrowright') || k.has('d')) ix += 1
        if (k.has('arrowup') || k.has('w')) iy -= 1
        if (k.has('arrowdown') || k.has('s')) iy += 1
        const j = joyRef.current
        if (Math.abs(j.x) > Math.abs(ix)) ix = j.x
        if (Math.abs(j.y) > Math.abs(iy)) iy = j.y
      }
      const len = Math.hypot(ix, iy)
      if (len > 1) {
        ix /= len
        iy /= len
      }
      movingRef.current = len > 0.01
      if (Math.abs(ix) > Math.abs(iy)) dirRef.current = ix > 0 ? 'right' : 'left'
      else if (Math.abs(iy) > 0.01) dirRef.current = iy > 0 ? 'down' : 'up'

      // Move with axis-aligned collision
      const p = playerRef.current
      const speed = PLAYER_SPEED * dt
      const dx = ix * speed
      const dy = iy * speed
      if (dx) {
        const nx = p.x + dx
        if (!collides(nx, p.y)) p.x = nx
      }
      if (dy) {
        const ny = p.y + dy
        if (!collides(p.x, ny)) p.y = ny
      }
      // Clamp inside playable area (in case of edge)
      p.x = Math.max(0, Math.min(W - PLAYER_W, p.x))
      p.y = Math.max(0, Math.min(H - PLAYER_H, p.y))

      if (movingRef.current) walkTRef.current += dt

      // Zone detection
      const z = activeZoneFromPos(p)
      setActiveZone((prev) => (prev?.id === z?.id ? prev : z))

      render(ctx, p, dirRef.current, movingRef.current ? walkTRef.current : 0, tRef.current, z)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [started, showSnake])

  // Tap on a zone label = trigger (mobile convenience)
  const onActionTap = () => {
    const z = activeZoneFromPos(playerRef.current)
    if (z) triggerZone(z)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: '#000',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Title bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 5,
          color: '#fff',
          fontFamily: 'monospace',
          fontSize: 11,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.7), transparent)',
          pointerEvents: 'none',
        }}
      >
        <span style={{ opacity: 0.85 }}>★ KUNAAL · WORLD 1-1</span>
        <button
          onClick={onEnterSite}
          style={{
            ...skipBtn,
            pointerEvents: 'auto',
          }}
        >
          SKIP ▶▶
        </button>
      </div>

      {/* Canvas stage */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: 12,
          paddingRight: 12,
          paddingTop: 56,
          paddingBottom: started ? 180 : 16,
          transition: 'padding-bottom 0.25s ease',
        }}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{
            imageRendering: 'pixelated',
            background: '#5e9a4e',
            boxShadow:
              '0 0 0 4px #1a1a1a, 0 0 0 8px #333, 0 30px 80px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,0,0,0.25)',
            borderRadius: 2,
          }}
        />
      </div>

      {/* Press Start overlay */}
      {!started && (
        <div
          onClick={() => setStarted(true)}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 6,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 18,
            color: '#fff',
            fontFamily: 'monospace',
            cursor: 'pointer',
            textAlign: 'center',
            padding: 24,
          }}
        >
          <div style={{ fontSize: 12, letterSpacing: '0.35em', opacity: 0.55 }}>
            KUNAAL RAVINDRAN PRESENTS
          </div>
          <div
            style={{
              fontSize: 'clamp(28px, 7vw, 56px)',
              fontWeight: 800,
              letterSpacing: '0.05em',
              lineHeight: 1,
              textShadow: '0 0 24px rgba(160,107,255,0.45)',
            }}
          >
            QUEST FOR THE PORTFOLIO
          </div>
          <div style={{ fontSize: 10, letterSpacing: '0.3em', opacity: 0.5, maxWidth: 380 }}>
            WALK INTO A PEDESTAL · PRESS [E / SPACE / TAP] TO ENTER
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 14,
              letterSpacing: '0.5em',
              animation: 'twinkle 1.1s ease-in-out infinite',
              ['--op' as string]: 1,
            }}
          >
            ▶ PRESS START
          </div>
        </div>
      )}

      {/* Action prompt */}
      {started && activeZone && (
        <div
          style={{
            position: 'absolute',
            top: 64,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.85)',
            border: `2px solid ${activeZone.color}`,
            padding: '10px 18px',
            color: '#fff',
            fontFamily: 'monospace',
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            zIndex: 5,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: `0 0 24px ${activeZone.color}55`,
            borderRadius: 2,
          }}
        >
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: 2,
              background: activeZone.color,
              color: '#000',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 9,
              fontWeight: 800,
            }}
          >
            {activeZone.letter}
          </span>
          <span>{activeZone.label}</span>
          <span style={{ opacity: 0.55 }}>·</span>
          <span style={{ opacity: 0.7 }}>{activeZone.sub}</span>
          <span style={{ opacity: 0.55 }}>·</span>
          <span style={{ opacity: 0.9 }}>[E / TAP B]</span>
        </div>
      )}

      {/* Controls dock (joystick + B button) */}
      {started && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '20px 24px 28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            pointerEvents: 'none',
            zIndex: 4,
            gap: 16,
          }}
        >
          <div style={{ pointerEvents: 'auto' }}>
            <Joystick onChange={(v) => (joyRef.current = v)} />
            <div
              style={{
                marginTop: 8,
                fontSize: 9,
                letterSpacing: '0.3em',
                color: 'rgba(255,255,255,0.45)',
                fontFamily: 'monospace',
                textAlign: 'center',
              }}
            >
              MOVE
            </div>
          </div>

          <div style={{ pointerEvents: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <button
              onPointerDown={(e) => {
                e.preventDefault()
                onActionTap()
              }}
              style={{
                width: 78,
                height: 78,
                borderRadius: '50%',
                background: activeZone
                  ? `radial-gradient(circle at 30% 30%, #fff, ${activeZone.color} 55%, #4a1a6a 100%)`
                  : 'radial-gradient(circle at 30% 30%, #fff, #d33 55%, #5a0d0d 100%)',
                border: '3px solid rgba(0,0,0,0.6)',
                color: '#fff',
                fontWeight: 800,
                fontSize: 24,
                fontFamily: 'monospace',
                cursor: 'pointer',
                touchAction: 'none',
                userSelect: 'none',
                boxShadow:
                  'inset 0 -6px 8px rgba(0,0,0,0.35), 0 6px 14px rgba(0,0,0,0.5)',
                transition: 'transform 0.1s',
              }}
            >
              B
            </button>
            <span
              style={{
                fontSize: 9,
                letterSpacing: '0.3em',
                color: 'rgba(255,255,255,0.45)',
                fontFamily: 'monospace',
              }}
            >
              ENTER
            </span>
          </div>
        </div>
      )}

      {showSnake && <SnakeGame onExit={() => setShowSnake(false)} />}
    </div>
  )
}

const skipBtn: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.25)',
  color: 'rgba(255,255,255,0.7)',
  padding: '6px 14px',
  fontSize: 10,
  letterSpacing: '0.3em',
  cursor: 'pointer',
  fontFamily: 'monospace',
  borderRadius: 2,
}

// --- Collision + zones ---

function collides(px: number, py: number): boolean {
  // Player AABB
  const x1 = px
  const x2 = px + PLAYER_W - 1
  const y1 = py + PLAYER_H / 2 // collide with lower half ("feet")
  const y2 = py + PLAYER_H - 1
  const cells: Array<[number, number]> = [
    [Math.floor(x1 / TILE), Math.floor(y1 / TILE)],
    [Math.floor(x2 / TILE), Math.floor(y1 / TILE)],
    [Math.floor(x1 / TILE), Math.floor(y2 / TILE)],
    [Math.floor(x2 / TILE), Math.floor(y2 / TILE)],
  ]
  for (const [c, r] of cells) {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return true
    if (SOLID.has(MAP[r][c])) return true
  }
  return false
}

function activeZoneFromPos(p: Vec): Zone | null {
  // Player center
  const cx = p.x + PLAYER_W / 2
  const cy = p.y + PLAYER_H / 2 + 2
  for (const z of ZONES) {
    const zx = z.tx * TILE
    const zy = z.ty * TILE
    const zw = z.tw * TILE
    const zh = z.th * TILE
    if (cx >= zx - 2 && cx <= zx + zw + 2 && cy >= zy + 2 && cy <= zy + zh + 6) {
      return z
    }
  }
  return null
}

// --- Rendering ---

function render(
  ctx: CanvasRenderingContext2D,
  player: Vec,
  dir: Dir,
  walkT: number,
  t: number,
  active: Zone | null
) {
  // Background grass — base color already from canvas style
  ctx.fillStyle = '#5e9a4e'
  ctx.fillRect(0, 0, W, H)

  // Grass dither
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const ch = MAP[y][x]
      if (ch === '.' || ch === ',' || ch === 'f') {
        drawGrass(ctx, x * TILE, y * TILE, (x + y) % 2 === 0)
      }
    }
  }

  // Path tiles around portal entry
  for (let y = 12; y < 14; y++) {
    for (let x = 9; x < 11; x++) {
      drawPath(ctx, x * TILE, y * TILE)
    }
  }

  // Flowers
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (MAP[y][x] === 'f') drawFlower(ctx, x * TILE, y * TILE, (x * 7 + y * 13) % 3)
    }
  }

  // Trees (border + cluster)
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (MAP[y][x] === 'T') drawTree(ctx, x * TILE, y * TILE)
    }
  }

  // Zones (pedestals)
  for (const z of ZONES) {
    drawPedestal(ctx, z, t, active?.id === z.id)
  }

  // Player + zone labels in y-sorted order so player goes behind taller things
  // Simple: draw player at its position, then draw zone labels above
  drawPlayer(ctx, player.x, player.y, dir, walkT)

  // Floating zone labels (small text over pedestals)
  ctx.font = 'bold 6px monospace'
  ctx.textAlign = 'center'
  for (const z of ZONES) {
    const cx = z.tx * TILE + (z.tw * TILE) / 2
    const cy = z.ty * TILE - 2
    const isActive = active?.id === z.id
    ctx.fillStyle = isActive ? '#fff' : 'rgba(255,255,255,0.7)'
    ctx.fillText(z.label, cx, cy)
  }
  ctx.textAlign = 'start'

  // Vignette
  const grad = ctx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 0.8)
  grad.addColorStop(0, 'rgba(0,0,0,0)')
  grad.addColorStop(1, 'rgba(0,0,0,0.35)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)
}

function drawGrass(ctx: CanvasRenderingContext2D, x: number, y: number, alt: boolean) {
  ctx.fillStyle = alt ? '#5e9a4e' : '#5a924a'
  ctx.fillRect(x, y, TILE, TILE)
  // Tiny grass blades
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  ctx.fillRect(x + 3, y + 5, 1, 2)
  ctx.fillRect(x + 11, y + 9, 1, 2)
  ctx.fillStyle = 'rgba(0,0,0,0.08)'
  ctx.fillRect(x + 7, y + 12, 2, 1)
}

function drawPath(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#c8b07a'
  ctx.fillRect(x, y, TILE, TILE)
  ctx.fillStyle = '#a38755'
  ctx.fillRect(x + 2, y + 5, 2, 1)
  ctx.fillRect(x + 10, y + 11, 2, 1)
  ctx.fillStyle = '#e8d8a8'
  ctx.fillRect(x + 6, y + 3, 1, 1)
  ctx.fillRect(x + 12, y + 7, 1, 1)
}

function drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number, variant: number) {
  const cx = x + 8
  const cy = y + 9
  const colors = ['#ffe66d', '#ff6b6b', '#cdb4ff']
  const c = colors[variant % colors.length]
  ctx.fillStyle = '#2d5a2d'
  ctx.fillRect(cx, cy + 1, 1, 3) // stem
  ctx.fillStyle = c
  ctx.fillRect(cx - 1, cy - 1, 3, 3) // petals
  ctx.fillStyle = '#fff8c2'
  ctx.fillRect(cx, cy, 1, 1) // center
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Base grass
  ctx.fillStyle = '#5a924a'
  ctx.fillRect(x, y, TILE, TILE)
  // Trunk
  ctx.fillStyle = '#5a3a1f'
  ctx.fillRect(x + 7, y + 11, 2, 4)
  // Leaves (round-ish blob 12x10)
  ctx.fillStyle = '#2d5a2d'
  ctx.fillRect(x + 3, y + 3, 10, 9)
  ctx.fillStyle = '#3d7a3d'
  ctx.fillRect(x + 4, y + 4, 8, 6)
  ctx.fillStyle = '#56a056'
  ctx.fillRect(x + 5, y + 4, 4, 3)
  // Outline notches
  ctx.fillStyle = '#1a2e1a'
  ctx.fillRect(x + 2, y + 4, 1, 7)
  ctx.fillRect(x + 13, y + 4, 1, 7)
  ctx.fillRect(x + 3, y + 2, 10, 1)
  ctx.fillRect(x + 3, y + 12, 10, 1)
  ctx.fillRect(x + 6, y + 15, 4, 1)
}

function drawPedestal(ctx: CanvasRenderingContext2D, z: Zone, t: number, hover: boolean) {
  const x = z.tx * TILE
  const y = z.ty * TILE
  const w = z.tw * TILE
  const h = z.th * TILE
  // Stone base (lower half)
  const baseY = y + h - 12
  ctx.fillStyle = '#6e6e7a'
  ctx.fillRect(x + 2, baseY, w - 4, 10)
  ctx.fillStyle = '#9090a0'
  ctx.fillRect(x + 3, baseY + 1, w - 6, 6)
  ctx.fillStyle = '#4a4a55'
  ctx.fillRect(x + 2, baseY + 9, w - 4, 1)
  // Outline
  ctx.fillStyle = '#1a1a22'
  ctx.fillRect(x + 1, baseY, 1, 10)
  ctx.fillRect(x + w - 2, baseY, 1, 10)
  ctx.fillRect(x + 2, baseY - 1, w - 4, 1)

  // Glowing gem on top
  const pulse = (Math.sin(t * 3.4 + z.tx) + 1) / 2 // 0..1
  const gemY = y + 3 + (hover ? -1 : 0)
  const gemX = x + w / 2 - 5
  // Glow halo
  const glowR = hover ? 14 : 10 + pulse * 3
  const grad = ctx.createRadialGradient(gemX + 5, gemY + 5, 1, gemX + 5, gemY + 5, glowR)
  grad.addColorStop(0, hexA(z.color, 0.55))
  grad.addColorStop(1, hexA(z.color, 0))
  ctx.fillStyle = grad
  ctx.fillRect(gemX - 8, gemY - 8, 26, 26)
  // Gem body
  ctx.fillStyle = z.color
  ctx.fillRect(gemX + 1, gemY, 8, 9)
  ctx.fillRect(gemX, gemY + 1, 10, 7)
  // Highlight
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.fillRect(gemX + 2, gemY + 2, 2, 2)
  // Letter on gem (very small)
  ctx.fillStyle = z.color === '#ffffff' ? '#000' : '#000'
  ctx.font = 'bold 6px monospace'
  ctx.textAlign = 'center'
  ctx.fillText(z.letter, gemX + 5, gemY + 7)
  ctx.textAlign = 'start'
}

function drawPlayer(ctx: CanvasRenderingContext2D, x: number, y: number, dir: Dir, walkT: number) {
  const frame = Math.floor(walkT * 8) % 2 // 0 or 1
  const bob = frame === 1 ? 1 : 0
  const px = Math.round(x)
  const py = Math.round(y) - bob

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.25)'
  ctx.fillRect(px + 1, py + PLAYER_H - 1, PLAYER_W - 2, 2)

  // Body
  // Head (round)
  ctx.fillStyle = '#1a1a22'
  ctx.fillRect(px + 2, py, 6, 1) // top outline
  ctx.fillRect(px + 1, py + 1, 8, 1)
  ctx.fillRect(px + 1, py + 2, 1, 3)
  ctx.fillRect(px + 8, py + 2, 1, 3)
  ctx.fillRect(px + 2, py + 5, 6, 1)
  // Hair (dark brown)
  ctx.fillStyle = '#3a261a'
  ctx.fillRect(px + 2, py + 1, 6, 2)
  // Face skin
  ctx.fillStyle = '#f4c8a0'
  ctx.fillRect(px + 2, py + 3, 6, 2)
  // Eyes — direction dependent
  ctx.fillStyle = '#1a1a22'
  if (dir === 'down') {
    ctx.fillRect(px + 3, py + 3, 1, 1)
    ctx.fillRect(px + 6, py + 3, 1, 1)
  } else if (dir === 'up') {
    // Back of head — just hair
    ctx.fillStyle = '#3a261a'
    ctx.fillRect(px + 2, py + 3, 6, 2)
  } else if (dir === 'left') {
    ctx.fillRect(px + 3, py + 3, 1, 1)
  } else {
    ctx.fillRect(px + 6, py + 3, 1, 1)
  }

  // Shirt (purple — matches portal accent)
  ctx.fillStyle = '#1a1a22'
  ctx.fillRect(px + 1, py + 6, 8, 1)
  ctx.fillRect(px + 0, py + 7, 1, 3)
  ctx.fillRect(px + 9, py + 7, 1, 3)
  ctx.fillRect(px + 1, py + 10, 8, 1)
  ctx.fillStyle = '#a06bff'
  ctx.fillRect(px + 1, py + 7, 8, 3)
  // Belt highlight
  ctx.fillStyle = '#6c3fcc'
  ctx.fillRect(px + 1, py + 9, 8, 1)

  // Legs (dark) with walk cycle
  ctx.fillStyle = '#1a1a22'
  if (frame === 0) {
    ctx.fillRect(px + 2, py + 11, 2, 1)
    ctx.fillRect(px + 6, py + 11, 2, 1)
  } else {
    ctx.fillRect(px + 3, py + 11, 2, 1)
    ctx.fillRect(px + 5, py + 11, 2, 1)
  }
}

function hexA(hex: string, a: number) {
  // Accept #rgb or #rrggbb
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${a})`
}
