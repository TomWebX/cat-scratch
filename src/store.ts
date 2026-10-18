import { create } from 'zustand'

export interface Popup {
  id: number
  text: string
  x: number
  y: number
}

interface GameState {
  chaos: number
  splatter: boolean
  started: boolean
  popups: Popup[]
  addChaos: (n: number) => void
  toggleSplatter: () => void
  setStarted: (v: boolean) => void
  addPopup: (text: string) => void
  removePopup: (id: number) => void
}

let popupId = 0

export const useGame = create<GameState>((set) => ({
  chaos: 0,
  splatter: true,
  started: false,
  popups: [],
  addChaos: (n) => set((s) => ({ chaos: s.chaos + n })),
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
}))
