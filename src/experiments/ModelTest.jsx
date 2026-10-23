import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Bounds, Center } from '@react-three/drei'
import { Model } from '../Model'

export default function ModelTest() {
  return (
    <Canvas camera={{ position: [3, 2, 5] }}>
      <ambientLight />
      <directionalLight position={[3, 3, 3]} />
      <Environment preset="city" />
      <OrbitControls makeDefault />
      <Suspense fallback={null}>
        <Bounds fit clip observe>
          <Center>
            <Model rotation={[0, Math.PI / 2, 0]} />
          </Center>
        </Bounds>
      </Suspense>
    </Canvas>
  )
}
