import { Physics, RigidBody } from '@react-three/rapier'
import { Model } from '../Model'
import { useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'

function Crate({ position }) {
    return (
        <RigidBody position={position}>
            <mesh>
                <boxGeometry />
                <meshStandardMaterial color="#c8873a" />
            </mesh>
        </RigidBody>
    )
}

export default function Hangar({ crates }) {

    const scroll = useScroll()
    const [active, setActive] = useState(false)

    useFrame(() => {
        const isActive = scroll.visible(0.78, 0.1)
        if (isActive !== active) setActive(isActive)
    })
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

            {crates.map((crate) => (
                <Crate key={crate.id} position={[crate.x, 6, crate.z]} />
            ))}

        </Physics>
    )
}
