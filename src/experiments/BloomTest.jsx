import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

export default function BloomTest() {
  return (
    <Canvas camera={{ position: [3, 2, 5] }}>
      <color attach="background" args={['black']} />
      <ambientLight />
      <directionalLight position={[3, 3, 3]} />
      <OrbitControls />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="cyan" emissive="cyan" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <EffectComposer>
        <Bloom luminanceThreshold={1} intensity={0.5} />
      </EffectComposer>
    </Canvas>
  )
}
