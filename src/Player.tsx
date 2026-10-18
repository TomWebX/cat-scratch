import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CapsuleCollider, RigidBody, useRapier, type RapierRigidBody } from '@react-three/rapier'
import { type Group, Vector3 } from 'three'
import { findClimbable, inScratchCone, moveDirection } from './game'
import { nextLine } from './narrator'
import { climbables, enemies, hitProps, playerPos, props } from './registry'
import { useGame } from './store'

const WALK = 4.5
const SPRINT = 8
const JUMP = 7
const CLIMB_SPEED = 4
const SCRATCH_RANGE = 2.2
const SCRATCH_COOLDOWN = 0.35
const CAM_DIST = 5

const HIT_CLEAN = ['FFFT!', 'KRATZ!', 'MIAU-AU!', 'PFOTE!']
const HIT_SPLAT = ['RIIIP!', 'SPLAT!', 'FETZ!', 'KRATZ!']

export function Player() {
  const body = useRef<RapierRigidBody>(null)
  const visual = useRef<Group>(null)
  const tail = useRef<Group>(null)
  const claw = useRef<Group>(null)
  const { world, rapier } = useRapier()

  const keys = useRef(new Set<string>())
  const look = useRef({ yaw: 0, pitch: 0.35 })
  const facing = useRef(0)
  const jumpsLeft = useRef(2)
  const scratchTime = useRef(0)
  const cooldown = useRef(0)
  const jumpQueued = useRef(false)
  const camPos = useRef(new Vector3(0, 4, 8))

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      keys.current.add(e.code)
      if (e.code === 'Space') jumpQueued.current = true
      if (e.code === 'KeyB') useGame.getState().toggleSplatter()
    }
    const onKeyUp = (e: KeyboardEvent) => keys.current.delete(e.code)
    const onMove = (e: MouseEvent) => {
      if (!document.pointerLockElement) return
      look.current.yaw -= e.movementX * 0.0025
      look.current.pitch = Math.min(1.2, Math.max(-0.2, look.current.pitch + e.movementY * 0.0025))
    }
    const onDown = (e: MouseEvent) => {
      if (e.button === 0 && document.pointerLockElement) scratch()
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function scratch() {
    const b = body.current
    if (!b || cooldown.current > 0 || useGame.getState().dead) return
    cooldown.current = SCRATCH_COOLDOWN
    scratchTime.current = 0.18
    facing.current = look.current.yaw
    const p = b.translation()
    const fx = -Math.sin(facing.current)
    const fz = -Math.cos(facing.current)
    const { splatter, addChaos, addPopup } = useGame.getState()
    let hits = 0
    const knockedBefore = hitProps.size
    props.forEach((target, handle) => {
      const t = target.translation()
      if (!inScratchCone({ x: p.x, z: p.z }, facing.current, { x: t.x, z: t.z }, SCRATCH_RANGE, 1.0)) return
      const m = target.mass()
      target.applyImpulse({ x: fx * 5 * m, y: 3 * m, z: fz * 5 * m }, true)
      target.applyTorqueImpulse({ x: (Math.random() - 0.5) * m, y: (Math.random() - 0.5) * m, z: (Math.random() - 0.5) * m }, true)
      hitProps.add(handle)
      hits++
    })
    if (hitProps.size > knockedBefore) useGame.getState().report('props', hitProps.size - knockedBefore)
    enemies.forEach((e) => {
      const t = e.body.translation()
      if (!inScratchCone({ x: p.x, z: p.z }, facing.current, { x: t.x, z: t.z }, SCRATCH_RANGE + 0.4, 1.1)) return
      e.hurt(1, fx, fz)
      hits++
    })
    if (hits > 0) {
      const before = useGame.getState().chaos
      addChaos(10 * hits)
      const words = splatter ? HIT_SPLAT : HIT_CLEAN
      addPopup(words[Math.floor(Math.random() * words.length)])
      if (Math.floor(before / 100) !== Math.floor((before + 10 * hits) / 100) && !useGame.getState().subtitle) {
        useGame.getState().say(nextLine())
      }
    }
  }

  useFrame((state, dt) => {
    const b = body.current
    if (!b || !useGame.getState().started) return
    const k = keys.current
    const { yaw, pitch } = look.current

    const game = useGame.getState()
    if (game.respawnRequested) {
      b.setTranslation({ x: 0, y: 2, z: 6 }, true)
      b.setLinvel({ x: 0, y: 0, z: 0 }, true)
      game.clearRespawn()
    }
    const t0 = b.translation()
    playerPos.x = t0.x
    playerPos.y = t0.y
    playerPos.z = t0.z
    // Aus der Welt gefallen: zurücksetzen
    if (t0.y < -20) game.respawn()
    if (game.dead) {
      b.setLinvel({ x: 0, y: b.linvel().y, z: 0 }, true)
      return
    }

    const forward = (k.has('KeyW') ? 1 : 0) - (k.has('KeyS') ? 1 : 0)
    const right = (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0)
    const dir = moveDirection(forward, right, yaw)
    const speed = k.has('ShiftLeft') ? SPRINT : WALK
    const vel = b.linvel()
    const climbing = !!findClimbable(climbables, t0.x, t0.y, t0.z, dir.x, dir.z)
    b.setLinvel({ x: dir.x * speed, y: climbing ? CLIMB_SPEED : vel.y, z: dir.z * speed }, true)
    if (visual.current) {
      visual.current.rotation.order = 'YXZ'
      visual.current.rotation.x += ((climbing ? 1.25 : 0) - visual.current.rotation.x) * Math.min(1, dt * 14)
    }

    const pos = b.translation()
    const ray = new rapier.Ray({ x: pos.x, y: pos.y, z: pos.z }, { x: 0, y: -1, z: 0 })
    const grounded = !!world.castRay(ray, 0.6, true, undefined, undefined, undefined, b)
    if (grounded && vel.y <= 0.1) jumpsLeft.current = 2
    if (jumpQueued.current) {
      if (jumpsLeft.current > 0) {
        b.setLinvel({ x: dir.x * speed, y: JUMP, z: dir.z * speed }, true)
        jumpsLeft.current--
      }
      jumpQueued.current = false
    }

    if (dir.x !== 0 || dir.z !== 0) {
      const target = Math.atan2(-dir.x, -dir.z)
      let diff = target - facing.current
      diff = Math.atan2(Math.sin(diff), Math.cos(diff))
      facing.current += diff * Math.min(1, dt * 12)
    }
    if (visual.current) visual.current.rotation.y = facing.current

    cooldown.current = Math.max(0, cooldown.current - dt)
    scratchTime.current = Math.max(0, scratchTime.current - dt)
    if (claw.current) {
      claw.current.visible = scratchTime.current > 0
      claw.current.rotation.z = (0.18 - scratchTime.current) * 12 - 1
    }
    if (tail.current) tail.current.rotation.z = Math.sin(state.clock.elapsedTime * 6) * 0.4

    // Dritte-Person-Kamera mit weichem Nachziehen
    const horiz = Math.cos(pitch) * CAM_DIST
    const desired = new Vector3(
      pos.x + Math.sin(yaw) * horiz,
      pos.y + 0.6 + Math.sin(pitch) * CAM_DIST,
      pos.z + Math.cos(yaw) * horiz,
    )
    camPos.current.lerp(desired, Math.min(1, dt * 10))
    state.camera.position.copy(camPos.current)
    state.camera.lookAt(pos.x, pos.y + 0.3, pos.z)
  })

  return (
    <RigidBody
      ref={body}
      position={[0, 2, 6]}
      lockRotations
      colliders={false}
      friction={0}
      linearDamping={0.2}
    >
      <CapsuleCollider args={[0.2, 0.25]} />
      <group ref={visual} position={[0, -0.25, 0]}>
        <mesh castShadow position={[0, 0.3, 0]}>
          <boxGeometry args={[0.45, 0.4, 0.9]} />
          <meshStandardMaterial color="#e08a2e" />
        </mesh>
        <mesh castShadow position={[0, 0.5, -0.55]}>
          <boxGeometry args={[0.4, 0.35, 0.35]} />
          <meshStandardMaterial color="#e08a2e" />
        </mesh>
        <mesh position={[-0.13, 0.75, -0.55]}>
          <coneGeometry args={[0.08, 0.16, 4]} />
          <meshStandardMaterial color="#c4701a" />
        </mesh>
        <mesh position={[0.13, 0.75, -0.55]}>
          <coneGeometry args={[0.08, 0.16, 4]} />
          <meshStandardMaterial color="#c4701a" />
        </mesh>
        <mesh position={[-0.1, 0.55, -0.73]}>
          <sphereGeometry args={[0.04]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[0.1, 0.55, -0.73]}>
          <sphereGeometry args={[0.04]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <group ref={tail} position={[0, 0.45, 0.45]}>
          <mesh castShadow position={[0, 0.25, 0.1]} rotation={[0.4, 0, 0]}>
            <boxGeometry args={[0.1, 0.6, 0.1]} />
            <meshStandardMaterial color="#c4701a" />
          </mesh>
        </group>
        {[-0.15, 0.15].flatMap((x) =>
          [-0.3, 0.3].map((z) => (
            <mesh key={`${x}${z}`} position={[x, 0.1, z]}>
              <boxGeometry args={[0.12, 0.2, 0.12]} />
              <meshStandardMaterial color="#c4701a" />
            </mesh>
          )),
        )}
        <group ref={claw} position={[0, 0.45, -1.1]} visible={false}>
          {[-0.15, 0, 0.15].map((x) => (
            <mesh key={x} position={[x, 0, 0]}>
              <boxGeometry args={[0.04, 0.6, 0.02]} />
              <meshBasicMaterial color="#fff" />
            </mesh>
          ))}
        </group>
      </group>
    </RigidBody>
  )
}
