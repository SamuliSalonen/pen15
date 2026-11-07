import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { PencilIcon } from './PencilIcon.jsx'

// The scroll progress bar is a line being drawn by a pencil. Obviously.
export function ProgressPencil() {
  const { scrollYProgress } = useScroll()
  const p = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })
  const left = useTransform(p, (v) => `calc(${v * 100}% - ${v * 36}px)`)
  return (
    <div className="progress" aria-hidden="true">
      <motion.div className="progress-line" style={{ scaleX: p }} />
      <motion.div className="progress-pencil" style={{ left }}>
        <PencilIcon size={36} rotate={8} />
      </motion.div>
    </div>
  )
}
