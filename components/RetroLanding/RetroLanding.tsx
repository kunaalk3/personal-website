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
// T = tree (solid), W = waterfall (solid), . = grass, , = grass alt, f = flower
const MAP: string[] = [
  'TTTTTTTTTTTTTTTTTTTT',
  'T.WW.f.............T',
  'T.WW...,...........T',
  'T.WW...............T',
  'T.WW...........,...T',
  'T.WW.f.............T',
  'T...........,......T',
  'T...,.....f........T',
  'T..................T',
  'T..f...........,...T',
  'T..................T',
  'T..........f.......T',
  'T..,...,.......f...T',
  'TTTTTTTTTTTTTTTTTTTT',
]

const SOLID = new Set(['T', 'W'])

// --- Zones ---
type ZoneId =
  | 'linkedin'
  | 'github'
  | 'instagram'
  | 'snake'
  | 'portfolio'
  | 'food'
  | 'gym'

type Zone = {
  id: ZoneId
  tx: number
  ty: number
  tw: number
  th: number
  label: string
  sub: string
  letter: string
  color: string
  action: 'link' | 'game' | 'enter' | 'easter'
  url?: string
}

// Portfolio sits at the world centre (cols 9-10, rows 6-7)
const ZONES: Zone[] = [
  {
    id: 'linkedin',
    tx: 5, ty: 2, tw: 2, th: 2,
    label: 'LINKEDIN', sub: 'Open profile',
    letter: 'in', color: '#3aa0ff',
    action: 'link', url: LINKS.linkedin,
  },
  {
    id: 'github',
    tx: 13, ty: 2, tw: 2, th: 2,
    label: 'GITHUB', sub: 'View repos',
    letter: 'GH', color: '#ffffff',
    action: 'link', url: LINKS.github,
  },
  {
    id: 'gym',
    tx: 16, ty: 5, tw: 2, th: 2,
    label: 'GYM', sub: 'Bench press',
    letter: '◣◢', color: '#ff5555',
    action: 'easter',
  },
  {
    id: 'portfolio',
    tx: 9, ty: 6, tw: 2, th: 2,
    label: 'PORTFOLIO', sub: 'Enter the site',
    letter: 'KR', color: '#a06bff',
    action: 'enter',
  },
  {
    id: 'food',
    tx: 5, ty: 10, tw: 2, th: 2,
    label: 'FOOD', sub: 'Sous chef stop',
    letter: '◐', color: '#ffd158',
    action: 'easter',
  },
  {
    id: 'instagram',
    tx: 9, ty: 10, tw: 2, th: 2,
    label: 'INSTAGRAM', sub: 'Follow',
    letter: 'IG', color: '#ff4f87',
    action: 'link', url: LINKS.instagram,
  },
  {
    id: 'snake',
    tx: 13, ty: 10, tw: 2, th: 2,
    label: 'ARCADE', sub: 'Play Snake',
    letter: 'AR', color: '#ffd13a',
    action: 'game',
  },
]

// --- Player physics ---
const PLAYER_W = 10
const PLAYER_H = 12
const PLAYER_SPEED = 60

type Vec = { x: number; y: number }
type Dir = 'down' | 'up' | 'left' | 'right'

export default function RetroLanding({ onEnterSite }: { onEnterSite: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const playerRef = useRef<Vec>({ x: W / 2 - PLAYER_W / 2, y: 12 * TILE + 2 })
  const dirRef = useRef<Dir>('up')
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
        const z = activeZoneFromPos(playerRef.current)
        if (z && z.action !== 'easter') triggerZone(z)
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

  useEffect(() => {
    const fit = () => {
      const c = canvasRef.current
      if (!c) return
      const vw = window.innerWidth
      const vh = window.innerHeight
      const horizontalMargin = 40
      const verticalMargin = 80 + (started ? 220 : 80)
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
      p.x = Math.max(0, Math.min(W - PLAYER_W, p.x))
      p.y = Math.max(0, Math.min(H - PLAYER_H, p.y))

      if (movingRef.current) walkTRef.current += dt

      const z = activeZoneFromPos(p)
      setActiveZone((prev) => (prev?.id === z?.id ? prev : z))

      render(ctx, p, dirRef.current, movingRef.current ? walkTRef.current : 0, tRef.current, z)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [started, showSnake])

  const onActionTap = () => {
    const z = activeZoneFromPos(playerRef.current)
    if (z && z.action !== 'easter') triggerZone(z)
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
          style={{ ...skipBtn, pointerEvents: 'auto' }}
        >
          SKIP ▶▶
        </button>
      </div>

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
            WALK ONTO A PEDESTAL · PRESS [E / SPACE / TAP B] · WANDER FOR EASTER EGGS
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
            whiteSpace: 'nowrap',
            maxWidth: 'calc(100vw - 32px)',
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
          {activeZone.action !== 'easter' && (
            <>
              <span style={{ opacity: 0.55 }}>·</span>
              <span style={{ opacity: 0.9 }}>[E / TAP B]</span>
            </>
          )}
        </div>
      )}

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
                background:
                  activeZone && activeZone.action !== 'easter'
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
                boxShadow: 'inset 0 -6px 8px rgba(0,0,0,0.35), 0 6px 14px rgba(0,0,0,0.5)',
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
  const x1 = px
  const x2 = px + PLAYER_W - 1
  const y1 = py + PLAYER_H / 2
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

// --- Rendering (original green Pokémon-style palette) ---
function render(
  ctx: CanvasRenderingContext2D,
  player: Vec,
  dir: Dir,
  walkT: number,
  t: number,
  active: Zone | null
) {
  // Grass background
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

  // Flowers
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (MAP[y][x] === 'f') drawFlower(ctx, x * TILE, y * TILE, (x * 7 + y * 13) % 3)
    }
  }

  // Pond at base of waterfall (decorative)
  drawPond(ctx, 1 * TILE + 8, 5 * TILE + 12, t)

  // Trees & waterfall (solid tiles)
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const ch = MAP[y][x]
      if (ch === 'T') drawTree(ctx, x * TILE, y * TILE)
      else if (ch === 'W') drawWaterfall(ctx, x * TILE, y * TILE, t, y)
    }
  }

  // Portfolio gets a special swirl pad underneath
  const portfolio = ZONES.find((z) => z.id === 'portfolio')!
  drawPortalPad(ctx, portfolio, t)

  // Zone props
  for (const z of ZONES) {
    if (z.id === 'food') drawFoodTile(ctx, z, t, active?.id === z.id)
    else if (z.id === 'gym') drawGymTile(ctx, z, t, active?.id === z.id)
    else drawPedestal(ctx, z, t, active?.id === z.id)
  }

  // Player (with easter-egg states)
  if (active?.id === 'food') {
    drawPlayerEating(ctx, player.x, player.y, t)
  } else if (active?.id === 'gym') {
    drawPlayerBenching(ctx, player.x, player.y, t)
  } else {
    drawPlayer(ctx, player.x, player.y, dir, walkT)
  }

  // Zone labels
  ctx.font = 'bold 6px monospace'
  ctx.textAlign = 'center'
  for (const z of ZONES) {
    const cx = z.tx * TILE + (z.tw * TILE) / 2
    const cy = z.ty * TILE - 2
    const isActive = active?.id === z.id
    ctx.fillStyle = isActive ? '#fff' : 'rgba(255,255,255,0.78)'
    ctx.fillText(z.label, cx, cy)
  }
  ctx.textAlign = 'start'

  // Vignette
  const grad = ctx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 0.85)
  grad.addColorStop(0, 'rgba(0,0,0,0)')
  grad.addColorStop(1, 'rgba(0,0,0,0.32)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)
}

function drawGrass(ctx: CanvasRenderingContext2D, x: number, y: number, alt: boolean) {
  ctx.fillStyle = alt ? '#5e9a4e' : '#5a924a'
  ctx.fillRect(x, y, TILE, TILE)
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  ctx.fillRect(x + 3, y + 5, 1, 2)
  ctx.fillRect(x + 11, y + 9, 1, 2)
  ctx.fillStyle = 'rgba(0,0,0,0.08)'
  ctx.fillRect(x + 7, y + 12, 2, 1)
}

function drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number, variant: number) {
  const cx = x + 8
  const cy = y + 9
  const colors = ['#ffe66d', '#ff6b6b', '#cdb4ff']
  const c = colors[variant % colors.length]
  ctx.fillStyle = '#2d5a2d'
  ctx.fillRect(cx, cy + 1, 1, 3)
  ctx.fillStyle = c
  ctx.fillRect(cx - 1, cy - 1, 3, 3)
  ctx.fillStyle = '#fff8c2'
  ctx.fillRect(cx, cy, 1, 1)
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#5a924a'
  ctx.fillRect(x, y, TILE, TILE)
  ctx.fillStyle = '#5a3a1f'
  ctx.fillRect(x + 7, y + 11, 2, 4)
  ctx.fillStyle = '#2d5a2d'
  ctx.fillRect(x + 3, y + 3, 10, 9)
  ctx.fillStyle = '#3d7a3d'
  ctx.fillRect(x + 4, y + 4, 8, 6)
  ctx.fillStyle = '#56a056'
  ctx.fillRect(x + 5, y + 4, 4, 3)
  ctx.fillStyle = '#1a2e1a'
  ctx.fillRect(x + 2, y + 4, 1, 7)
  ctx.fillRect(x + 13, y + 4, 1, 7)
  ctx.fillRect(x + 3, y + 2, 10, 1)
  ctx.fillRect(x + 3, y + 12, 10, 1)
  ctx.fillRect(x + 6, y + 15, 4, 1)
}

function drawWaterfall(ctx: CanvasRenderingContext2D, x: number, y: number, t: number, row: number) {
  // Base water
  ctx.fillStyle = '#3a6dd9'
  ctx.fillRect(x, y, TILE, TILE)
  // Edges (rock)
  ctx.fillStyle = '#5a4a3a'
  ctx.fillRect(x, y, 1, TILE)
  ctx.fillRect(x + TILE - 1, y, 1, TILE)
  // Animated white streaks falling
  for (let i = 0; i < 3; i++) {
    const offset = (t * 38 + i * 17 + row * 7) % TILE
    const sy = y + offset
    const sx = x + 3 + ((i * 5) % (TILE - 6))
    ctx.fillStyle = '#cfe6ff'
    ctx.fillRect(sx, sy, 1, 3)
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.fillRect(sx, sy + 3, 1, 2)
  }
  // Foam sparkle
  if (Math.floor(t * 6) % 3 === row % 3) {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(x + ((row * 5) % 12) + 2, y + 2, 1, 1)
  }
}

function drawPond(ctx: CanvasRenderingContext2D, cx: number, cy: number, t: number) {
  // Small oval pond beneath the waterfall
  ctx.fillStyle = '#2d56a8'
  ctx.fillRect(cx - 12, cy, 24, 6)
  ctx.fillRect(cx - 14, cy + 1, 28, 4)
  ctx.fillStyle = '#3a6dd9'
  ctx.fillRect(cx - 11, cy + 1, 22, 4)
  // Ripples
  const r = (t * 30) % 8
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.ellipse(cx, cy + 3, 3 + r, 1.2 + r * 0.2, 0, 0, Math.PI * 2)
  ctx.stroke()
}

function drawPortalPad(ctx: CanvasRenderingContext2D, z: Zone, t: number) {
  // Animated swirl beneath the portfolio pedestal
  const cx = z.tx * TILE + (z.tw * TILE) / 2
  const cy = z.ty * TILE + (z.th * TILE) / 2
  const radius = 22
  const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius)
  grad.addColorStop(0, 'rgba(160,107,255,0.45)')
  grad.addColorStop(1, 'rgba(160,107,255,0)')
  ctx.fillStyle = grad
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
  // Rotating dashes (4 of them)
  for (let i = 0; i < 6; i++) {
    const a = (t * 2.4) + i * (Math.PI / 3)
    const r = 14
    const dx = Math.cos(a) * r
    const dy = Math.sin(a) * r * 0.55
    ctx.fillStyle = 'rgba(220,200,255,0.6)'
    ctx.fillRect(Math.round(cx + dx), Math.round(cy + dy), 2, 1)
  }
}

function drawPedestal(ctx: CanvasRenderingContext2D, z: Zone, t: number, hover: boolean) {
  const x = z.tx * TILE
  const y = z.ty * TILE
  const w = z.tw * TILE
  const h = z.th * TILE
  const baseY = y + h - 12

  // Stone base
  ctx.fillStyle = '#6e6e7a'
  ctx.fillRect(x + 2, baseY, w - 4, 10)
  ctx.fillStyle = '#9090a0'
  ctx.fillRect(x + 3, baseY + 1, w - 6, 6)
  ctx.fillStyle = '#4a4a55'
  ctx.fillRect(x + 2, baseY + 9, w - 4, 1)
  ctx.fillStyle = '#1a1a22'
  ctx.fillRect(x + 1, baseY, 1, 10)
  ctx.fillRect(x + w - 2, baseY, 1, 10)
  ctx.fillRect(x + 2, baseY - 1, w - 4, 1)

  // Glowing gem on top
  const pulse = (Math.sin(t * 3.4 + z.tx) + 1) / 2
  const gemY = y + 3 + (hover ? -1 : 0)
  const gemX = x + w / 2 - 5
  const glowR = hover ? 14 : 10 + pulse * 3
  const grad = ctx.createRadialGradient(gemX + 5, gemY + 5, 1, gemX + 5, gemY + 5, glowR)
  grad.addColorStop(0, hexA(z.color, 0.55))
  grad.addColorStop(1, hexA(z.color, 0))
  ctx.fillStyle = grad
  ctx.fillRect(gemX - 8, gemY - 8, 26, 26)
  ctx.fillStyle = z.color
  ctx.fillRect(gemX + 1, gemY, 8, 9)
  ctx.fillRect(gemX, gemY + 1, 10, 7)
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.fillRect(gemX + 2, gemY + 2, 2, 2)
  ctx.fillStyle = '#000'
  ctx.font = 'bold 6px monospace'
  ctx.textAlign = 'center'
  ctx.fillText(z.letter, gemX + 5, gemY + 7)
  ctx.textAlign = 'start'
}

function drawFoodTile(ctx: CanvasRenderingContext2D, z: Zone, t: number, hover: boolean) {
  // Wooden picnic table with a plate of food on top
  const x = z.tx * TILE
  const y = z.ty * TILE
  const w = z.tw * TILE
  const h = z.th * TILE
  const baseY = y + h - 10

  // Table top (wood)
  ctx.fillStyle = '#7a4a22'
  ctx.fillRect(x + 2, baseY, w - 4, 5)
  ctx.fillStyle = '#9b6a32'
  ctx.fillRect(x + 2, baseY + 1, w - 4, 2)
  // Plank lines
  ctx.fillStyle = '#5a3018'
  ctx.fillRect(x + 8, baseY, 1, 5)
  ctx.fillRect(x + 16, baseY, 1, 5)
  // Legs
  ctx.fillStyle = '#5a3018'
  ctx.fillRect(x + 4, baseY + 5, 1, 4)
  ctx.fillRect(x + w - 5, baseY + 5, 1, 4)
  // Outline
  ctx.fillStyle = '#3a1f10'
  ctx.fillRect(x + 1, baseY, 1, 6)
  ctx.fillRect(x + w - 2, baseY, 1, 6)
  ctx.fillRect(x + 2, baseY - 1, w - 4, 1)

  // Plate (white circle simulated)
  const plateY = baseY - 3
  const plateX = x + w / 2 - 5
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(plateX + 1, plateY, 8, 3)
  ctx.fillStyle = '#d8d8d8'
  ctx.fillRect(plateX + 2, plateY + 2, 6, 1)

  // Food: rice ball / sushi roll
  ctx.fillStyle = '#222'
  ctx.fillRect(plateX + 2, plateY - 1, 2, 1) // nori band
  ctx.fillStyle = '#f5e8c5'
  ctx.fillRect(plateX + 3, plateY - 1, 4, 1)
  ctx.fillStyle = '#ff8888'
  ctx.fillRect(plateX + 4, plateY - 2, 2, 1) // salmon top
  ctx.fillStyle = '#222'
  ctx.fillRect(plateX + 6, plateY - 1, 2, 1)

  // Steam wisps
  const steamY = plateY - 4 - Math.sin(t * 4) * 1
  ctx.fillStyle = `rgba(255,255,255,${0.35 + 0.2 * Math.sin(t * 3)})`
  ctx.fillRect(plateX + 3, steamY, 1, 2)
  ctx.fillRect(plateX + 6, steamY - 1, 1, 2)

  if (hover) {
    const grad = ctx.createRadialGradient(plateX + 5, plateY, 2, plateX + 5, plateY, 14)
    grad.addColorStop(0, hexA(z.color, 0.4))
    grad.addColorStop(1, hexA(z.color, 0))
    ctx.fillStyle = grad
    ctx.fillRect(plateX - 8, plateY - 8, 26, 24)
  }
}

function drawGymTile(ctx: CanvasRenderingContext2D, z: Zone, t: number, hover: boolean) {
  // Wooden bench with a steel barbell on the rack
  const x = z.tx * TILE
  const y = z.ty * TILE
  const w = z.tw * TILE
  const h = z.th * TILE
  const benchY = y + h - 8

  // Rack uprights (metal silver)
  ctx.fillStyle = '#6a6a78'
  ctx.fillRect(x + 4, y + 4, 2, 9)
  ctx.fillRect(x + w - 6, y + 4, 2, 9)
  ctx.fillStyle = '#a8a8b8'
  ctx.fillRect(x + 4, y + 4, 2, 1)
  ctx.fillRect(x + w - 6, y + 4, 2, 1)
  ctx.fillStyle = '#3a3a45'
  ctx.fillRect(x + 4, y + 12, 2, 1)
  ctx.fillRect(x + w - 6, y + 12, 2, 1)

  // Barbell (animated)
  const barY = y + 6 + (hover ? Math.round(Math.sin(t * 4) * 2) : 0)
  ctx.fillStyle = '#a8a8b8'
  ctx.fillRect(x + 3, barY, w - 6, 2)
  ctx.fillStyle = '#dadae6'
  ctx.fillRect(x + 3, barY, w - 6, 1)
  // Weight plates (red)
  ctx.fillStyle = '#aa2a2a'
  ctx.fillRect(x + 2, barY - 1, 2, 4)
  ctx.fillRect(x + w - 4, barY - 1, 2, 4)
  ctx.fillStyle = '#ff5555'
  ctx.fillRect(x + 2, barY - 1, 2, 1)
  ctx.fillRect(x + w - 4, barY - 1, 2, 1)
  ctx.fillStyle = '#5a0d0d'
  ctx.fillRect(x + 2, barY + 2, 2, 1)
  ctx.fillRect(x + w - 4, barY + 2, 2, 1)

  // Bench (wooden)
  ctx.fillStyle = '#7a4a22'
  ctx.fillRect(x + 3, benchY, w - 6, 3)
  ctx.fillStyle = '#9b6a32'
  ctx.fillRect(x + 3, benchY, w - 6, 1)
  ctx.fillStyle = '#3a1f10'
  ctx.fillRect(x + 3, benchY + 3, w - 6, 1)
  // Legs
  ctx.fillStyle = '#3a3a45'
  ctx.fillRect(x + 5, benchY + 4, 1, 3)
  ctx.fillRect(x + w - 6, benchY + 4, 1, 3)

  if (hover) {
    const grad = ctx.createRadialGradient(x + w / 2, y + h / 2, 2, x + w / 2, y + h / 2, 16)
    grad.addColorStop(0, hexA(z.color, 0.35))
    grad.addColorStop(1, hexA(z.color, 0))
    ctx.fillStyle = grad
    ctx.fillRect(x - 4, y - 4, w + 8, h + 8)
  }
}

function drawPlayer(ctx: CanvasRenderingContext2D, x: number, y: number, dir: Dir, walkT: number) {
  const frame = Math.floor(walkT * 8) % 2
  const bob = frame === 1 ? 1 : 0
  const px = Math.round(x)
  const py = Math.round(y) - bob

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.25)'
  ctx.fillRect(px + 1, py + PLAYER_H - 1, PLAYER_W - 2, 2)

  // Head outline
  ctx.fillStyle = '#1a1a22'
  ctx.fillRect(px + 2, py, 6, 1)
  ctx.fillRect(px + 1, py + 1, 8, 1)
  ctx.fillRect(px + 1, py + 2, 1, 3)
  ctx.fillRect(px + 8, py + 2, 1, 3)
  ctx.fillRect(px + 2, py + 5, 6, 1)
  // Hair
  ctx.fillStyle = '#3a261a'
  ctx.fillRect(px + 2, py + 1, 6, 2)
  // Face
  ctx.fillStyle = '#f4c8a0'
  ctx.fillRect(px + 2, py + 3, 6, 2)
  // Eyes
  ctx.fillStyle = '#1a1a22'
  if (dir === 'down') {
    ctx.fillRect(px + 3, py + 3, 1, 1)
    ctx.fillRect(px + 6, py + 3, 1, 1)
  } else if (dir === 'up') {
    ctx.fillStyle = '#3a261a'
    ctx.fillRect(px + 2, py + 3, 6, 2)
  } else if (dir === 'left') {
    ctx.fillRect(px + 3, py + 3, 1, 1)
  } else {
    ctx.fillRect(px + 6, py + 3, 1, 1)
  }

  // Shirt — purple (portfolio accent)
  ctx.fillStyle = '#1a1a22'
  ctx.fillRect(px + 1, py + 6, 8, 1)
  ctx.fillRect(px + 0, py + 7, 1, 3)
  ctx.fillRect(px + 9, py + 7, 1, 3)
  ctx.fillRect(px + 1, py + 10, 8, 1)
  ctx.fillStyle = '#a06bff'
  ctx.fillRect(px + 1, py + 7, 8, 3)
  ctx.fillStyle = '#6c3fcc'
  ctx.fillRect(px + 1, py + 9, 8, 1)

  // Legs
  ctx.fillStyle = '#1a1a22'
  if (frame === 0) {
    ctx.fillRect(px + 2, py + 11, 2, 1)
    ctx.fillRect(px + 6, py + 11, 2, 1)
  } else {
    ctx.fillRect(px + 3, py + 11, 2, 1)
    ctx.fillRect(px + 5, py + 11, 2, 1)
  }
}

function drawPlayerEating(ctx: CanvasRenderingContext2D, x: number, y: number, t: number) {
  const px = Math.round(x)
  const py = Math.round(y)
  const chew = Math.floor(t * 3.2) % 2

  ctx.fillStyle = 'rgba(0,0,0,0.2)'
  ctx.fillRect(px - 1, py + PLAYER_H, PLAYER_W + 2, 2)

  // Head looking down
  ctx.fillStyle = '#1a1a22'
  ctx.fillRect(px + 2, py + 1, 6, 1)
  ctx.fillRect(px + 1, py + 2, 8, 1)
  ctx.fillRect(px + 1, py + 3, 1, 3)
  ctx.fillRect(px + 8, py + 3, 1, 3)
  ctx.fillRect(px + 2, py + 6, 6, 1)
  ctx.fillStyle = '#3a261a'
  ctx.fillRect(px + 2, py + 2, 6, 2)
  ctx.fillStyle = '#f4c8a0'
  ctx.fillRect(px + 2, py + 4, 6, 2)
  // Closed eyes (chewing happy)
  ctx.fillStyle = '#1a1a22'
  ctx.fillRect(px + 3, py + 4, 1, 1)
  ctx.fillRect(px + 6, py + 4, 1, 1)
  // Mouth
  if (chew === 0) ctx.fillRect(px + 4, py + 5, 2, 1)
  else ctx.fillRect(px + 4, py + 5, 2, 2)

  // Sitting body
  ctx.fillStyle = '#a06bff'
  ctx.fillRect(px + 1, py + 7, 8, 4)
  ctx.fillStyle = '#1a1a22'
  ctx.fillRect(px + 0, py + 7, 1, 4)
  ctx.fillRect(px + 9, py + 7, 1, 4)
  ctx.fillRect(px + 1, py + 11, 8, 1)
  ctx.fillStyle = '#6c3fcc'
  ctx.fillRect(px + 1, py + 10, 8, 1)

  // Bowl in front
  const bowlY = py + 9
  const bowlX = px - 4
  ctx.fillStyle = '#fff'
  ctx.fillRect(bowlX, bowlY, 5, 1)
  ctx.fillRect(bowlX - 1, bowlY + 1, 7, 2)
  ctx.fillStyle = '#ff8888'
  ctx.fillRect(bowlX + 1, bowlY - 1, 3, 1)

  // Steam wisps
  const sy = py + 4 + Math.sin(t * 4) * 1
  ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.25 * Math.sin(t * 3.5)})`
  ctx.fillRect(bowlX + 1, sy, 1, 2)
  ctx.fillRect(bowlX + 3, sy - 1, 1, 2)

  // "*munch*" floater
  if (Math.floor(t * 1.6) % 2 === 0) {
    ctx.fillStyle = 'rgba(255,230,160,0.95)'
    ctx.font = '5px monospace'
    ctx.fillText('*munch*', px - 6, py - 2)
  }
}

function drawPlayerBenching(ctx: CanvasRenderingContext2D, x: number, y: number, t: number) {
  const px = Math.round(x)
  const py = Math.round(y)
  const lift = (Math.sin(t * 3) + 1) / 2
  const barDrop = Math.round(lift * 4)

  // Bench under player
  ctx.fillStyle = '#7a4a22'
  ctx.fillRect(px - 2, py + 8, PLAYER_W + 4, 3)
  ctx.fillStyle = '#9b6a32'
  ctx.fillRect(px - 2, py + 8, PLAYER_W + 4, 1)
  ctx.fillStyle = '#3a1f10'
  ctx.fillRect(px - 2, py + 11, PLAYER_W + 4, 1)

  // Player lying down (head left)
  // Head
  ctx.fillStyle = '#1a1a22'
  ctx.fillRect(px - 4, py + 5, 1, 3)
  ctx.fillRect(px - 3, py + 4, 4, 1)
  ctx.fillRect(px + 1, py + 5, 1, 3)
  ctx.fillRect(px - 3, py + 8, 4, 1)
  ctx.fillStyle = '#f4c8a0'
  ctx.fillRect(px - 3, py + 5, 4, 3)
  ctx.fillStyle = '#3a261a'
  ctx.fillRect(px - 2, py + 5, 1, 1)
  ctx.fillStyle = '#1a1a22'
  ctx.fillRect(px - 1, py + 6, 1, 1)

  // Torso
  ctx.fillStyle = '#1a1a22'
  ctx.fillRect(px + 1, py + 4, PLAYER_W - 2, 1)
  ctx.fillRect(px + 1, py + 8, PLAYER_W - 2, 1)
  ctx.fillStyle = '#a06bff'
  ctx.fillRect(px + 1, py + 5, PLAYER_W - 2, 3)
  ctx.fillStyle = '#6c3fcc'
  ctx.fillRect(px + 1, py + 6, PLAYER_W - 2, 1)

  // Legs
  ctx.fillStyle = '#1a1a22'
  ctx.fillRect(px + PLAYER_W - 1, py + 5, 3, 1)
  ctx.fillRect(px + PLAYER_W - 1, py + 7, 3, 1)
  ctx.fillStyle = '#3a261a'
  ctx.fillRect(px + PLAYER_W, py + 6, 2, 1)

  // Arms reaching up
  const armY = py + 1 + barDrop
  ctx.fillStyle = '#f4c8a0'
  ctx.fillRect(px + 1, armY, 1, 7 - barDrop)
  ctx.fillRect(px + PLAYER_W - 2, armY, 1, 7 - barDrop)

  // Barbell
  const barY = py - 2 + barDrop
  const barLeft = px - 4
  const barRight = px + PLAYER_W + 3
  ctx.fillStyle = '#a8a8b8'
  ctx.fillRect(barLeft, barY, barRight - barLeft, 2)
  ctx.fillStyle = '#dadae6'
  ctx.fillRect(barLeft, barY, barRight - barLeft, 1)
  // Plates
  ctx.fillStyle = '#aa2a2a'
  ctx.fillRect(barLeft - 1, barY - 1, 2, 4)
  ctx.fillRect(barRight - 1, barY - 1, 2, 4)
  ctx.fillStyle = '#ff5555'
  ctx.fillRect(barLeft - 1, barY - 1, 2, 1)
  ctx.fillRect(barRight - 1, barY - 1, 2, 1)

  // Effort sparkles + REP! shout
  if (lift > 0.85) {
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.fillRect(px + 2 + Math.floor(Math.random() * 6), py - 4, 1, 1)
    ctx.font = '5px monospace'
    ctx.fillStyle = 'rgba(255,85,85,0.95)'
    ctx.fillText('REP!', px - 1, py - 6)
  }
}

function hexA(hex: string, a: number) {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${a})`
}
