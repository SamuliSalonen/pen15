import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, Grid, Sparkles, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { Pen } from './Pen.jsx'
import { VoxelTitle } from './VoxelTitle.jsx'
import { CameraRig } from './CameraRig.jsx'
import { Effects } from './Effects.jsx'
import { S, now } from '../store.js'

function Atmosphere() {
  const cage = useRef()
  const grid = useRef()
  const sparkles = useRef()
  const lightA = useRef()
  const lightB = useRef()

  useFrame(({ scene: sc }) => {
    const t = now()
    const hue = (t * 0.02 + S.progress * 1.5) % 1
    sc.background.setHSL(hue, 0.8, S.mega ? 0.09 : 0.045)
    sc.fog.color.copy(sc.background)
    cage.current.rotation.set(t * 0.05, t * 0.08 + S.progress * 6, 0)
    cage.current.material.color.setHSL((hue + 0.5) % 1, 1, 0.5)
    cage.current.scale.setScalar(1 + Math.min(S.speed / 4000, 1) * 0.6)
    grid.current.position.z = (t * 6) % 5
    sparkles.current.rotation.y = t * 0.1 + S.progress * 3
    lightA.current.position.set(Math.cos(t) * 8, 4, Math.sin(t) * 8)
    lightB.current.position.set(Math.cos(t + Math.PI) * 8, -3, Math.sin(t + Math.PI) * 8)
  })

  return (
    <>
      <color attach="background" args={['#06010f']} />
      <fog attach="fog" args={['#06010f', 25, 95]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 6]} intensity={2.2} />
      <pointLight ref={lightA} color="#ff00ff" intensity={80} distance={40} />
      <pointLight ref={lightB} color="#00ffff" intensity={80} distance={40} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="ring" color="#ff00aa" intensity={6} position={[0, 6, -8]} scale={10} />
        <Lightformer form="rect" color="#00ffff" intensity={5} position={[-8, 0, 4]} rotation-y={Math.PI / 2} scale={[12, 3, 1]} />
        <Lightformer form="rect" color="#ffff00" intensity={4} position={[8, 2, 4]} rotation-y={-Math.PI / 2} scale={[12, 3, 1]} />
        <Lightformer form="circle" color="#ffffff" intensity={3} position={[0, -6, 6]} scale={5} />
      </Environment>
      <Stars radius={90} depth={60} count={5000} factor={5} saturation={1} fade speed={3} />
      <group ref={sparkles}>
        <Sparkles count={250} scale={[40, 25, 40]} size={6} speed={0.8} color="#ff66ff" />
        <Sparkles count={150} scale={[30, 20, 30]} size={4} speed={1.4} color="#66ffff" />
      </group>
      <mesh ref={cage}>
        <icosahedronGeometry args={[42, 1]} />
        <meshBasicMaterial wireframe transparent opacity={0.22} fog={false} toneMapped={false} />
      </mesh>
      <group ref={grid}>
        <Grid
          position={[0, -8, 0]}
          args={[200, 200]}
          cellSize={1}
          cellThickness={0.8}
          cellColor="#ff00ff"
          sectionSize={5}
          sectionThickness={1.6}
          sectionColor="#00ffff"
          fadeDistance={90}
          fadeStrength={1.2}
          infiniteGrid
        />
      </group>
    </>
  )
}

export default function Scene({ mega, calm, storm }) {
  const n = mega ? 150 : 15
  return (
    <div className="canvas-wrap" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 1.5, 15], fov: 50, near: 0.1, far: 400 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => (gl.toneMapping = THREE.ACESFilmicToneMapping)}
      >
        <Atmosphere />
        <VoxelTitle text={mega ? 'PEN 150' : 'PEN 15'} />
        {Array.from({ length: n }, (_, i) => (
          <Pen key={`${n}-${i}`} i={i} n={n} />
        ))}
        <CameraRig />
        <Effects chaos={mega || storm} calm={calm} />
      </Canvas>
    </div>
  )
}
