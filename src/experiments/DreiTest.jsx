import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Environment, Float } from '@react-three/drei'

export default function DreiTest() {
  return (
    <Canvas camera={{ position: [3, 2, 5] }}>
      <OrbitControls />
      <Environment preset="city" />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
      <Float>
        <Text position={[0, 1.5, 0]} color="black">
          Hello R3F
        </Text>
      </Float>
    </Canvas>
  )
}
