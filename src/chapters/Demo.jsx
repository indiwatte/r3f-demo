import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'

import { Physics, RigidBody } from '@react-three/rapier'
import { MathUtils } from 'three'
import { Spaceship } from '../components/Spaceship'





const shapes = {
    crate: { colliders: 'cuboid', color: '#c8873a', geometry: <boxGeometry /> },
    ball: { colliders: 'ball', color: '#ff4f7b', geometry: <sphereGeometry args={[0.6, 32, 32]} /> },
    barrel: { colliders: 'hull', color: '#3d7eff', geometry: <cylinderGeometry args={[0.5, 0.5, 1.2, 24]} /> },
}

function Crate({ id, shape, position, onKick }) {
    const body = useRef()
    const [hovered, setHovered] = useState(false)
    useCursor(hovered)

    const { colliders, color, geometry } = shapes[shape]

    function kick(event) {
        event.stopPropagation()
        body.current.applyImpulse({ x: Math.random() * 4 - 2, y: 8, z: Math.random() * 4 - 2 }, true)
        body.current.applyTorqueImpulse({ x: Math.random() - 0.5, y: Math.random() - 0.5, z: Math.random() - 0.5 }, true)
        onKick(id)
    }

    return (
        <RigidBody ref={body} position={position} colliders={colliders}>
            <mesh onClick={kick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>

                {geometry}
                <meshStandardMaterial color={color} />
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

function ParkedShip({ night }) {
    const body = useRef()
    const start = useRef(null)
    const height = useRef(0)
    const [flying, setFlying] = useState(false)
    const [hovered, setHovered] = useState(false)
    useCursor(hovered)


    useFrame((state, delta) => {
        if (!body.current) return
        start.current ??= { ...body.current.translation() }

        const hover = Math.sin(state.clock.elapsedTime * 2) * 0.3
        const target = flying ? 3 + hover : 0
        height.current = MathUtils.damp(height.current, target, 2, delta)

        const { x, y, z } = start.current
        body.current.setNextKinematicTranslation({ x, y: y + height.current, z })
    })

    function toggle(event) {
        event.stopPropagation()
        setFlying(!flying)
    }

    return (
        <RigidBody ref={body} type="kinematicPosition" colliders="hull">
            <Spaceship
                position={[-12, -6.75, 0]}
                glow={night ? 6 : 0}
                onClick={toggle}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            />

        </RigidBody>
    )
}



export default function Demo({ crates, night, active, onKick }) {
    return (
        <Physics paused={!active}>

            <RigidBody type="fixed">
                <mesh position={[-12, -9, 0]}>
                    <boxGeometry args={[24, 0.5, 14]} />
                    <meshStandardMaterial color="#8a8f98" />
                </mesh>
            </RigidBody>
            <ParkedShip night={night} />


            <Lamp position={[-22, -8.75, -5]} night={night} />
            <Lamp position={[-2, -8.75, -5]} night={night} />
            <Lamp position={[-22, -8.75, 5]} night={night} />
            <Lamp position={[-2, -8.75, 5]} night={night} />


            {crates.map((crate) => (
                <Crate key={crate.id} id={crate.id} shape={crate.shape} position={[crate.x, 6, crate.z]} onKick={onKick} />
            ))}

        </Physics>
    )
}
