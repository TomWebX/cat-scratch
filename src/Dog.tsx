import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { CapsuleCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier'
import type { Group } from 'three'
import { Model } from './Model'
import { enemies, playerPos } from './registry'
import { useGame } from './store'

const SIGHT = 14
const SPEED = 3.4
const BITE_RANGE = 1.5
const BITE_COOLDOWN = 1.2

interface Props {
  position: [number, number, number]
  maxHp?: number
}

export function Dog({ position, maxHp = 3 }: Props) {
  const body = useRef<RapierRigidBody>(null)
  const visual = useRef<Group>(null)
  const hp = useRef(maxHp)
  const stun = useRef(0)
  const biteCd = useRef(0)
  const flash = useRef(0)
  const anim = useRef('idle')
  const [alive, setAlive] = useState(true)

  useFrame((_, dt) => {
    const b = body.current
    if (!b || !alive || !useGame.getState().started) return
    const p = b.translation()
    const dx = playerPos.x - p.x
    const dz = playerPos.z - p.z
    const dist = Math.hypot(dx, dz)
    const v = b.linvel()
    stun.current = Math.max(0, stun.current - dt)
    biteCd.current = Math.max(0, biteCd.current - dt)
    flash.current = Math.max(0, flash.current - dt)

    if (stun.current === 0 && dist < SIGHT && dist > 0.8 && !useGame.getState().dead) {
      b.setLinvel({ x: (dx / dist) * SPEED, y: v.y, z: (dz / dist) * SPEED }, true)
      if (visual.current) visual.current.rotation.y = Math.atan2(-dx, -dz)
      anim.current = 'run'
    } else if (stun.current === 0) {
      b.setLinvel({ x: 0, y: v.y, z: 0 }, true)
      anim.current = 'idle'
    }

    if (dist < BITE_RANGE && Math.abs(playerPos.y - p.y) < 1.2 && biteCd.current === 0 && stun.current === 0) {
      biteCd.current = BITE_COOLDOWN
      useGame.getState().damage(1)
    }

    if (visual.current) visual.current.scale.setScalar(flash.current > 0 ? 1.15 : 1)
  })

  const hurt = (damage: number, dirX: number, dirZ: number) => {
    const b = body.current
    if (!b || !alive) return
    hp.current -= damage
    stun.current = 0.5
    flash.current = 0.15
    const p = b.translation()
    b.setLinvel({ x: dirX * 9, y: 5, z: dirZ * 9 }, true)
    if (hp.current <= 0) {
      const { addBurst, addChaos, addKill, addPopup } = useGame.getState()
      addBurst(p.x, p.y + 0.5, p.z)
      addChaos(50)
      addKill()
      addPopup(useGame.getState().splatter ? 'SPLATSCH!' : 'PUFF!')
      enemies.delete(b.handle)
      setAlive(false)
    }
  }

  if (!alive) return null

  return (
    <RigidBody
      ref={(b) => {
        body.current = b
        if (!b) return
        enemies.set(b.handle, { body: b, hurt })
        return () => {
          enemies.delete(b.handle)
        }
      }}
      position={position}
      lockRotations
      colliders={false}
      friction={0}
    >
      <CapsuleCollider args={[0.25, 0.4]} />
      <group ref={visual} position={[0, -0.65, 0]}>
        <Model name="dog" height={1.1} rotationY={Math.PI} animRef={anim} />
      </group>
    </RigidBody>
  )
}
