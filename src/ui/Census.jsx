import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useSkew } from './skew.js'
import { audio } from '../audio.js'
import { confettiAt } from '../store.js'

const MESSAGES = [
  'SCROLL TO BEGIN THE PEN CENSUS',
  'ONE PEN. A HUMBLE BEGINNING.',
  'TWO PENS. A PEN PAL.',
  'THREE PENS. A CROWD.',
  'FOUR PENS. A BOY BAND.',
  'FIVE PENS. HALF OF TEN PENS.',
  'SIX PENS. LEGALLY A PENSEMBLE.',
  'SEVEN PENS. LUCKY.',
  'EIGHT PENS. AN OCTOPEN.',
  'NINE PENS. PEN #9 IS SHY.',
  'TEN PENS. A DECAPEN.',
  'ELEVEN PENS. ALMOST THERE.',
  'TWELVE PENS. A PEN DOZEN.',
  'THIRTEEN PENS. SPOOKY.',
  'FOURTEEN PENS. SO CLOSE. TOO CLOSE.',
  'FIFTEEN PENS!!!!!!!!!!!!!!!',
]

export function Census() {
  const ref = useRef()
  const skew = useSkew()
  const [count, setCount] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => setCount(Math.min(15, Math.max(0, Math.floor(v * 17)))))

  useEffect(() => {
    if (count > 0) audio.boop(count)
    if (count === 15) confettiAt(innerWidth / 2, innerHeight / 2, 90)
  }, [count])

  return (
    <section ref={ref} className="census" data-formation="1">
      <div className="sticky">
        <motion.h2 className="section-title" style={{ skewY: skew }}>
          THE PEN CENSUS
        </motion.h2>
        <div className="count-stage">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={count}
              className={`big-number ${count === 15 ? 'big-number-max' : ''}`}
              initial={{ rotateX: -110, rotateZ: -20, scale: 3, opacity: 0 }}
              animate={{ rotateX: 0, rotateZ: 0, scale: 1, opacity: 1 }}
              exit={{ rotateX: 110, scale: 0.2, opacity: 0, y: 200 }}
              transition={{ type: 'spring', stiffness: 260, damping: 14 }}
            >
              {count}
            </motion.div>
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={count}
            className="count-msg"
            initial={{ x: 300, opacity: 0, skewX: -40 }}
            animate={{ x: 0, opacity: 1, skewX: 0 }}
            exit={{ x: -300, opacity: 0, skewX: 40 }}
            transition={{ duration: 0.18 }}
          >
            {MESSAGES[count]}
          </motion.p>
        </AnimatePresence>
        <div className="pen-row" aria-label={`${count} of 15 pens counted`}>
          {Array.from({ length: 15 }, (_, i) => (
            <span key={i} className={i < count ? 'lit' : ''}>
              ✎
            </span>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            key={count}
            className="strobe"
            initial={{ opacity: count === 15 ? 0.6 : 0.25 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
