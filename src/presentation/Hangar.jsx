import { Physics, RigidBody } from '@react-three/rapier'
import { Model } from '../Model'
import { useRef} from 'react'



function Crate({ position }) {
    const body = useRef()

    function kick(event) {
        event.stopPropagation()
        body.current.applyImpulse({ x: Math.random() * 4 - 2, y: 8, z: Math.random() * 4 - 2 }, true)
        body.current.applyTorqueImpulse({ x: Math.random() - 0.5, y: Math.random() - 0.5, z: Math.random() - 0.5 }, true)
    }

    return (
        <RigidBody ref={body} position={position}>
            <mesh onClick={kick}>
                <boxGeometry />
                <meshStandardMaterial color="#c8873a" />
            </mesh>
        </RigidBody>
    )
}

function Lamp({ position, night }) {
    return (
        <group position={position}>
            <RigidBody type="fixed">
                <mesh position={[0, 2, 0]}>
                    <cylinderGeometry args={[0.1, 0.1, 4]} />
                    <meshStandardMaterial color="#333" />
                </mesh>
            </RigidBody>
            <mesh position={[0, 4.2, 0]}>
                <sphereGeometry args={[0.4, 16, 16]} />
                <meshStandardMaterial color="#ffd27a" emissive="#ffb347" emissiveIntensity={night ? 4 : 0} toneMapped={false} />
            </mesh>
            {night && <pointLight position={[0, 4.2, 0]} color="#ffb347" intensity={30} distance={14} />}
        </group>
    )
}



export default function Hangar({ crates, night, active }) {
    return (
        <Physics paused={!active}>

            <RigidBody type="fixed">
                <mesh position={[-12, -9, 0]}>
                    <boxGeometry args={[24, 0.5, 14]} />
                    <meshStandardMaterial color="#8a8f98" />
                </mesh>
            </RigidBody>

            <RigidBody type="fixed" colliders="hull">
                <Model position={[-12, -7.3, 0]} rotation={[0, Math.PI / 2, 0]} />
            </RigidBody>

            <Lamp position={[-22, -8.75, -5]} night={night} />
            <Lamp position={[-2, -8.75, -5]} night={night} />
            <Lamp position={[-22, -8.75, 5]} night={night} />
            <Lamp position={[-2, -8.75, 5]} night={night} />


            {crates.map((crate) => (
                <Crate key={crate.id} position={[crate.x, 6, crate.z]} />
            ))}

        </Physics>
    )
}
