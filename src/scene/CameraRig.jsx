import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { S, now, stormWeight } from '../store.js'

// One camera shot per formation. Lerped by scroll, then abused by scroll speed.
const SHOTS = [
  (t) => [0, 1.5, 15, 0, 0, 0, 0],
  (t) => [0, 0, 17, 0, 0, 0, Math.sin(t * 0.5) * 0.06],
  (t) => [Math.cos(t * 0.35) * 12, 2.5, Math.sin(t * 0.35) * 12, 0, 0, 0, 0.25],
  (t) => [0, -5, 16, 0, 2, 0, Math.sin(t) * 0.35],
  (t) => [0, 0, 16, 0, 0, 0, 0],
  (t) => [0, 0, 15, 0, 0, 0, Math.sin(t * 0.4) * 0.5],
]

const pos = new THREE.Vector3()
const look = new THREE.Vector3()
const curLook = new THREE.Vector3()

export function CameraRig() {
  const size = useThree((s) => s.size)

  useFrame(({ camera }, dt) => {
    const t = now()
    const f = Math.min(Math.max(S.formation, 0), SHOTS.length - 1)
    const k = Math.floor(f)
    const a = SHOTS[k](t)
    const b = SHOTS[Math.min(k + 1, SHOTS.length - 1)](t)
    const e = f - k
    const v = a.map((x, j) => x + (b[j] - x) * e)

    // Pull back on portrait screens so the pens still fit.
    const aspect = size.width / size.height
    const pull = Math.max(1, 1.15 / aspect)
    look.set(v[3], v[4], v[5])
    pos.set(v[0], v[1], v[2]).sub(look).multiplyScalar(pull).add(look)

    pos.x += S.mouse.x * 1.5
    pos.y += S.mouse.y * 1.0

    const storm = stormWeight(t)
    const shake = (Math.min(S.speed / 3000, 1) * 0.35 + storm * 0.4) * (S.calm ? 0.1 : 1)
    pos.x += (Math.random() - 0.5) * shake
    pos.y += (Math.random() - 0.5) * shake

    const s = 1 - Math.exp(-dt * 4)
    camera.position.lerp(pos, s)
    curLook.lerp(look, s)
    camera.lookAt(curLook)
    camera.rotateZ(v[6] + (S.mega ? Math.sin(t * 2) * 0.3 : 0))

    // Hyperspace warp: FOV punches out with scroll speed.
    const fov = 50 + Math.min(S.speed / 70, 45) + storm * 25
    camera.fov += (fov - camera.fov) * Math.min(1, dt * 6)
    camera.updateProjectionMatrix()
  })
  return null
}
