import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { useGame, type Burst } from './store'

const COUNT = 14
const LIFE = 0.9

function BurstEffect({ burst }: { burst: Burst }) {
  const group = useRef<Group>(null)
  const age = useRef(0)
  const splatter = useGame((s) => s.splatter)
  const remove = useGame((s) => s.removeBurst)
  const vel = useMemo(
    () =>
      Array.from({ length: COUNT }, () => ({
        x: (Math.random() - 0.5) * 6,
        y: 3 + Math.random() * 4,
        z: (Math.random() - 0.5) * 6,
      })),
    [],
  )

  useFrame((_, dt) => {
    age.current += dt
    const g = group.current
    if (!g) return
    g.children.forEach((c, i) => {
      c.position.x += vel[i].x * dt
      c.position.y += vel[i].y * dt
      c.position.z += vel[i].z * dt
      vel[i].y -= 15 * dt
      c.scale.setScalar(Math.max(0, 1 - age.current / LIFE))
    })
    if (age.current > LIFE) remove(burst.id)
  })

  return (
    <group ref={group} position={[burst.x, burst.y, burst.z]}>
      {vel.map((_, i) => (
        <mesh key={i}>
          <boxGeometry args={[0.18, 0.18, 0.18]} />
          <meshBasicMaterial color={splatter ? (i % 3 === 0 ? '#ffb3b3' : '#d11a1a') : i % 2 ? '#ffe14d' : '#ffffff'} />
        </mesh>
      ))}
    </group>
  )
}

export function Effects() {
  const bursts = useGame((s) => s.bursts)
  return (
    <>
      {bursts.map((b) => (
        <BurstEffect key={b.id} burst={b} />
      ))}
    </>
  )
}
