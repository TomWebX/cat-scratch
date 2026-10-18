import type { RapierRigidBody } from '@react-three/rapier'
import type { Climbable } from './game'

/** Alle durch Kratzen anstoßbaren Objekte. */
export const props = new Map<number, RapierRigidBody>()

/** Aktuelle Spielerposition (wird jeden Frame vom Player geschrieben). */
export const playerPos = { x: 0, y: 0, z: 0 }
if (import.meta.env.DEV) (window as unknown as { __pos: typeof playerPos }).__pos = playerPos

export interface EnemyHandle {
  body: RapierRigidBody
  hurt: (damage: number, dirX: number, dirZ: number) => void
}

export const enemies = new Map<number, EnemyHandle>()

/** Kletterbare Flächen, registriert von Welt-Objekten. */
export const climbables: Climbable[] = []

/** Bereits umgestoßene Objekte (für Missionsfortschritt). */
export const hitProps = new Set<number>()
