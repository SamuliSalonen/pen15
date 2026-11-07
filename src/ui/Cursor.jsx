import { useEffect, useRef } from 'react'
import { PencilIcon } from './PencilIcon.jsx'
import { S } from '../store.js'

const TRAIL = 16
const STARS = ['★', '✦', '✎', '✧', '♥', '15']

// A pencil cursor with a 1998-grade sparkle trail.
export function Cursor() {
  const pen = useRef()
  const label = useRef()
  const dots = useRef([])

  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches) return
    document.body.classList.add('custom-cursor')
    const hist = Array.from({ length: TRAIL * 2 + 2 }, () => [-100, -100])
    let x = -100
    let y = -100
    let raf
    const move = (e) => {
      x = e.clientX
      y = e.clientY
    }
    const tick = () => {
      hist.unshift([x, y])
      hist.length = TRAIL * 2 + 2
      pen.current.style.transform = `translate(${x - 7}px, ${y - 7}px)`
      label.current.style.transform = `translate(${x + 22}px, ${y + 18}px)`
      label.current.style.opacity = S.hoverPen ? 1 : 0
      dots.current.forEach((d, i) => {
        const [hx, hy] = hist[i * 2 + 2]
        d.style.transform = `translate(${hx}px, ${hy}px) scale(${1 - i / TRAIL}) rotate(${i * 30 + performance.now() / 5}deg)`
      })
      raf = requestAnimationFrame(tick)
    }
    addEventListener('pointermove', move, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('pointermove', move)
      document.body.classList.remove('custom-cursor')
    }
  }, [])

  return (
    <div className="cursor-layer" aria-hidden="true">
      {Array.from({ length: TRAIL }, (_, i) => (
        <span
          key={i}
          ref={(el) => (dots.current[i] = el)}
          className="cursor-dot"
          style={{ color: `hsl(${i * 22}, 100%, 60%)` }}
        >
          {STARS[i % STARS.length]}
        </span>
      ))}
      <div ref={pen} className="cursor-pen">
        <PencilIcon size={40} rotate={-135} />
      </div>
      <div ref={label} className="cursor-label">
        CLICK THE PEN!!
      </div>
    </div>
  )
}
