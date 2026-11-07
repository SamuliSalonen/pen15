import { motion } from 'motion/react'
import { useMuted } from './Chrome.jsx'
import { audio } from '../audio.js'

const THE_END = 'THE END?'

export function Finale({ mega, onStorm, onMega }) {
  const muted = useMuted()
  return (
    <section className="finale" data-formation="5">
      <h2 className="the-end" aria-label={THE_END}>
        {THE_END.split('').map((ch, i) => (
          <motion.span
            key={i}
            initial={{ y: -300, rotate: -180, opacity: 0 }}
            whileInView={{ y: 0, rotate: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ type: 'spring', stiffness: 200, damping: 9, delay: i * 0.06 }}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {ch === ' ' ? ' ' : ch}
          </motion.span>
        ))}
      </h2>
      <p className="finale-text">
        You have seen all {mega ? '150' : '15'} pens. You may now leave. Or don't. The pens can't stop you. (They can't do
        anything. They're pens.)
      </p>

      <div className="finale-buttons">
        <motion.button className="btn btn-hot btn-big" onClick={onStorm} whileHover={{ scale: 1.1, rotate: -3 }} whileTap={{ scale: 0.8 }}>
          ☄ UNLEASH THE PEN STORM ☄
        </motion.button>
        <motion.button className="btn" onClick={onMega} whileHover={{ scale: 1.1, rotate: 3 }} whileTap={{ scale: 0.8 }}>
          {mega ? 'RETURN TO 15 PENS' : 'PEN 150 MODE (DANGER)'}
        </motion.button>
        <motion.button className="btn" onClick={() => audio.setMuted(!muted)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}>
          {muted ? 'TURN ON THE CHIPTUNE 🔊' : 'STOP THE CHIPTUNE 🔇'}
        </motion.button>
        <motion.button
          className="btn"
          onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.1, rotate: -2 }}
          whileTap={{ scale: 0.8 }}
        >
          ⬆ BACK TO TOP AT MAXIMUM VELOCITY ⬆
        </motion.button>
      </div>

      <div className="tape" aria-hidden="true">
        <span>🚧 UNDER CONSTRUCTION 🚧 SINCE 1999 🚧 UNDER CONSTRUCTION 🚧 SINCE 1999 🚧</span>
      </div>

      <nav className="webring" aria-label="Webring">
        <a href="#" onClick={(e) => (e.preventDefault(), scrollTo({ top: 0, behavior: 'smooth' }))}>
          « PREV
        </a>
        <span>✎ THE PEN RING ✎</span>
        <a href="#" onClick={(e) => (e.preventDefault(), scrollTo({ top: 0, behavior: 'smooth' }))}>
          NEXT »
        </a>
      </nav>

      <footer className="footer">
        <p>© 1999–{new Date().getFullYear()} PEN 15 · ALL PENS RESERVED</p>
        <p>
          brought to you by{' '}
          <a href="https://umlaut.fyi" target="_blank" rel="noopener">
            umlaut.fyi
          </a>
        </p>
        <p className="secret">psst. type “pen15”. or the konami code. we won’t judge.</p>
      </footer>
    </section>
  )
}
