import { create } from 'zustand'
import { advance, EMPTY_STATS, MISSIONS, type Stats } from './missions'
import { speak } from './narrator'

export interface Popup {
  id: number
  text: string
  x: number
  y: number
}

export interface Burst {
  id: number
  x: number
  y: number
  z: number
}

export const MAX_HP = 5
const INVULNERABLE_MS = 1000

interface GameState {
  chaos: number
  kills: number
  hp: number
  dead: boolean
  respawnRequested: boolean
  lastHurt: number
  splatter: boolean
  started: boolean
  popups: Popup[]
  bursts: Burst[]
  stats: Stats
  missionIndex: number
  showWin: boolean
  subtitle: string
  addChaos: (n: number) => void
  addKill: () => void
  report: (stat: keyof Stats, n?: number) => void
  say: (text: string) => void
  dismissWin: () => void
  damage: (n: number) => void
  respawn: () => void
  clearRespawn: () => void
  toggleSplatter: () => void
  setStarted: (v: boolean) => void
  addPopup: (text: string) => void
  removePopup: (id: number) => void
  addBurst: (x: number, y: number, z: number) => void
  removeBurst: (id: number) => void
}

let popupId = 0
let burstId = 0
let subtitleTimer: ReturnType<typeof setTimeout> | undefined

export const useGame = create<GameState>((set, get) => ({
  chaos: 0,
  kills: 0,
  hp: MAX_HP,
  dead: false,
  respawnRequested: false,
  lastHurt: 0,
  splatter: true,
  started: false,
  popups: [],
  bursts: [],
  stats: EMPTY_STATS,
  missionIndex: 0,
  showWin: false,
  subtitle: '',
  addChaos: (n) => set((s) => ({ chaos: s.chaos + n })),
  addKill: () => {
    set((s) => ({ kills: s.kills + 1 }))
    get().report('kills')
  },
  say: (text) => {
    speak(text)
    set({ subtitle: text })
    clearTimeout(subtitleTimer)
    subtitleTimer = setTimeout(() => set({ subtitle: '' }), Math.max(4000, text.length * 75))
  },
  report: (stat, n = 1) => {
    const s = get()
    const stats = { ...s.stats, [stat]: s.stats[stat] + n }
    const next = advance(s.missionIndex, stats)
    set({ stats })
    if (next === s.missionIndex) return
    const finished = next >= MISSIONS.length
    set({ missionIndex: next, showWin: finished })
    const outro = MISSIONS[next - 1].outro
    get().say(finished ? outro : `${outro} ${MISSIONS[next].intro}`)
  },
  dismissWin: () => set({ showWin: false }),
  damage: (n) => {
    const s = get()
    const now = performance.now()
    if (s.dead || now - s.lastHurt < INVULNERABLE_MS) return
    const hp = Math.max(0, s.hp - n)
    set({ hp, lastHurt: now, dead: hp === 0 })
  },
  respawn: () => set({ hp: MAX_HP, dead: false, respawnRequested: true, lastHurt: performance.now() }),
  clearRespawn: () => set({ respawnRequested: false }),
  toggleSplatter: () => set((s) => ({ splatter: !s.splatter })),
  setStarted: (v) => {
    const first = v && !get().started
    set({ started: v })
    if (first) setTimeout(() => get().say(MISSIONS[get().missionIndex].intro), 300)
  },
  addPopup: (text) =>
    set((s) => ({
      popups: [
        ...s.popups.slice(-5),
        { id: ++popupId, text, x: 40 + Math.random() * 20, y: 30 + Math.random() * 20 },
      ],
    })),
  removePopup: (id) => set((s) => ({ popups: s.popups.filter((p) => p.id !== id) })),
  addBurst: (x, y, z) => set((s) => ({ bursts: [...s.bursts.slice(-6), { id: ++burstId, x, y, z }] })),
  removeBurst: (id) => set((s) => ({ bursts: s.bursts.filter((b) => b.id !== id) })),
}))

if (import.meta.env.DEV) (window as unknown as { __game: typeof useGame }).__game = useGame