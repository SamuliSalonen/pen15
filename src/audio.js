import { S } from './store.js'

// A tiny WebAudio chiptune engine. 150 BPM, because PEN 15(0).
// Scrolling opens the low-pass filter, so the music "wakes up" when you scroll.

const BPM = 150
const STEP = 60 / BPM / 4 // 16th notes
const VOLUME = 0.22

// A minor, F, C, G — the four chords of every song ever.
const CHORDS = [
  [57, 60, 64],
  [53, 57, 60],
  [48, 52, 55],
  [55, 59, 62],
]
const ARP = [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 4, 3, 2, 1, 2, 3]

let ctx, master, filter, noise, timer
let nextTime = 0
let step = 0
let muted = true
const listeners = new Set()

const midi = (n) => 440 * 2 ** ((n - 69) / 12)

function voice(type, freq, t, dur, gain, dest = filter) {
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(gain, t + 0.005)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(dest)
  o.start(t)
  o.stop(t + dur + 0.02)
  return o
}

function noiseHit(t, dur, gain, freq, q = 1) {
  const src = ctx.createBufferSource()
  src.buffer = noise
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = freq
  bp.Q.value = q
  const g = ctx.createGain()
  g.gain.setValueAtTime(gain, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(bp).connect(g).connect(filter)
  src.start(t)
  src.stop(t + dur + 0.02)
}

function kick(t) {
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.frequency.setValueAtTime(150, t)
  o.frequency.exponentialRampToValueAtTime(40, t + 0.12)
  g.gain.setValueAtTime(0.9, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2)
  o.connect(g).connect(master)
  o.start(t)
  o.stop(t + 0.22)
}

function playStep(s, t) {
  const bar = Math.floor(s / 16) % 4
  const i = s % 16
  const up = S.mega ? 12 : 0
  const chord = CHORDS[bar]
  const n = ARP[i]
  const note = chord[n % 3] + 12 * Math.floor(n / 3) + 12 + up
  voice('square', midi(note), t, STEP * 0.9, 0.08)
  if (i % 4 === 0) kick(t)
  if (i % 4 === 2) voice('triangle', midi(chord[0] - 24 + up), t, STEP * 1.8, 0.35)
  if (i % 8 === 4) noiseHit(t, 0.12, 0.5, 1800, 0.8)
  if (i % 2 === 1) noiseHit(t, 0.03, 0.18, 9000, 2)
}

function schedule() {
  // Music filter follows scroll speed: muffled when idle, bright when scrolling.
  const cutoff = 700 + Math.min(S.speed, 5000) * 2.4
  filter.frequency.setTargetAtTime(cutoff, ctx.currentTime, 0.08)
  while (nextTime < ctx.currentTime + 0.12) {
    playStep(step++, nextTime)
    nextTime += STEP
  }
}

function ensure() {
  if (ctx) return true
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return false
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0
  filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 900
  filter.Q.value = 6
  filter.connect(master)
  master.connect(ctx.destination)
  noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
  const d = noise.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  nextTime = ctx.currentTime + 0.05
  timer = setInterval(schedule, 25)
  return true
}

export const audio = {
  get muted() {
    return muted
  },
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
  setMuted(m) {
    muted = m
    if (!m && !ensure()) return
    if (ctx) {
      ctx.resume()
      master.gain.setTargetAtTime(m ? 0 : VOLUME, ctx.currentTime, 0.05)
    }
    listeners.forEach((fn) => fn(m))
  },
  boop(n = 0) {
    if (muted || !ctx) return
    const t = ctx.currentTime
    const o = voice('square', midi(60 + n), t, 0.18, 0.15, master)
    o.frequency.exponentialRampToValueAtTime(midi(72 + n), t + 0.12)
  },
  whoosh() {
    if (muted || !ctx) return
    const t = ctx.currentTime
    const src = ctx.createBufferSource()
    src.buffer = noise
    src.loop = true
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.Q.value = 3
    bp.frequency.setValueAtTime(150, t)
    bp.frequency.exponentialRampToValueAtTime(5000, t + 2.2)
    bp.frequency.exponentialRampToValueAtTime(200, t + 4.4)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.7, t + 0.3)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 4.5)
    src.connect(bp).connect(g).connect(master)
    src.start(t)
    src.stop(t + 4.6)
  },
  dispose() {
    clearInterval(timer)
  },
}
