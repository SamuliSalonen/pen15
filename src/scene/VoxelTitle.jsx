import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { S, now, clamp, hash, stormWeight, confettiAt } from '../store.js'
import { audio } from '../audio.js'

// 5x7 pixel font, extruded into cubes. Every cube is its own little life.
const GLYPHS = {
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  1: ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  5: ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  0: ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  ' ': ['', '', '', '', '', '', ''],
}
const VOX = 0.34

function layout(text) {
  const cells = []
  const width = text.length * 6 - 1
  ;[...text].forEach((ch, ci) => {
    GLYPHS[ch].forEach((row, r) => {
      ;[...row].forEach((bit, c) => {
        if (bit === '1') cells.push([(ci * 6 + c - (width - 1) / 2) * VOX, (3 - r) * VOX])
      })
    })
  })
  return cells
}

const obj = new THREE.Object3D()
const col = new THREE.Color()

export function VoxelTitle({ text }) {
  const mesh = useRef()
  const group = useRef()
  const cells = useMemo(() => layout(text), [text])
  const dirs = useMemo(
    () => cells.map((_, j) => new THREE.Vector3(hash(j) - 0.5, hash(j + 1) - 0.5, hash(j + 2) - 0.5).normalize()),
    [cells],
  )
  const blast = useRef(0)

  useLayoutEffect(() => {
    // instanceColor has to exist before the first render
    cells.forEach((_, j) => mesh.current.setColorAt(j, col.set('#fff')))
  }, [cells])

  useFrame((_, dt) => {
    const t = now()
    const f = S.formation
    // Visible in the hero (formation 0) and the finale (formation 5).
    const w = clamp(Math.max(1 - f * 1.4, (f - 4.3) / 0.7), 0, 1)
    group.current.visible = w > 0.01
    if (!group.current.visible) return

    blast.current += (Math.min(S.speed / 400, 8) - blast.current) * Math.min(1, dt * 4)
    S.titleKick *= Math.exp(-dt * 1.5)
    const storm = stormWeight(t) * 12
    const ex = blast.current + (1 - w) * 30 + S.titleKick * 10 + storm
    const finale = clamp(f - 4, 0, 1)
    const sc = 1 - finale * 0.45

    group.current.rotation.y = Math.sin(t * 0.7) * 0.35 + S.mouse.x * 0.3
    group.current.rotation.x = Math.sin(t * 0.5) * 0.15 - S.mouse.y * 0.2
    group.current.position.y = Math.sin(t * 1.3) * 0.25

    cells.forEach(([x, y], j) => {
      const d = dirs[j]
      const wave = Math.sin(t * 4 - x * 0.8) * 0.25
      obj.position.set(x * sc + d.x * ex, (y + wave) * sc + d.y * ex, Math.sin(t * 3 + x) * 0.15 + d.z * ex)
      const spin = ex * 0.4 + Math.sin(t * 2 + j) * 0.15
      obj.rotation.set(spin * d.x * 3, spin * d.y * 3 + Math.sin(t * 2 + x) * 0.3, spin * d.z * 3)
      obj.scale.setScalar(VOX * 0.9 * sc * (0.3 + 0.7 * w) * (1 + Math.pow(Math.abs(Math.sin(t * Math.PI * 2.5)), 8) * 0.25))
      obj.updateMatrix()
      mesh.current.setMatrixAt(j, obj.matrix)
      mesh.current.setColorAt(j, col.setHSL((x * 0.04 + t * 0.25) % 1, 1, 0.55))
    })
    mesh.current.instanceMatrix.needsUpdate = true
    mesh.current.instanceColor.needsUpdate = true
  })

  return (
    <group ref={group}>
      <instancedMesh
        key={text}
        ref={mesh}
        args={[undefined, undefined, cells.length]}
        onClick={(e) => {
          e.stopPropagation()
          S.titleKick = 1.5
          audio.boop(-12)
          confettiAt(e.nativeEvent.clientX, e.nativeEvent.clientY, 50)
        }}
      >
        <boxGeometry />
        <meshStandardMaterial metalness={0.4} roughness={0.2} emissive="#220033" />
      </instancedMesh>
    </group>
  )
}
