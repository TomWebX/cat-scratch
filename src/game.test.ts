import { describe, expect, it } from 'vitest'
import { inScratchCone, moveDirection } from './game'

describe('moveDirection', () => {
  it('läuft bei yaw 0 vorwärts entlang -Z', () => {
    const d = moveDirection(1, 0, 0)
    expect(d.x).toBeCloseTo(0)
    expect(d.z).toBeCloseTo(-1)
  })
  it('normalisiert diagonale Bewegung', () => {
    const d = moveDirection(1, 1, 0)
    expect(Math.hypot(d.x, d.z)).toBeCloseTo(1)
  })
  it('liefert ohne Eingabe Null', () => {
    expect(moveDirection(0, 0, 1)).toEqual({ x: 0, z: 0 })
  })
})

describe('inScratchCone', () => {
  const o = { x: 0, z: 0 }
  it('trifft Ziele vor der Katze', () => {
    expect(inScratchCone(o, 0, { x: 0, z: -1 }, 2, 1)).toBe(true)
  })
  it('trifft keine Ziele hinter der Katze', () => {
    expect(inScratchCone(o, 0, { x: 0, z: 1 }, 2, 1)).toBe(false)
  })
  it('trifft keine Ziele außerhalb der Reichweite', () => {
    expect(inScratchCone(o, 0, { x: 0, z: -5 }, 2, 1)).toBe(false)
  })
})
