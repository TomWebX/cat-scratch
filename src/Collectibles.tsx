import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { playerPos } from './registry'
import { MISSIONS } from './missions'
import { useGame } from './store'

type Vec3 = [number, number, number]

const PICKUP_RADIUS = 1.1

function near(p: Vec3, r: number) {
  return Math.hypot(playerPos.x - p[0], playerPos.z - p[2]) < r && Math.abs(playerPos.y - p[1]) < 1.6
}

/** Goldene Fischgräte: einsammeln zählt für die Mission. */
export function Bone({ position }: { position: Vec3 }) {
  const ref = useRef<Group>(null)
  const [taken, setTaken] = useState(false)

  useFrame((state) => {
    if (taken || !useGame.getState().started) return
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 2
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1
    }
    if (near(position, PICKUP_RADIUS)) {
      setTaken(true)
      const g = useGame.getState()
      g.addBurst(position[0], position[1], position[2])
      g.addPopup('KLING!')
      g.addChaos(25)
      g.report('bones')
    }
  })

  if (taken) return null
  return (
    <group ref={ref} position={position}>
      <mesh>
        <boxGeometry args={[0.8, 0.08, 0.08]} />
        <meshStandardMaterial color="#ffd23f" emissive="#ffb300" emissiveIntensity={0.6} />
      </mesh>
      {[-0.28, -0.1, 0.08, 0.26].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.12, 0]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[0.05, 0.25, 0.05]} />
            <meshStandardMaterial color="#ffd23f" emissive="#ffb300" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[x, -0.12, 0]} rotation={[0, 0, -0.5]}>
            <boxGeometry args={[0.05, 0.25, 0.05]} />
            <meshStandardMaterial color="#ffd23f" emissive="#ffb300" emissiveIntensity={0.6} />
          </mesh>
        </group>
      ))}
      <mesh position={[0.5, 0, 0]}>
        <coneGeometry args={[0.15, 0.3, 3]} />
        <meshStandardMaterial color="#ffd23f" emissive="#ffb300" emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

/** Futternapf: Ziel der letzten Mission. */
export function Bowl({ position }: { position: Vec3 }) {
  useFrame(() => {
    const g = useGame.getState()
    if (!g.started || g.missionIndex !== MISSIONS.length - 1) return
    if (near(position, 1.2)) g.report('bowl')
  })
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.4, 0.3, 0.3, 16]} />
        <meshStandardMaterial color="#d6336c" />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.05, 16]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>
    </group>
  )
}
