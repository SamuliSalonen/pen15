import { Component } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { PencilIcon } from './PencilIcon.jsx'

export function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

// No WebGL? Fine. Fifteen pens in a CSS 3D carousel instead.
export function FallbackPens({ mega }) {
  const n = mega ? 45 : 15
  const { scrollYProgress } = useScroll()
  const rotateX = useTransform(scrollYProgress, [0, 1], [-15, 345])
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 1440])
  return (
    <div className="fallback-pens" aria-hidden="true">
      <motion.div className="fallback-ring" style={{ rotateX, rotateY }}>
        {Array.from({ length: n }, (_, i) => (
          <div key={i} className="fallback-pen" style={{ '--a': `${(i / n) * 360}deg`, '--d': `${(i % 5) * -0.3}s` }}>
            <PencilIcon size={120} rotate={-90} />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
