import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

const BADGES = [
  ['NETSCAPE', 'NOW! 15.0'],
  ['MADE WITH', 'NOTEPAD.EXE'],
  ['Y2K', 'COMPLIANT'],
  ['PEN', 'POWERED'],
  ['BEST AT', '1024×768'],
  ['GEOPENS', 'HOMESTEAD'],
]

function VisitorCounter() {
  const [n, setN] = useState(15)
  useEffect(() => {
    const id = setInterval(() => setN((v) => v + 1 + Math.floor(Math.random() * 15)), 900)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="counter">
      <span>YOU ARE VISITOR #</span>
      <span className="odometer">
        {String(n)
          .padStart(7, '0')
          .split('')
          .map((d, i) => (
            <motion.b key={`${i}-${d}`} initial={{ rotateX: -90 }} animate={{ rotateX: 0 }}>
              {d}
            </motion.b>
          ))}
      </span>
      <small>(this number is real)</small>
    </div>
  )
}

export function Hero() {
  const ref = useRef()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(p, [0, 1], [0, -400])
  const rotateX = useTransform(p, [0, 1], [0, 75])
  const scale = useTransform(p, [0, 1], [1, 1.8])
  const opacity = useTransform(p, [0, 0.6], [1, 0])
  const blur = useTransform(p, [0, 0.6], ['blur(0px)', 'blur(12px)'])
  const welcomeX = useTransform(p, [0, 1], ['0vw', '-120vw'])
  const welcomeRot = useTransform(p, [0, 1], [0, -40])

  return (
    <section ref={ref} className="hero" data-formation="0">
      <motion.div className="welcome" style={{ x: welcomeX, rotate: welcomeRot }}>
        <span className="flash">★</span> WELCOME TO <span className="flash">★</span>
      </motion.div>

      <div className="hero-spacer" />

      <motion.div className="hero-bottom" style={{ y, rotateX, scale, opacity, filter: blur }}>
        <p className="rainbow-text tagline">THE INTERNET'S PREMIER DESTINATION FOR EXACTLY FIFTEEN (15) PENS</p>
        <VisitorCounter />
        <div className="badges">
          {BADGES.map(([a, b], i) => (
            <motion.div
              key={a}
              className="badge"
              animate={{ rotate: [0, i % 2 ? 6 : -6, 0] }}
              transition={{ repeat: Infinity, duration: 0.6 + i * 0.13 }}
            >
              <b>{a}</b>
              <span>{b}</span>
            </motion.div>
          ))}
        </div>
        <div className="scroll-hint">
          <span className="flash">▼</span> SCROLL IF U DARE <span className="flash">▼</span>
        </div>
      </motion.div>
    </section>
  )
}
