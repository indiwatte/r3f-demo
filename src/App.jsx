import { Canvas } from '@react-three/fiber'

export default function App() {
  return (
    <Canvas>
      <ambientLight />
      <directionalLight position={[3, 3, 3]} />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
    </Canvas>
  )
}
