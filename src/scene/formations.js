import { Vector3 } from 'three'
import { hash } from '../store.js'

// Every formation places pen i of n at time t, writing into `o`:
//   o.p     position
//   o.d     direction the graphite tip points
//   o.spin  rotation around the pen's own axis
//   o.scale size
// Pens lerp between consecutive formations as you scroll.

export const PEN_LEN = 3.4
const TAU = Math.PI * 2

export const makeOut = () => ({ p: new Vector3(), d: new Vector3(0, 1, 0), spin: 0, scale: 1 })

const dens = (n) => (n > 15 ? 0.42 : 0.9)

// 0 — orbiting ring around the title
function ring(i, n, t, o) {
  const layer = n > 15 ? i % 4 : 0
  const a = (i / n) * TAU + t * (0.6 + layer * 0.15)
  const r = 6.8 + layer * 1.3
  o.p.set(Math.cos(a) * r, Math.sin(a * 3 + t * 2) * 0.7 + (layer - 1.5) * 0.6 * (n > 15), Math.sin(a) * r)
  o.d.set(-Math.sin(a), 0.25 * Math.sin(t + i), Math.cos(a))
  o.spin = t * 4 + i
  o.scale = dens(n)
}

// 1 — a wall of pens all spinning like the original 1999 site
function grid(i, n, t, o) {
  const cols = n > 15 ? 15 : 5
  const rows = Math.ceil(n / cols)
  const c = i % cols
  const r = Math.floor(i / cols)
  const sx = 13 / (cols - 1)
  const sy = rows > 1 ? 8 / (rows - 1) : 0
  const th = t * Math.PI + (c + r) * 0.5
  o.p.set((c - (cols - 1) / 2) * sx, ((rows - 1) / 2 - r) * sy, Math.sin(t * 2 + c * 0.6 + r) * 0.8)
  o.d.set(Math.sin(th), Math.cos(th), 0)
  o.spin = t * 2
  o.scale = Math.min(0.95, sx / 3.6)
}

// 2 — DNA double helix
function helix(i, n, t, o) {
  const u = n > 1 ? i / (n - 1) : 0
  const strand = i % 2
  const a = u * TAU * 2 + t * 1.2 + strand * Math.PI
  const r = 3.2
  o.p.set(Math.cos(a) * r, (u - 0.5) * 13, Math.sin(a) * r)
  o.d.set(Math.cos(a), 0.3, Math.sin(a))
  o.spin = t * 6
  o.scale = dens(n)
}

// 3 — tornado, pens continuously sucked upward
function tornado(i, n, t, o) {
  const u = (i / n + t * 0.07) % 1
  const r = 1 + u * 6.5
  const a = t * 3 + i * 2.4
  o.p.set(Math.cos(a) * r, -6 + u * 15, Math.sin(a) * r)
  o.d.set(-Math.sin(a), 0.5, Math.cos(a))
  o.spin = t * 10
  o.scale = dens(n) * (0.5 + u * 0.7) * Math.sqrt(Math.sin(u * Math.PI))
}

// 4 — the pens spell "15"
const STROKES = [
  [[-5, 2.6], [-3.6, 4], [-3.6, -4]],
  [[4.5, 4], [0.6, 4], [0.6, 0.6], [2.6, 0.9], [4, 0], [4.4, -1.8], [3.8, -3.3], [2.4, -4], [0.4, -3.6]],
]
const SEGS = []
let TOTAL = 0
for (const s of STROKES) {
  for (let k = 0; k < s.length - 1; k++) {
    const [ax, ay] = s[k]
    const [bx, by] = s[k + 1]
    const len = Math.hypot(bx - ax, by - ay)
    SEGS.push({ ax: ax + 0.25, ay, dx: (bx - ax) / len, dy: (by - ay) / len, len, start: TOTAL })
    TOTAL += len
  }
}
function fifteen(i, n, t, o) {
  const s = ((i + 0.5) / n) * TOTAL
  let seg = SEGS[SEGS.length - 1]
  for (const g of SEGS) if (s >= g.start && s < g.start + g.len) seg = g
  const l = s - seg.start
  const jitter = Math.sin(t * 30 + i * 7) * 0.03
  o.p.set(seg.ax + seg.dx * l + jitter, seg.ay + seg.dy * l, Math.sin(t * 3 + i) * 0.3)
  o.d.set(seg.dx, seg.dy, 0)
  o.spin = t * 2 + i
  o.scale = (TOTAL / n / PEN_LEN) * 0.95
}

// 5 — a pulsing pen-sun, on the beat (150 BPM = 2.5 Hz)
function starburst(i, n, t, o) {
  const layer = n > 15 ? i % 3 : 0
  const a = (i / n) * TAU + t * (layer % 2 ? -0.5 : 0.5)
  const pulse = 1 + 0.18 * Math.pow(Math.abs(Math.sin(t * Math.PI * 2.5)), 6)
  const r = (4.6 + layer * 2.2) * pulse
  o.p.set(Math.cos(a) * r, Math.sin(a) * r, Math.sin(t * 2 + i) * 0.5)
  o.d.set(Math.cos(a), Math.sin(a), 0)
  o.spin = t * 5
  o.scale = dens(n)
}

// PEN STORM — pens fly straight at your face
export function storm(i, n, t, o) {
  const z = -50 + ((t * 28 + hash(i + 7) * 70) % 70)
  o.p.set((hash(i) * 2 - 1) * 9, (hash(i + 3) * 2 - 1) * 6, z)
  o.d.set(Math.sin(t * 3 + i) * 0.2, Math.cos(t * 2 + i) * 0.2, 1)
  o.spin = t * 20
  o.scale = n > 15 ? 0.5 : 1
}

export const FORMATIONS = [ring, grid, helix, tornado, fifteen, starburst]
