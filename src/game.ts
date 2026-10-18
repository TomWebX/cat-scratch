export interface Vec2 {
  x: number
  z: number
}

/** Bewegungsrichtung aus Eingaben relativ zur Kamera-Blickrichtung (yaw). */
export function moveDirection(forward: number, right: number, yaw: number): Vec2 {
  const len = Math.hypot(forward, right)
  if (len === 0) return { x: 0, z: 0 }
  const f = forward / len
  const r = right / len
  const sin = Math.sin(yaw)
  const cos = Math.cos(yaw)
  // Blick bei yaw=0 entlang -Z
  return {
    x: -sin * f + cos * r,
    z: -cos * f - sin * r,
  }
}

/** Liegt ein Ziel im Kratz-Kegel vor dem Spieler? */
export function inScratchCone(
  origin: Vec2,
  facingYaw: number,
  target: Vec2,
  range: number,
  halfAngle: number,
): boolean {
  const dx = target.x - origin.x
  const dz = target.z - origin.z
  const dist = Math.hypot(dx, dz)
  if (dist > range) return false
  if (dist < 1e-6) return true
  const fx = -Math.sin(facingYaw)
  const fz = -Math.cos(facingYaw)
  const dot = (dx * fx + dz * fz) / dist
  return Math.acos(Math.min(1, Math.max(-1, dot))) <= halfAngle
}
