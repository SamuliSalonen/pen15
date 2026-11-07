import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { useSkew } from './skew.js'

const FACTS = [
  ['🔢', 'There are exactly fifteen (15) pens on this website. We counted. Twice.'],
  ['✏️', 'Technically, they are pencils. Please do not tell them.'],
  ['🎒', 'The average pen travels 15 km per year inside your bag without your knowledge.'],
  ['🔬', 'Scientists agree that 15 is the optimal number of pens. Scientists who disagreed were given 14 pens.'],
  ['😨', 'Pen #9 is afraid of sharpeners. Do not bring it up.'],
  ['👂', 'If you scroll fast enough, the pens can hear you.'],
  ['🌪️', 'You are currently inside a pen tornado. Remain calm. Keep scrolling.'],
]

function FactCard({ fact, index, total, progress }) {
  const center = (index + 0.5) / total
  const rotateY = useTransform(progress, [center - 0.3, center, center + 0.3], [65, 0, -65])
  const rotateZ = useTransform(progress, [center - 0.3, center + 0.3], [index % 2 ? 12 : -12, index % 2 ? -12 : 12])
  const z = useTransform(progress, [center - 0.3, center, center + 0.3], [-400, 0, -400])
  return (
    <motion.article className="fact" style={{ rotateY, rotateZ, z }}>
      <div className="fact-sticker">FACT #{index + 1}</div>
      <div className="fact-emoji">{fact[0]}</div>
      <p>{fact[1]}</p>
    </motion.article>
  )
}

// Vertical scroll becomes horizontal travel through a corridor of facts.
export function Facts() {
  const ref = useRef()
  const track = useRef()
  const skew = useSkew()
  const [distance, setDistance] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })
  const x = useTransform(progress, [0, 1], [0, -distance])

  useLayoutEffect(() => {
    const measure = () => setDistance(Math.max(0, track.current.scrollWidth - innerWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track.current)
    addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      removeEventListener('resize', measure)
    }
  }, [])

  return (
    <section ref={ref} className="facts" data-formation="3" style={{ height: `${FACTS.length * 70 + 100}vh` }}>
      <div className="sticky">
        <motion.h2 className="section-title" style={{ skewY: skew }}>
          PEN FACTS™
        </motion.h2>
        <motion.div ref={track} className="fact-track" style={{ x }}>
          {FACTS.map((f, i) => (
            <FactCard key={i} fact={f} index={i} total={FACTS.length} progress={progress} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
