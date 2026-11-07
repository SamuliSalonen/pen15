import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { FORMATIONS, makeOut, storm } from './formations.js'
import { S, now, hash, stormWeight, confettiAt } from '../store.js'
import { audio } from '../audio.js'

// Pencil built from primitives, same palette as the favicon.
// Pointing up +Y, total length ~3.4 (PEN_LEN).
const G = {
  eraser: new THREE.CapsuleGeometry(0.2, 0.25, 6, 16),
  ferrule: new THREE.CylinderGeometry(0.235, 0.235, 0.36, 24),
  ring: new THREE.TorusGeometry(0.235, 0.025, 8, 24),
  body: new THREE.CylinderGeometry(0.25, 0.25, 1.9, 6),
  wood: new THREE.CylinderGeometry(0.055, 0.25, 0.55, 6),
  tip: new THREE.ConeGeometry(0.055, 0.17, 12),
}
const M = {
  eraser: new THREE.MeshStandardMaterial({ color: '#EF7C86', roughness: 0.7 }),
  metal: new THREE.MeshStandardMaterial({ color: '#AEB4BD', metalness: 1, roughness: 0.25 }),
  wood: new THREE.MeshStandardMaterial({ color: '#E9C79B', roughness: 0.8 }),
  graphite: new THREE.MeshStandardMaterial({ color: '#33312E', metalness: 0.6, roughness: 0.35 }),
}

const UP = new THREE.Vector3(0, 1, 0)
const A = makeOut()
const B = makeOut()
const C = makeOut()
const qa = new THREE.Quaternion()
const qb = new THREE.Quaternion()
const qs = new THREE.Quaternion()
const tmp = new THREE.Quaternion()

const ease = (x) => x * x * (3 - 2 * x)

function toQuat(o, q) {
  q.setFromUnitVectors(UP, o.d.normalize())
  return q.multiply(tmp.setFromAxisAngle(UP, o.spin))
}

export function Pen({ i, n }) {
  const ref = useRef()
  const inner = useRef()
  const kick = useRef(0)
  const extraSpin = useRef(0)
  const hover = useRef(0)
  const hovered = useRef(false)
  const target = useMemo(() => ({ p: new THREE.Vector3(), q: new THREE.Quaternion(), s: 1 }), [])
  const golden = i === 14 && n === 15
  const hue = i / n
  const body = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: golden ? '#ffcc33' : new THREE.Color().setHSL(hue, 0.9, 0.55),
        metalness: golden ? 1 : 0.1,
        roughness: golden ? 0.15 : 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        iridescence: 0.6,
        emissive: '#000000',
      }),
    [golden, hue],
  )
  const damp = 3 + hash(i) * 5

  useFrame((_, dt) => {
    const g = ref.current
    if (!g) return
    const t = now()
    const f = Math.min(Math.max(S.formation, 0), FORMATIONS.length - 1)
    const k = Math.floor(f)
    const k2 = Math.min(k + 1, FORMATIONS.length - 1)
    const e = ease(f - k)

    FORMATIONS[k](i, n, t, A)
    FORMATIONS[k2](i, n, t, B)
    target.p.lerpVectors(A.p, B.p, e)
    target.q.slerpQuaternions(toQuat(A, qa), toQuat(B, qb), e)
    target.s = A.scale + (B.scale - A.scale) * e

    const w = stormWeight(t)
    if (w > 0) {
      storm(i, n, t, C)
      target.p.lerp(C.p, w)
      target.q.slerp(toQuat(C, qs), w)
      target.s += (C.scale - target.s) * w
    }

    // Scroll fast and the pens get the jitters.
    const shake = Math.min(S.speed / 4000, 1) * (S.calm ? 0.1 : 0.6)
    if (shake > 0.01) target.p.addScalar((Math.random() - 0.5) * shake)

    const d = damp + w * 30
    g.position.lerp(target.p, 1 - Math.exp(-dt * d))
    g.quaternion.slerp(target.q, 1 - Math.exp(-dt * d * 1.4))

    kick.current *= Math.exp(-dt * 2.5)
    extraSpin.current += kick.current * dt * 40
    inner.current.rotation.y = extraSpin.current
    hover.current += ((hovered.current ? 1 : 0) - hover.current) * Math.min(1, dt * 10)
    g.scale.setScalar(target.s * (1 + kick.current * 0.7 + hover.current * 0.2))

    if (S.mega) body.color.setHSL((hue + t * 0.3) % 1, 0.95, 0.55)
    body.emissive.setHSL(hue, 1, 0.5).multiplyScalar(kick.current * 1.5 + hover.current * 0.25 + (golden ? 0.25 : 0))
  })

  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation()
        kick.current = 1
        audio.boop(i % 15)
        confettiAt(e.nativeEvent.clientX, e.nativeEvent.clientY)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        hovered.current = true
        S.hoverPen = true
      }}
      onPointerOut={() => {
        hovered.current = false
        S.hoverPen = false
      }}
    >
      <group ref={inner}>
        <mesh geometry={G.eraser} material={M.eraser} position-y={-1.35} />
        <mesh geometry={G.ferrule} material={M.metal} position-y={-1.07} />
        <mesh geometry={G.ring} material={M.metal} position-y={-1.18} rotation-x={Math.PI / 2} />
        <mesh geometry={G.ring} material={M.metal} position-y={-0.96} rotation-x={Math.PI / 2} />
        <mesh geometry={G.body} material={body} position-y={0.06} />
        <mesh geometry={G.wood} material={M.wood} position-y={1.285} />
        <mesh geometry={G.tip} material={M.graphite} position-y={1.645} />
      </group>
    </group>
  )
}
