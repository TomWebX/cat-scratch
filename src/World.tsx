import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useEffect, useMemo } from 'react'
import { Bone, Bowl } from './Collectibles'
import { Dog } from './Dog'
import type { Climbable } from './game'
import { Model } from './Model'
import { climbables, props } from './registry'

// Stabile Objekte, damit Effekte nicht bei jedem Render neu laufen
const HOUSE_BACK = { top: 3.4, normal: [0, -1] as [number, number] }
const HOUSE_WEST = { top: 3.4, normal: [-1, 0] as [number, number] }
const HOUSE_EAST = { top: 3.4, normal: [1, 0] as [number, number] }
const POST = { top: 3.2 }

type Kind = 'box' | 'barrel' | 'vase' | 'chair' | 'sofa' | 'bookcase' | 'table'

interface PropDef {
  id: string
  kind: Kind
  pos: [number, number, number]
}

/** Modell, Zielgröße und Kollisionsbox (halbe Kantenlängen) je Objektart. */
const KINDS: Record<Kind, { model: string; height?: number; scale?: number; half: [number, number, number] }> = {
  box: { model: 'box', height: 0.8, half: [0.3, 0.4, 0.3] },
  barrel: { model: 'trashcan', height: 1, half: [0.27, 0.5, 0.27] },
  vase: { model: 'plant', height: 0.7, half: [0.22, 0.35, 0.22] },
  chair: { model: 'chair', height: 0.9, half: [0.22, 0.45, 0.22] },
  sofa: { model: 'sofa', scale: 1.9, half: [0.93, 0.44, 0.39] },
  bookcase: { model: 'bookcase', scale: 2.2, half: [0.44, 0.93, 0.28] },
  table: { model: 'table', scale: 2, half: [0.66, 0.23, 0.4] },
}

function Prop({ kind, pos }: PropDef) {
  const k = KINDS[kind]
  return (
    <RigidBody
      position={pos}
      colliders={false}
      ref={(b) => {
        if (!b) return
        props.set(b.handle, b)
        return () => {
          props.delete(b.handle)
        }
      }}
    >
      <CuboidCollider args={k.half} />
      <group position={[0, -k.half[1], 0]}>
        <Model name={k.model} height={k.height} scale={k.scale} />
      </group>
    </RigidBody>
  )
}

/** Statische Dekoration (optional mit Kollisionsbox). */
function Decor({
  name,
  pos,
  height,
  scale,
  rotY = 0,
  half,
}: {
  name: string
  pos: [number, number, number]
  height?: number
  scale?: number
  rotY?: number
  half?: [number, number, number]
}) {
  const model = <Model name={name} height={height} scale={scale} rotationY={rotY} />
  if (!half) return <group position={pos}>{model}</group>
  return (
    <RigidBody type="fixed" position={pos} colliders={false}>
      <CuboidCollider args={half} position={[0, half[1], 0]} />
      {model}
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

function Tree({ pos, name = 'tree-a' }: { pos: [number, number, number]; name?: string }) {
  return (
    <RigidBody type="fixed" position={pos} colliders={false}>
      <CuboidCollider args={[0.3, 1.5, 0.3]} position={[0, 1.5, 0]} />
      <Model name={name} height={5.5} />
    </RigidBody>
  )
}

const FENCE_STEP = 2.4

function Fence({ x, z }: { x: number; z: number }) {
  return (
    <RigidBody type="fixed" position={[x, 0, z]} colliders={false}>
      <CuboidCollider args={[FENCE_STEP / 2, 0.42, 0.12]} position={[0, 0.42, 0]} />
      <Model name="fence" scale={FENCE_STEP} />
    </RigidBody>
  )
}

export function World() {
  const defs = useMemo<PropDef[]>(() => {
    const out: PropDef[] = []
    const kinds: Kind[] = ['box', 'barrel', 'vase', 'chair', 'box', 'vase']
    for (let i = 0; i < 18; i++) {
      const a = i * 2.4
      const r = 4 + (i % 6) * 1.6
      out.push({ id: `p${i}`, kind: kinds[i % kinds.length], pos: [Math.cos(a) * r, 1 + (i % 3) * 0.3, Math.sin(a) * r - 4] })
    }
    // Kistenturm
    for (let y = 0; y < 4; y++) out.push({ id: `t${y}`, kind: 'box', pos: [-8, 0.5 + y * 0.85, -2] })
    // Einrichtung im Haus
    out.push({ id: 'sofa', kind: 'sofa', pos: [-3, 0.5, -13.2] })
    out.push({ id: 'shelf', kind: 'bookcase', pos: [3.6, 1, -13.4] })
    out.push({ id: 'table', kind: 'table', pos: [3, 0.5, -9] })
    out.push({ id: 'chair1', kind: 'chair', pos: [-3.5, 0.6, -9] })
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
      {Array.from({ length: 13 }, (_, i) => (
        <Fence key={i} x={-16 + i * FENCE_STEP} z={9} />
      ))}

      <Tree pos={[12, 0, -4]} />
      <Tree pos={[-14, 0, -8]} name="tree-oak" />
      <Tree pos={[14, 0, 4]} name="tree-pine" />
      <Tree pos={[-12, 0, 5]} name="tree-a" />

      {/* Dekoration */}
      <Decor name="rug" pos={[0, 0.02, -9]} scale={4} />
      <Decor name="lamp" pos={[-4.2, 0, -7]} height={1.7} />
      <Decor name="rock-tall" pos={[-18, 0, -12]} height={2.5} half={[1.2, 1.2, 0.8]} />
      <Decor name="rock-a" pos={[8, 0, 2]} scale={2.5} half={[0.9, 0.3, 1.2]} />
      <Decor name="rock-a" pos={[-7, 0, 7]} scale={2} rotY={1} />
      <Decor name="stump" pos={[6, 0, -2]} scale={2.5} />
      <Decor name="logs" pos={[-10, 0, -5]} scale={2.5} rotY={0.6} />
      {[
        [-7, -5],
        [7, -4.5],
        [-9, 8],
        [4, 8],
        [-13, 2],
      ].map(([x, z]) => (
        <Decor key={`b${x}${z}`} name="bush" pos={[x, 0, z]} scale={3.5} />
      ))}
      {[
        [-2, 4],
        [-1, 4.6],
        [2, 5],
        [5, 6],
        [-6, 3],
        [9, -1],
      ].map(([x, z]) => (
        <Decor key={`f${x}${z}`} name="flower" pos={[x, 0, z]} scale={3} />
      ))}

      <Dog position={[-6, 1, -2]} />
      <Dog position={[8, 1, -8]} />
      <Dog position={[0, 1, -18]} maxHp={4} />

      {defs.map((d) => (
        <Prop key={d.id} {...d} />
      ))}
    </>
  )
}
