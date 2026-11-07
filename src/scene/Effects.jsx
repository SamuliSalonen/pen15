import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette, Glitch } from '@react-three/postprocessing'
import { BlendFunction, GlitchMode } from 'postprocessing'
import { S, now, stormWeight } from '../store.js'

export function Effects({ chaos, calm }) {
  const ca = useRef()

  useFrame(() => {
    if (!ca.current) return
    const t = now()
    const amt = 0.0015 + Math.min(S.speed / 2500, 1) * 0.02 + stormWeight(t) * 0.02 + (S.mega ? 0.006 : 0)
    ca.current.offset.set(Math.cos(t * 3) * amt, Math.sin(t * 2) * amt)
  })

  return (
    <EffectComposer multisampling={0}>
      <Bloom mipmapBlur intensity={1.3} luminanceThreshold={0.45} luminanceSmoothing={0.25} />
      <ChromaticAberration ref={ca} radialModulation={false} modulationOffset={0} />
      <Glitch
        active={chaos && !calm}
        mode={GlitchMode.SPORADIC}
        delay={[0.6, 1.8]}
        duration={[0.1, 0.35]}
        strength={[0.15, 0.4]}
        ratio={0.8}
      />
      <Noise opacity={0.07} blendFunction={BlendFunction.OVERLAY} />
      <Vignette eskil={false} offset={0.2} darkness={0.85} />
    </EffectComposer>
  )
}
