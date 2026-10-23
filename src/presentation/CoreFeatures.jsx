import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { useControls } from 'leva'

function Spinner() {
    const ref = useRef()

    useFrame((state, delta) => {
        ref.current.rotation.x += delta
        ref.current.rotation.y += delta * 0.5
    })

    return (
        <mesh ref={ref}>
            <torusKnotGeometry args={[0.6, 0.2, 100, 16]} />
            <meshStandardMaterial color="gold" />
        </mesh>
    )
}

function Clickable() {
    const [hovered, setHovered] = useState(false)
    const [clicked, setClicked] = useState(false)

    return (
        <mesh
            scale={clicked ? 1.5 : 1}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={() => setClicked(!clicked)}
        >
            <sphereGeometry args={[0.8, 32, 32]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'tomato'} />
        </mesh>
    )
}

function Tweakable() {
    const { color, scale } = useControls('Chapter 2', {
        color: 'deepskyblue',
        scale: { value: 1, min: 0.5, max: 2 },
    })

    return (
        <mesh scale={scale}>
            <boxGeometry args={[1.2, 1.2, 1.2]} />
            <meshStandardMaterial color={color} />
        </mesh>
    )
}

function Clones() {
    return Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2
        return (
            <mesh key={i} position={[Math.cos(angle), Math.sin(angle), 0]}>
                <boxGeometry args={[0.25, 0.25, 0.25]} />
                <meshStandardMaterial color="mediumseagreen" />
            </mesh>
        )
    })
}

function Feature({ x, label, children }) {
    return (
        <group position={[x, 0, 0]}>
            {children}
            <Text position={[0, -1.8, 0]} fontSize={0.4} color="#222">
                {label}
            </Text>
        </group>
    )
}

export default function CoreFeatures() {
    return (
        <group>
            <Feature x={-6} label="useFrame">
                <Spinner />
            </Feature>
            <Feature x={-2} label="events">
                <Clickable />
            </Feature>
            <Feature x={2} label="leva">
                <Tweakable />
            </Feature>
            <Feature x={6} label=".map() × 20">
                <Clones />
            </Feature>
        </group>
    )
}
