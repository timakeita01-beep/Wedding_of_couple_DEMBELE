import { useEffect, useRef } from 'react'
import './Sparkles.css'

/**
 * Gold glitter drifting along the screen edges, drawn on a single canvas.
 * Each flake has a depth (z) that drives its size, speed, opacity and scroll
 * parallax, and spins on itself — catching the light when it faces the guest.
 *
 * Trigger a burst from anywhere with:
 *   window.dispatchEvent(new CustomEvent('sparkles:burst', { detail: { x, y } }))
 */

const COLORS = [
  [216, 192, 147], // champagne gold
  [176, 137, 72], // deep gold
  [196, 160, 98], // gold
  [236, 214, 206], // rose powder
  [250, 236, 205], // pale gold
  [201, 150, 128], // rose gold
]

const rand = (min, max) => min + Math.random() * (max - min)
const pick = (list) => list[Math.floor(Math.random() * list.length)]

function edgeX(width) {
  const band = width < 700 ? 0.17 : 0.13
  const t = Math.pow(Math.random(), 1.6) * band // denser right at the edge
  return (Math.random() < 0.5 ? t : 1 - t) * width
}

function makeFlake(width, height, anywhere = false) {
  const z = rand(0.15, 1)
  return {
    kind: Math.random() < 0.3 ? 'star' : 'flake',
    x: edgeX(width),
    y: anywhere ? rand(0, height) : rand(-40, -10),
    z,
    size: rand(2.8, 5.6),
    vy: rand(8, 22) * (0.4 + z), // px per second
    sway: rand(6, 18),
    phase: rand(0, Math.PI * 2),
    spin: rand(-1.4, 1.4), // in-plane rotation speed
    rot: rand(0, Math.PI * 2),
    flip: rand(0, Math.PI * 2), // 3D rotation angle
    flipSpeed: rand(1.5, 4) * (Math.random() < 0.5 ? -1 : 1),
    color: pick(COLORS),
  }
}

function makeBurstFlake(x, y) {
  const angle = rand(-Math.PI, 0) // upward half
  const speed = rand(120, 420)
  return {
    ...makeFlake(0, 0),
    kind: Math.random() < 0.3 ? 'star' : 'flake',
    x,
    y,
    z: rand(0.5, 1),
    vx: Math.cos(angle) * speed,
    vyBurst: Math.sin(angle) * speed,
    life: 1,
    decay: rand(0.35, 0.6),
  }
}

function drawFlake(ctx, p, alpha) {
  const s = p.size * (0.45 + p.z * 0.9)
  const facing = Math.cos(p.flip) // −1..1: how much the flake faces us
  const shine = Math.abs(facing)
  const [r, g, b] = p.color
  const light = 0.55 + shine * 0.45

  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rot)
  ctx.scale(Math.max(0.12, shine), 1) // 3D spin: flake gets thin when edge-on
  ctx.globalAlpha = alpha
  ctx.fillStyle = `rgb(${(r * light) | 0}, ${(g * light) | 0}, ${(b * light) | 0})`
  ctx.beginPath()
  // Hexagonal sequin
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i
    ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s)
  }
  ctx.closePath()
  ctx.fill()
  ctx.restore()

  // Glint when the flake faces the light
  if (shine > 0.93) {
    const glint = (shine - 0.93) / 0.07
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.globalAlpha = alpha * glint * 0.9
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, s * 3.2)
    grad.addColorStop(0, 'rgba(255, 250, 235, 1)')
    grad.addColorStop(1, 'rgba(255, 250, 235, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(p.x - s * 3.2, p.y - s * 3.2, s * 6.4, s * 6.4)
    ctx.restore()
  }
}

function drawStar(ctx, p, alpha, time) {
  const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(time * 1.6 + p.phase))
  const s = p.size * (0.9 + p.z * 1.4) * twinkle
  const [r, g, b] = p.color
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rot * 0.3)
  ctx.globalCompositeOperation = 'lighter'
  ctx.globalAlpha = alpha * twinkle
  ctx.fillStyle = `rgb(${Math.min(255, r + 30)}, ${Math.min(255, g + 30)}, ${Math.min(255, b + 30)})`
  ctx.beginPath()
  // Four-point star
  ctx.moveTo(0, -s * 2.4)
  ctx.quadraticCurveTo(0, 0, s * 2.4, 0)
  ctx.quadraticCurveTo(0, 0, 0, s * 2.4)
  ctx.quadraticCurveTo(0, 0, -s * 2.4, 0)
  ctx.quadraticCurveTo(0, 0, 0, -s * 2.4)
  ctx.fill()
  ctx.restore()
}

export function Sparkles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let width = 0
    let height = 0
    let flakes = []
    let bursts = []
    let frame = 0
    let last = performance.now()
    let lastScroll = window.scrollY

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = width < 700 ? 38 : 64
      flakes = Array.from({ length: count }, () => makeFlake(width, height, true))
    }

    const onBurst = (e) => {
      const { x = width / 2, y = height / 2, count = 46 } = e.detail || {}
      for (let i = 0; i < count; i++) bursts.push(makeBurstFlake(x, y))
    }

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const time = now / 1000

      // Scroll parallax: nearer flakes move more, giving depth.
      const scrollDelta = window.scrollY - lastScroll
      lastScroll = window.scrollY

      ctx.clearRect(0, 0, width, height)

      for (const p of flakes) {
        p.y += p.vy * dt - scrollDelta * p.z * 0.35
        p.rot += p.spin * dt
        p.flip += p.flipSpeed * dt
        const x = p.x + Math.sin(time * 0.8 + p.phase) * p.sway * p.z
        // Recycle: leaving at the bottom → re-enter at the top, and vice versa (fast scroll down).
        if (p.y > height + 20) Object.assign(p, makeFlake(width, height))
        else if (p.y < -60) Object.assign(p, makeFlake(width, height), { y: height + 10 })

        const alpha = 0.45 + p.z * 0.55
        const drawn = { ...p, x }
        if (p.kind === 'star') drawStar(ctx, drawn, alpha * 0.8, time)
        else drawFlake(ctx, drawn, alpha)
      }

      bursts = bursts.filter((p) => p.life > 0)
      for (const p of bursts) {
        p.vyBurst += 380 * dt // gravity
        p.vx *= 0.985
        p.x += p.vx * dt
        p.y += p.vyBurst * dt
        p.rot += p.spin * 3 * dt
        p.flip += p.flipSpeed * 2 * dt
        p.life -= p.decay * dt
        const alpha = Math.max(0, p.life)
        if (p.kind === 'star') drawStar(ctx, p, alpha, time)
        else drawFlake(ctx, p, alpha)
      }

      frame = requestAnimationFrame(tick)
    }

    const onVisibility = () => {
      cancelAnimationFrame(frame)
      if (!document.hidden) {
        last = performance.now()
        frame = requestAnimationFrame(tick)
      }
    }

    resize()
    frame = requestAnimationFrame(tick)
    window.addEventListener('resize', resize)
    window.addEventListener('sparkles:burst', onBurst)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('sparkles:burst', onBurst)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} className="sparkles" aria-hidden="true" />
}
