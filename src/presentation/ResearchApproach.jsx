import { useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll, Text, Line } from '@react-three/drei'
import { colors } from './theme'


const steps = [
    { title: 'Explore', note: 'what can R3F do?' },
    { title: 'Basics', note: 'docs + how it uses Three.js' },
    { title: 'Tutorials', note: 'small demos, built along' },
    { title: 'Case study', note: 'Atmos: Three.js vs R3F' },
    { title: 'Experiments', note: '5 libraries + research log' },
    { title: 'Demo', note: 'this presentation' },
]

const SPACING = 5.5
const START_X = -7.5 - ((steps.length - 1) * SPACING) / 2

function Station({ x, number, title, note, reached }) {
    const color = reached ? colors.accent : '#c9d3df'

    return (
        <group position={[x, 0, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.9, 0.9, 0.3, 32]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <Text position={[0, 0, 0.2]} fontSize={0.7} color="white">
                {number}
            </Text>
            <Text position={[0, -1.3, 0]} fontSize={0.65} color={colors.ink} anchorY="top">
                {title}
            </Text>
            <Text position={[0, -2.2, 0]} fontSize={0.42} maxWidth={5.2} textAlign="center" color={colors.muted} anchorY="top">
                {note}
            </Text>
        </group>
    )
}

export default function ResearchApproach() {
    const scroll = useScroll()
    const [reached, setReached] = useState(0)

    useFrame(() => {
        const count = Math.ceil(scroll.range(0.6, 0.07) * steps.length)
        if (count !== reached) setReached(count)
    })

    const linePoints = [
        [START_X, 0, -0.1],
        [START_X + (steps.length - 1) * SPACING, 0, -0.1],
    ]

    return (
        <group position={[0, 5, 0]}>
            <Line points={linePoints} color="#c4c4c4" lineWidth={2} />
            {steps.map((step, index) => (
                <Station
                    key={step.title}
                    x={START_X + index * SPACING}
                    number={index + 1}
                    title={step.title}
                    note={step.note}
                    reached={index < reached}
                />
            ))}
        </group>
    )
}
