import type { RapierRigidBody } from '@react-three/rapier'

/** Alle durch Kratzen anstoßbaren Objekte. */
export const props = new Map<number, RapierRigidBody>()

/** Aktuelle Spielerposition (wird jeden Frame vom Player geschrieben). */
export const playerPos = { x: 0, y: 0, z: 0 }

export interface EnemyHandle {
  body: RapierRigidBody
  hurt: (damage: number, dirX: number, dirZ: number) => void
}

export const enemies = new Map<number, EnemyHandle>()
