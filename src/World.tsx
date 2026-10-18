import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useEffect, useMemo } from 'react'
import { Bone, Bowl } from './Collectibles'
import { Dog } from './Dog'
import type { Climbable } from './game'
import { climbables, props } from './registry'

// Stabile Objekte, damit Effekte nicht bei jedem Render neu laufen
const HOUSE_BACK = { top: 3.4, normal: [0, -1] as [number, number] }
const HOUSE_WEST = { top: 3.4, normal: [-1, 0] as [number, number] }
const HOUSE_EAST = { top: 3.4, normal: [1, 0] as [number, number] }
const POST = { top: 3.2 }

type Shape = 'box' | 'barrel' | 'vase'

interface PropDef {
  id: string
  shape: Shape
  pos: [number, number, number]
  color: string
}

function Prop({ shape, pos, color }: PropDef) {
  return (
    <RigidBody
      position={pos}
      colliders={shape === 'box' ? 'cuboid' : shape === 'barrel' ? 'hull' : 'ball'}
      ref={(b) => {
        if (!b) return
        props.set(b.handle, b)
        return () => {
          props.delete(b.handle)
        }
      }}
    >
      {shape === 'box' && (
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      )}
      {shape === 'barrel' && (
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.4, 0.4, 1, 12]} />
          <meshStandardMaterial color={color} />
        </mesh>
      )}
      {shape === 'vase' && (
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.35, 16, 12]} />
          <meshStandardMaterial color={color} />
        </mesh>
      )}
    </RigidBody>
  )
}

function Wall({
  pos,
  size,
  color = '#e8dcc8',
  climb,
}: {
  pos: [number, number, number]
  size: [number, number, number]
  color?: string
  climb?: { top: number; normal?: [number, number] }
}) {
  useEffect(() => {
    if (!climb) return
    const c: Climbable = {
      minX: pos[0] - size[0] / 2,
      maxX: pos[0] + size[0] / 2,
      minZ: pos[2] - size[2] / 2,
      maxZ: pos[2] + size[2] / 2,
      top: climb.top,
      nx: climb.normal?.[0],
      nz: climb.normal?.[1],
    }
    climbables.push(c)
    return () => {
      climbables.splice(climbables.indexOf(c), 1)
    }
  }, [climb, pos, size])

  return (
    <RigidBody type="fixed" position={pos} colliders={false}>
      <CuboidCollider args={[size[0] / 2, size[1] / 2, size[2] / 2]} />
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}

function Tree({ pos }: { pos: [number, number, number] }) {
  return (
    <RigidBody type="fixed" position={pos} colliders="hull">
      <mesh castShadow position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 3, 8]} />
        <meshStandardMaterial color="#6b4423" />
      </mesh>
      <mesh castShadow position={[0, 4, 0]}>
        <icosahedronGeometry args={[1.8, 0]} />
        <meshStandardMaterial color="#3f8f3f" flatShading />
      </mesh>
    </RigidBody>
  )
}

export function World() {
  const defs = useMemo<PropDef[]>(() => {
    const out: PropDef[] = []
    const colors = ['#b5651d', '#4a90d9', '#c0392b', '#8e44ad', '#f1c40f']
    for (let i = 0; i < 18; i++) {
      const a = i * 2.4
      const r = 4 + (i % 6) * 1.6
      const shape: Shape = i % 3 === 0 ? 'box' : i % 3 === 1 ? 'barrel' : 'vase'
      out.push({ id: `p${i}`, shape, pos: [Math.cos(a) * r, 1 + (i % 3) * 0.3, Math.sin(a) * r - 4], color: colors[i % colors.length] })
    }
    // Kistenturm
    for (let y = 0; y < 4; y++) out.push({ id: `t${y}`, shape: 'box', pos: [-8, 0.5 + y * 0.85, -2], color: '#b5651d' })
    return out
  }, [])

  return (
    <>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[40, 0.5, 40]} position={[0, -0.5, 0]} />
        <mesh receiveShadow position={[0, -0.5, 0]}>
          <boxGeometry args={[80, 1, 80]} />
          <meshStandardMaterial color="#6fb04a" />
        </mesh>
      </RigidBody>

      {/* Straße */}
      <mesh receiveShadow position={[0, 0.01, 14]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 6]} />
        <meshStandardMaterial color="#555" />
      </mesh>

      {/* Haus: Außenwände sind kletterbar, das Dach schließt bündig ab */}
      <Wall pos={[0, 1.5, -14]} size={[10, 3, 0.3]} color="#d9a066" climb={HOUSE_BACK} />
      <Wall pos={[-5, 1.5, -10]} size={[0.3, 3, 8]} color="#d9a066" climb={HOUSE_WEST} />
      <Wall pos={[5, 1.5, -10]} size={[0.3, 3, 8]} color="#d9a066" climb={HOUSE_EAST} />
      <Wall pos={[-3.5, 1.5, -6]} size={[3, 3, 0.3]} color="#d9a066" />
      <Wall pos={[3.5, 1.5, -6]} size={[3, 3, 0.3]} color="#d9a066" />
      <Wall pos={[0, 3.2, -10]} size={[10.3, 0.4, 8.3]} color="#a0442c" />

      {/* Kratzpfosten */}
      <Wall pos={[10, 1.6, 5]} size={[1, 3.2, 1]} color="#b08040" climb={POST} />
      <Bone position={[10, 3.8, 5]} />
      <Bone position={[0, 3.9, -10]} />
      <Bone position={[-11, 0.9, -9]} />
      <Bowl position={[0, 0.15, -12.5]} />

      {/* Zaun */}
      {Array.from({ length: 16 }, (_, i) => (
        <Wall key={i} pos={[-16 + i * 2, 0.6, 9]} size={[1.6, 1.2, 0.2]} color="#f5f0e6" />
      ))}

      <Tree pos={[12, 0, -4]} />
      <Tree pos={[-14, 0, -8]} />
      <Tree pos={[14, 0, 4]} />

      <Dog position={[-6, 1, -2]} />
      <Dog position={[8, 1, -8]} />
      <Dog position={[0, 1, -18]} maxHp={4} />

      {defs.map((d) => (
        <Prop key={d.id} {...d} />
      ))}
    </>
  )
}
