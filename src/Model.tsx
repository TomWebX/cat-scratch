import { useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'
import { Box3, Mesh, Vector3, type Group } from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'

export const modelUrl = (name: string) => `${import.meta.env.BASE_URL}models/${name}.glb`

export const MODEL_NAMES = [
  'cat', 'dog', 'tree-a', 'tree-pine', 'tree-oak', 'rock-a', 'rock-tall', 'bush', 'stump', 'logs', 'flower',
  'fence', 'sofa', 'bookcase', 'chair', 'table', 'lamp', 'plant', 'box', 'trashcan', 'rug',
]
MODEL_NAMES.forEach((n) => useGLTF.preload(modelUrl(n)))

interface ModelProps {
  name: string
  /** Zielhöhe in Metern; sonst `scale`. */
  height?: number
  scale?: number
  rotationY?: number
  /** Name der Animation, die abgespielt werden soll (wird pro Frame gelesen). */
  animRef?: MutableRefObject<string>
  shadows?: boolean
}

/** Lädt ein GLB-Modell, setzt den Ursprung auf die Bodenmitte und skaliert es. */
export function Model({ name, height, scale = 1, rotationY = 0, animRef, shadows = true }: ModelProps) {
  const gltf = useGLTF(modelUrl(name))
  const root = useRef<Group>(null)

  const { object, offset, factor } = useMemo(() => {
    const object = clone(gltf.scene)
    const box = new Box3().setFromObject(object)
    const size = box.getSize(new Vector3())
    const center = box.getCenter(new Vector3())
    return {
      object,
      offset: [-center.x, -box.min.y, -center.z] as [number, number, number],
      factor: height ? height / size.y : scale,
    }
  }, [gltf.scene, height, scale])

  useLayoutEffect(() => {
    object.traverse((o) => {
      if ((o as Mesh).isMesh) {
        o.castShadow = shadows
        o.receiveShadow = shadows
      }
    })
  }, [object, shadows])

  const { actions } = useAnimations(gltf.animations, root)
  const current = useRef('')

  useEffect(() => {
    if (!animRef) return
    const first = actions[animRef.current] ?? actions.idle
    first?.reset().play()
    current.current = animRef.current
  }, [actions, animRef])

  useFrame(() => {
    if (!animRef || animRef.current === current.current) return
    const next = actions[animRef.current]
    if (!next) return
    actions[current.current]?.fadeOut(0.15)
    next.reset().fadeIn(0.15).play()
    current.current = animRef.current
  })

  return (
    <group ref={root} rotation={[0, rotationY, 0]} scale={factor}>
      <primitive object={object} position={offset} />
    </group>
  )
}
