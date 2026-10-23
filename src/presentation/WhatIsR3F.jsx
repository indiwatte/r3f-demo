import { useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll, Text } from '@react-three/drei'
import monoFont from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff'

const codeLines = [
    '<Canvas>',
    '  <mesh>',
    '    <boxGeometry />',
    '    <meshStandardMaterial color="orange" />',
    '  </mesh>',
    '</Canvas>',
]

export default function WhatIsR3F() {
    const scroll = useScroll()
    const [visibleLines, setVisibleLines] = useState(0)

    useFrame(() => {
        const progress = scroll.range(0.1, 0.07)
        const lines = Math.round(progress * codeLines.length)
        if (lines !== visibleLines) setVisibleLines(lines)
    })

    const hasGeometry = visibleLines >= 3
    const hasMaterial = visibleLines >= 4

    return (
        <group>
            <Text font={monoFont} position={[-12, 1.5, 0]} fontSize={0.45} anchorX="left" anchorY="top" color="#222">
                {codeLines.slice(0, visibleLines).join('\n')}
            </Text>
            {hasGeometry && (
                <mesh position={[2, 0, 0]}>
                    <boxGeometry args={[2, 2, 2]} />
                    {hasMaterial ? <meshStandardMaterial color="orange" /> : <meshBasicMaterial color="gray" wireframe />}
                </mesh>
            )}
        </group>
    )
}
