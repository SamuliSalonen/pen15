import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

export function Behold() {
  const ref = useRef()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(p, [0.15, 0.45], [0.2, 1])
  const spacing = useTransform(p, [0.15, 0.6], ['0em', '0.5em'])
  const opacity = useTransform(p, [0.15, 0.3, 0.75, 0.85], [0, 1, 1, 0])
  const rotateX = useTransform(p, [0.35, 0.5], [-90, 0])
  const subOpacity = useTransform(p, [0.4, 0.5, 0.75, 0.85], [0, 1, 1, 0])

  return (
    <section ref={ref} className="behold" data-formation="4">
      <div className="sticky">
        <motion.h2 className="behold-top" style={{ scale, letterSpacing: spacing, opacity }}>
          BEHOLD
        </motion.h2>
        <div className="behold-gap" />
        <motion.div className="behold-bottom" style={{ rotateX, opacity: subOpacity }}>
          <div className="behold-title">THE FIFTEEN</div>
          <p>(they formed a 15. for you. they practiced for weeks.)</p>
        </motion.div>
      </div>
    </section>
  )
}
