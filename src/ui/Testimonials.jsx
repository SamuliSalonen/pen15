import { motion } from 'motion/react'
import { useSkew } from './skew.js'

const REVIEWS = [
  [5, 'I am a pen.', 'Pen #7'],
  [5, 'Finally, a website that understands me.', 'Pen #3'],
  [1, 'Not enough pens. Would prefer 16.', 'Pen #16 (does not exist)'],
  [5, 'My grandmother was a quill. She would be so proud.', 'Pen #11'],
  [5, 'Clicky.', 'Pen #1 (retractable)'],
  [5, "I've been spinning since 1999 and I cannot stop. Please send help.", 'Pen #15 (the golden one)'],
]

export function Testimonials() {
  const skew = useSkew()
  return (
    <section className="testimonials" data-formation="5">
      <motion.h2 className="section-title" style={{ skewY: skew }}>
        WHAT THE PENS ARE SAYING
      </motion.h2>
      <div className="reviews">
        {REVIEWS.map(([stars, quote, who], i) => (
          <motion.figure
            key={who}
            className="review"
            initial={{ opacity: 0, rotateY: i % 2 ? 120 : -120, rotateZ: i % 2 ? 30 : -30, x: i % 2 ? 400 : -400, scale: 0.3 }}
            whileInView={{ opacity: 1, rotateY: 0, rotateZ: i % 2 ? 2 : -2, x: 0, scale: 1 }}
            whileHover={{ scale: 1.08, rotateZ: i % 2 ? -4 : 4, transition: { type: 'spring', stiffness: 400, damping: 6 } }}
            viewport={{ amount: 0.4 }}
            transition={{ type: 'spring', stiffness: 90, damping: 12 }}
          >
            <div className="stars">{'★'.repeat(stars) + '☆'.repeat(5 - stars)}</div>
            <blockquote>“{quote}”</blockquote>
            <figcaption>— {who}</figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  )
}
