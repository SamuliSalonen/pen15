import { motion } from 'motion/react'
import { PencilIcon } from './PencilIcon.jsx'

const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

export function Splash({ onEnter }) {
  return (
    <motion.div
      className="splash"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 3, rotate: 25, filter: 'blur(20px)' }}
      transition={{ duration: 0.8, ease: 'easeIn' }}
    >
      <motion.div
        className="splash-box"
        initial={{ y: -600, rotate: -30 }}
        animate={{ y: 0, rotate: -2 }}
        transition={{ type: 'spring', stiffness: 120, damping: 10 }}
      >
        <div className="splash-title">
          <span className="flash">⚠</span> WARNING <span className="flash">⚠</span>
        </div>
        <p>THIS WEBSITE CONTAINS:</p>
        <ul>
          <li>
            <PencilIcon size={20} /> FIFTEEN (15) PENS
          </li>
          <li>
            <PencilIcon size={20} /> 3D GRAPHICS (EXPENSIVE)
          </li>
          <li>
            <PencilIcon size={20} /> FLASHING LIGHTS &amp; GLITCHES
          </li>
          <li>
            <PencilIcon size={20} /> A CHIPTUNE AT 150 BPM
          </li>
          <li>
            <PencilIcon size={20} /> NO REDEEMING VALUE WHATSOEVER
          </li>
        </ul>
        {reduced && <p className="splash-note">Your system says you prefer reduced motion. Calm mode is right there. ↓</p>}
        <div className="splash-buttons">
          <button className="btn btn-hot" onClick={() => onEnter({ sound: true, calm: false })} autoFocus={!reduced}>
            ENTER WITH SOUND 🔊
          </button>
          <button className="btn" onClick={() => onEnter({ sound: false, calm: false })}>
            ENTER SILENTLY 🔇
          </button>
          <button className="btn btn-calm" onClick={() => onEnter({ sound: false, calm: true })} autoFocus={reduced}>
            CALM MODE (NO FLASHING)
          </button>
        </div>
        <div className="splash-foot">best viewed in Netscape Navigator 15.0 at 1024×768</div>
      </motion.div>
    </motion.div>
  )
}
