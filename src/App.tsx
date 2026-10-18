import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { Hud } from './Hud'
import { Player } from './Player'
import { World } from './World'
import { speak } from './narrator'
import { useGame } from './store'

export default function App() {
  const started = useGame((s) => s.started)

  return (
    <>
      <Canvas
        shadows
        camera={{ fov: 65, position: [0, 4, 12] }}
        onClick={() => {
          if (started && !document.pointerLockElement)           Promise.resolve(document.querySelector('canvas')?.requestPointerLock()).catch(() => {})
        }}
      >
        <Sky sunPosition={[50, 40, 20]} />
        <ambientLight intensity={0.6} />
        <directionalLight
          castShadow
          position={[15, 25, 10]}
          intensity={1.8}
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
        />
        <Suspense fallback={null}>
          <Physics paused={!started} gravity={[0, -20, 0]}>
            <World />
            <Player />
          </Physics>
        </Suspense>
      </Canvas>
      <Hud />
    </>
  )
}

useGame.subscribe((s, prev) => {
  if (s.started && !prev.started) setTimeout(() => speak('Timmi Tatz hat Hunger. Das Abendessen ist weg. Jemand wird dafür bezahlen.'), 300)
})
