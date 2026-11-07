import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useSkew } from './skew.js'

const FACES = [
  ['★ THIS SITE IS BROUGHT TO YOU BY ★', 'UMLAUT.FYI'],
  ['PROUD SPONSOR OF ALL 15 PENS', 'UMLAUT.FYI'],
  ['!!! CLICK HERE !!! CLICK HERE !!!', 'UMLAUT.FYI'],
  ['Ä · Ë · Ï · Ö · Ü · Ÿ · Ä · Ë · Ï', 'ÜMLÄÜT.FYÏ'],
]

// The original sponsor banner, now a rotating billboard prism in 3D.
export function Sponsor() {
  const ref = useRef()
  const skew = useSkew()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rotateX = useTransform(p, [0, 1], [0, 1440])
  const rotateY = useTransform(p, [0, 0.5, 1], [-50, 0, 50])
  const scale = useTransform(p, [0.1, 0.4, 0.7, 0.95], [0.2, 1, 1, 3])
  const ringRot = useTransform(p, [0, 1], [0, 720])

  return (
    <section ref={ref} className="sponsor" data-formation="2">
      <div className="sticky">
        <motion.h2 className="section-title small" style={{ skewY: skew }}>
          A WORD FROM OUR SPONSOR
        </motion.h2>
        <div className="prism-stage">
          <motion.div className="orbit-text" style={{ rotate: ringRot }} aria-hidden="true">
            {'SPONSORED · SPONSORED · SPONSORED · SPONSORED · '.split('').map((ch, i, a) => (
              <span key={i} style={{ transform: `rotate(${(i / a.length) * 360}deg)` }}>
                {ch}
              </span>
            ))}
          </motion.div>
          <motion.a
            href="https://umlaut.fyi"
            target="_blank"
            rel="noopener"
            className="prism"
            style={{ rotateX, rotateY, scale }}
            aria-label="This site is brought to you by umlaut.fyi"
          >
            {FACES.map(([l1, l2], i) => (
              <div key={i} className="prism-face banner" style={{ '--i': i }}>
                <div className="line1">{l1}</div>
                <div className="line2">{l2}</div>
              </div>
            ))}
          </motion.a>
        </div>
        <p className="sponsor-note">
          (umlaut.fyi did not pay for this. <span className="flash">yet.</span>)
        </p>
      </div>
    </section>
  )
}
