import { useEffect, useState } from 'react'

const BITS = ['✎', '✏', '🖊', '🖋', '★', '15', '✦', '💥']
let nextId = 0

export function Confetti() {
  const [bursts, setBursts] = useState([])

  useEffect(() => {
    const onBurst = (e) => {
      const { x, y, amount } = e.detail
      const id = nextId++
      const parts = Array.from({ length: amount }, (_, i) => {
        const a = Math.random() * Math.PI * 2
        const v = 120 + Math.random() * 380
        return {
          bit: BITS[i % BITS.length],
          dx: Math.cos(a) * v,
          dy: Math.sin(a) * v - 150,
          rot: (Math.random() - 0.5) * 1440,
          hue: Math.floor(Math.random() * 360),
          size: 14 + Math.random() * 26,
        }
      })
      setBursts((b) => [...b, { id, x, y, parts }])
      setTimeout(() => setBursts((b) => b.filter((p) => p.id !== id)), 1600)
    }
    addEventListener('pen-confetti', onBurst)
    return () => removeEventListener('pen-confetti', onBurst)
  }, [])

  return (
    <div className="confetti-layer" aria-hidden="true">
      {bursts.map((b) => (
        <div key={b.id} className="burst" style={{ left: b.x, top: b.y }}>
          {b.parts.map((p, i) => (
            <span
              key={i}
              style={{
                '--dx': `${p.dx}px`,
                '--dy': `${p.dy}px`,
                '--rot': `${p.rot}deg`,
                color: `hsl(${p.hue}, 100%, 60%)`,
                fontSize: p.size,
              }}
            >
              {p.bit}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
