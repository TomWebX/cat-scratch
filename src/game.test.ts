import { describe, expect, it } from 'vitest'
import { findClimbable, inScratchCone, moveDirection } from './game'

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

describe('findClimbable', () => {
  const wall = { minX: 4.85, maxX: 5.15, minZ: -14, maxZ: -6, top: 3.4, nx: 1, nz: 0 }
  it('klettert, wenn die Katze gegen die Wand läuft', () => {
    expect(findClimbable([wall], 5.4, 1, -10, -1, 0)).toBe(wall)
  })
  it('klettert nicht, wenn sie von der Wand weg läuft', () => {
    expect(findClimbable([wall], 5.4, 1, -10, 1, 0)).toBeNull()
  })
  it('klettert nicht von der falschen Seite', () => {
    expect(findClimbable([wall], 4.6, 1, -10, 1, 0)).toBeNull()
  })
  it('hört oben auf, sobald die Füße über der Kante sind', () => {
    expect(findClimbable([wall], 5.4, 4.0, -10, -1, 0)).toBeNull()
  })
  it('klettert nicht ohne Eingabe oder weit entfernt', () => {
    expect(findClimbable([wall], 5.4, 1, -10, 0, 0)).toBeNull()
    expect(findClimbable([wall], 7, 1, -10, -1, 0)).toBeNull()
  })
})
