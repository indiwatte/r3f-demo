import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useControls } from 'leva'

export default function LevaTest() {
  const { color, scale } = useControls({ color: 'orange', scale: { value: 1, min: 0.5, max: 3 } })

  return (
    <Canvas camera={{ position: [3, 2, 5] }}>
      <ambientLight />
      <directionalLight position={[3, 3, 3]} />
      <OrbitControls />
      <mesh scale={scale}>
        <boxGeometry />
        <meshStandardMaterial color={color} />
      </mesh>
    </Canvas>
  )
}
