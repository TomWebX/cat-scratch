import { describe, expect, it } from 'vitest'
import { advance, EMPTY_STATS, MISSIONS } from './missions'

describe('advance', () => {
  it('bleibt bei unerfüllter Mission', () => {
    expect(advance(0, { ...EMPTY_STATS, props: 4 })).toBe(0)
  })
  it('geht bei erfüllter Mission weiter', () => {
    expect(advance(0, { ...EMPTY_STATS, props: 5 })).toBe(1)
  })
  it('überspringt mehrere bereits erfüllte Missionen', () => {
    expect(advance(0, { props: 9, kills: 3, bones: 0, bowl: 0 })).toBe(2)
  })
  it('endet nach der letzten Mission', () => {
    expect(advance(0, { props: 9, kills: 3, bones: 3, bowl: 1 })).toBe(MISSIONS.length)
  })
})
