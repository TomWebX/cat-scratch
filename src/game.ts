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

/** Kletterbare Fläche als Rechteck im Grundriss; optional nur von einer Seite (Normale). */
export interface Climbable {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
  top: number
  nx?: number
  nz?: number
}

const CAT_RADIUS = 0.25
const CAT_HALF_HEIGHT = 0.45

/** Findet eine Fläche, an der die Katze gerade hochklettert (läuft gegen die Wand, Füße unterhalb der Oberkante). */
export function findClimbable(
  list: readonly Climbable[],
  px: number,
  py: number,
  pz: number,
  dirX: number,
  dirZ: number,
): Climbable | null {
  if (dirX === 0 && dirZ === 0) return null
  const feet = py - CAT_HALF_HEIGHT
  for (const c of list) {
    if (feet > c.top + 0.05 || feet < -0.2) continue
    const cx = Math.min(c.maxX, Math.max(c.minX, px))
    const cz = Math.min(c.maxZ, Math.max(c.minZ, pz))
    const d = Math.hypot(px - cx, pz - cz)
    if (d < 1e-6 || d > CAT_RADIUS + 0.2) continue
    const nx = (px - cx) / d
    const nz = (pz - cz) / d
    if (c.nx !== undefined && c.nz !== undefined && nx * c.nx + nz * c.nz < 0.5) continue
    if (-(dirX * nx + dirZ * nz) < 0.3) continue
    return c
  }
  return null
}
