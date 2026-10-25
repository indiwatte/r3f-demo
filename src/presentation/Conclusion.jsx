import { useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll, Text } from '@react-three/drei'
import { colors } from './theme'

const steps = [
    {
        label: 'When to use R3F',
        points: [
            'Your website is already built with React',
            '3D is part of a website: portfolio, product, story',
            'The scene should follow your data',
            'You want ready-made helpers: drei, rapier, effects',
        ],
        tiles: [
            { title: 'This presentation', note: '3D inside a React page', color: colors.accent },
            { title: 'The demo', note: 'the scene follows a list of crates', color: colors.accent },
            { title: 'My experiments', note: 'physics and glow in a few lines', color: colors.accent },
        ],
    },
    {
        label: 'When not',
        points: [
            "You don't know React yet",
            'You build a full game',
            'You want a quick VR scene',
            'You design without code',
        ],
        tiles: [
            { title: 'Learn React first', note: 'or use plain Three.js', color: colors.muted },
            { title: 'Babylon.js', note: 'full engine, physics and editor built in', color: colors.blue },
            { title: 'A-Frame', note: 'HTML tags, quick VR scenes', color: colors.blue },
            { title: 'Spline', note: 'design 3D without code', color: colors.blue },
        ],
    },
    {
        label: 'Strengths & weaknesses',
        points: [
            'Everything is a component: camera, physics, glow, my model',
            'Each library is a few lines: drei, leva, rapier',
            'HTML and 3D share one state: my demo buttons',
            'A huge ecosystem: pmndrs',
        ],
        tiles: [
            { title: 'You need to know React', note: 'hooks, state and refs come first', color: colors.sun },
            { title: 'Snippets are not standalone', note: 'imports, lights and components missing', color: colors.sun },
            { title: 'gltfjsx: meaningless names', note: 'name your parts in Blender first', color: colors.sun },
            { title: 'Updates can break things', note: 'an R3F update stopped my scrolling', color: colors.sun },
        ],
    },
    {
        label: 'What I learned',
        points: [
            'R3F changes how much setup you write, not what you build',
            'State for what is in the scene, refs for what moves',
            'Lock the versions that work together',
        ],
        references: [
            'R3F docs: r3f.docs.pmnd.rs',
            'drei: github.com/pmndrs/drei',
            'Wawa Sensei: wawasensei.dev',
            'Atmos rebuild: github.com/wass08/r3f-wawatmos-final',
            'Awwwards: Atmos case study',
            'Three.js Journey: threejs-journey.com',
            'CreativeDevJobs: R3F vs Three.js',
            'ICS MEDIA: R3F introduction',
        ],
    },
]

function Tile({ y, title, note, color, height }) {
    return (
        <group position={[0, y, 0]}>
            <mesh position={[0, 0, -0.02]}>
                <planeGeometry args={[11, height]} />
                <meshBasicMaterial color="#f1f4f9" />
            </mesh>
            <mesh position={[-5.42, 0, -0.01]}>
                <planeGeometry args={[0.16, height]} />
                <meshBasicMaterial color={color} />
            </mesh>
            <Text position={[-4.9, 0.3, 0]} fontSize={0.48} anchorX="left" color={colors.ink}>
                {title}
            </Text>
            <Text position={[-4.9, -0.38, 0]} fontSize={0.34} anchorX="left" color={colors.muted}>
                {note}
            </Text>
        </group>
    )
}

export default function Conclusion() {
    const scroll = useScroll()
    const [step, setStep] = useState(0)

    useFrame(() => {
        const current = Math.min(Math.floor(scroll.range(0.9, 0.075) * steps.length), steps.length - 1)
        if (current !== step) setStep(current)
    })

    const { label, points, tiles, references } = steps[step]
    const tileHeight = tiles && tiles.length > 3 ? 1.75 : 2.2
    const tileGap = tiles && tiles.length > 3 ? 2.05 : 2.7

    return (
        <group>
            <Text position={[-5.4, 4.6, 0]} fontSize={0.45} anchorX="left" anchorY="top" color={colors.accent}>
                {`${step + 1} / ${steps.length}   ${label}`}
            </Text>

            <Text position={[-16.8, 1.4, -0.3]} fontSize={0.46} lineHeight={1.45} maxWidth={10} anchorX="left" anchorY="top" color={colors.ink}>
                {points.map((point) => `• ${point}`).join('\n')}
            </Text>

            {tiles &&
                tiles.map((tile, index) => (
                    <Tile key={tile.title} y={2.4 - index * tileGap} height={tileHeight} {...tile} />
                ))}

            {references && (
                <Text position={[-5.4, 3.6, 0]} fontSize={0.36} lineHeight={1.6} maxWidth={11} anchorX="left" anchorY="top" color={colors.ink}>
                    {references.map((ref) => `• ${ref}`).join('\n')}
                </Text>
            )}
        </group>
    )
}

