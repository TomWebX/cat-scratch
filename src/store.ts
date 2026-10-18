import { create } from 'zustand'

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
  addChaos: (n: number) => void
  addKill: () => void
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
  addChaos: (n) => set((s) => ({ chaos: s.chaos + n })),
  addKill: () => set((s) => ({ kills: s.kills + 1 })),
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
  setStarted: (v) => set({ started: v }),
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