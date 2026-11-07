// Mutable per-frame state shared between the DOM and the 3D scene.
// Deliberately not React state: the scene reads it 60 times a second.
export const S = {
  y: 0,
  progress: 0,
  vel: 0, // smoothed scroll velocity, px/s
  speed: 0, // |vel|
  formation: 0, // float, which pen formation we're in (see scene/formations.js)
  mouse: { x: 0, y: 0 },
  stormStart: -100,
  titleKick: 0,
  hoverPen: false,
  calm: false,
  mega: false,
}

export const now = () => performance.now() / 1000

export const clamp = (x, a, b) => Math.min(b, Math.max(a, x))
export const smoothstep = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}
export const hash = (i) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return s - Math.floor(s)
}

export const STORM_LENGTH = 4.6
export function stormWeight(t) {
  const e = t - S.stormStart
  if (e < 0 || e > STORM_LENGTH) return 0
  return smoothstep(0, 0.4, e) * (1 - smoothstep(STORM_LENGTH - 0.8, STORM_LENGTH, e))
}

// Formation float: holds a section's formation for most of the section,
// then morphs into the next one over the section's last 30%.
function computeFormation(y) {
  const secs = document.querySelectorAll('[data-formation]')
  if (!secs.length) return 0
  const c = y + innerHeight / 2
  let f = +secs[0].dataset.formation
  for (let i = 0; i < secs.length; i++) {
    const r = secs[i].getBoundingClientRect()
    const top = r.top + y
    if (c < top) break
    const k = +secs[i].dataset.formation
    const next = secs[i + 1] ? +secs[i + 1].dataset.formation : k
    f = k + smoothstep(0.7, 1, (c - top) / r.height) * (next - k)
  }
  return f
}

export function startTracking() {
  let lastY = scrollY
  let lastT = performance.now()
  let raf
  const onMove = (e) => {
    S.mouse.x = (e.clientX / innerWidth) * 2 - 1
    S.mouse.y = -((e.clientY / innerHeight) * 2 - 1)
  }
  const tick = () => {
    const t = performance.now()
    const dt = Math.max(1, t - lastT) / 1000
    const y = scrollY
    S.vel += ((y - lastY) / dt - S.vel) * Math.min(1, dt * 10)
    S.speed = Math.abs(S.vel)
    lastY = y
    lastT = t
    S.y = y
    const max = document.documentElement.scrollHeight - innerHeight
    S.progress = max > 0 ? y / max : 0
    S.formation = computeFormation(y)
    raf = requestAnimationFrame(tick)
  }
  addEventListener('pointermove', onMove, { passive: true })
  raf = requestAnimationFrame(tick)
  return () => {
    cancelAnimationFrame(raf)
    removeEventListener('pointermove', onMove)
  }
}

export function confettiAt(x, y, amount = 28) {
  dispatchEvent(new CustomEvent('pen-confetti', { detail: { x, y, amount } }))
}
