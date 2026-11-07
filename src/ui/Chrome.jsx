import { useSyncExternalStore } from 'react'
import { audio } from '../audio.js'

const TICKER =
  '★ WELCOME TO PEN 15 ★ NOW WITH FIFTEEN (15) PENS ★ CLICK A PEN. GO ON. ★ PENS ARE NOT TOYS ★ THIS SITE IS BROUGHT TO YOU BY UMLAUT.FYI ★ SIGN OUR GUESTBOOK (WE DO NOT HAVE A GUESTBOOK) ★ Y2K COMPLIANT ★ '

export function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        <span>{TICKER}</span>
        <span>{TICKER}</span>
      </div>
    </div>
  )
}

export function useMuted() {
  return useSyncExternalStore(audio.subscribe, () => audio.muted)
}

export function SoundButton() {
  const muted = useMuted()
  return (
    <button
      className="sound-btn"
      onClick={() => audio.setMuted(!muted)}
      aria-label={muted ? 'Turn music on' : 'Turn music off'}
      title={muted ? 'Music on' : 'Music off'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  )
}
