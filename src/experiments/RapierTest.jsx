import { Canvas } from '@react-three/fiber'
import { Physics, RigidBody } from '@react-three/rapier'

export default function RapierTest() {
    return (
        <Canvas camera={{ position: [3, 2, 5] }}>
            <ambientLight />
            <directionalLight position={[3, 3, 3]} />
            <Physics>
                <RigidBody position={[0, 4, 0]}>
                    <mesh><boxGeometry /><meshStandardMaterial color="hotpink" /></mesh>
                </RigidBody>
                <RigidBody type="fixed">
                    <mesh position={[0, -1, 0]}><boxGeometry args={[10, 0.5, 10]} /><meshStandardMaterial /></mesh>
                </RigidBody>
            </Physics>
        </Canvas>
    )
}