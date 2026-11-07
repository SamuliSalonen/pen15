import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'
import { S, now, startTracking, STORM_LENGTH, confettiAt } from './store.js'
import { audio } from './audio.js'
import { SkewContext } from './ui/skew.js'
import { Splash } from './ui/Splash.jsx'
import { Cursor } from './ui/Cursor.jsx'
import { ProgressPencil } from './ui/ProgressPencil.jsx'
import { Confetti } from './ui/Confetti.jsx'
import { Ticker, SoundButton } from './ui/Chrome.jsx'
import { Hero } from './ui/Hero.jsx'
import { Census } from './ui/Census.jsx'
import { Sponsor } from './ui/Sponsor.jsx'
import { Facts } from './ui/Facts.jsx'
import { Behold } from './ui/Behold.jsx'
import { Testimonials } from './ui/Testimonials.jsx'
import { Finale } from './ui/Finale.jsx'
import { FallbackPens, SceneBoundary, hasWebGL } from './ui/Fallback.jsx'

const Scene = lazy(() => import('./scene/Scene.jsx'))
const WEBGL = hasWebGL()

const KONAMI = 'ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight b a'

function useSecretCodes(onTrigger) {
  useEffect(() => {
    let keys = []
    const onKey = (e) => {
      keys = [...keys, e.key].slice(-10)
      const typed = keys.join('').toLowerCase()
      if (typed.endsWith('pen15') || keys.join(' ') === KONAMI) {
        keys = []
        onTrigger()
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [onTrigger])
}

function useTitleMarquee(mega) {
  useEffect(() => {
    let text = mega ? ' ✎ PEN 150 ✎ PEN 150 ✎ PEN 150 ✎ ' : ' ✎ PEN 15 ✎ FIFTEEN PENS ✎ PEN 15 ✎ '
    const id = setInterval(() => {
      text = text.slice(1) + text[0]
      document.title = text
    }, 180)
    return () => clearInterval(id)
  }, [mega])
}

export default function App() {
  const [entered, setEntered] = useState(false)
  const [calm, setCalm] = useState(false)
  const [mega, setMega] = useState(false)
  const [storm, setStorm] = useState(false)
  const [toast, setToast] = useState(null)

  const { scrollY } = useScroll()
  const smoothVel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const skew = useTransform(smoothVel, [-4000, 0, 4000], [10, 0, -10], { clamp: true })

  useEffect(() => startTracking(), [])
  useEffect(() => {
    S.calm = calm
    document.body.classList.toggle('calm', calm)
  }, [calm])
  useEffect(() => {
    S.mega = mega
    document.body.classList.toggle('mega', mega)
  }, [mega])
  useEffect(() => {
    document.body.classList.toggle('locked', !entered)
  }, [entered])

  const toggleMega = useCallback(() => {
    setMega((m) => !m)
    // S.mega still holds the pre-toggle value here.
    const next = !S.mega
    setToast(next ? '✎ PEN 150 MODE ACTIVATED ✎' : 'PEN 15 MODE RESTORED. PHEW.')
    confettiAt(innerWidth / 2, innerHeight / 2, 120)
    audio.boop(next ? 19 : -5)
  }, [])
  useSecretCodes(toggleMega)
  useTitleMarquee(mega)

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(id)
  }, [toast])

  const unleashStorm = useCallback(() => {
    S.stormStart = now()
    setStorm(true)
    audio.whoosh()
    document.body.classList.add('quake')
    setTimeout(() => {
      setStorm(false)
      document.body.classList.remove('quake')
    }, STORM_LENGTH * 1000)
  }, [])

  return (
    <SkewContext.Provider value={skew}>
      {WEBGL ? (
        <SceneBoundary fallback={<FallbackPens mega={mega} />}>
          <Suspense fallback={null}>
            <Scene mega={mega} calm={calm} storm={storm} />
          </Suspense>
        </SceneBoundary>
      ) : (
        <FallbackPens mega={mega} />
      )}

      <main className="content">
        <Hero />
        <Census />
        <Sponsor />
        <Facts />
        <Behold />
        <Testimonials />
        <Finale mega={mega} onStorm={unleashStorm} onMega={toggleMega} />
      </main>

      <ProgressPencil />
      <Ticker />
      <SoundButton />
      <Confetti />
      {!calm && <Cursor />}

      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            initial={{ scale: 0, rotate: -720, opacity: 0 }}
            animate={{ scale: 1, rotate: -6, opacity: 1 }}
            exit={{ scale: 4, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!entered && (
          <Splash
            onEnter={({ sound, calm }) => {
              setCalm(calm)
              audio.setMuted(!sound)
              setEntered(true)
            }}
          />
        )}
      </AnimatePresence>
    </SkewContext.Provider>
  )
}
