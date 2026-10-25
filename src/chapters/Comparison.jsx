import { useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll, Float, Text } from '@react-three/drei'
import { colors } from '../utils/theme'
import monoFont from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff'


const builds = [
    { title: 'Atmos (original)', tech: 'Three.js + GSAP', color: colors.blue },
    { title: 'Atmos rebuild (Wawa Sensei)', tech: 'React Three Fiber', color: colors.accent },
    { title: 'This presentation', tech: 'React Three Fiber (by me)', color: colors.accent },
]

const alternatives = [
    { name: 'Babylon.js', note: 'full game engine', color: colors.blue },
    { name: 'A-Frame', note: 'HTML tags, VR', color: colors.accent },
    { name: 'Threlte', note: 'R3F for Svelte', color: colors.sun },
    { name: 'TresJS', note: 'R3F for Vue', color: colors.mint },
    { name: 'Spline', note: 'no-code design tool', color: colors.muted },
]

function Tile({ y, title, tech, color }) {
    return (
        <group position={[0, y, 0]}>
            <mesh position={[0, 0, -0.02]}>
                <planeGeometry args={[11, 2.2]} />
                <meshBasicMaterial color="#f1f4f9" />
            </mesh>
            <mesh position={[-5.42, 0, -0.01]}>
                <planeGeometry args={[0.16, 2.2]} />
                <meshBasicMaterial color={color} />
            </mesh>
            <Text position={[-4.9, 0.35, 0]} fontSize={0.5} anchorX="left" color={colors.ink}>
                {title}
            </Text>
            <Text position={[-4.9, -0.4, 0]} fontSize={0.38} anchorX="left" color={color}>
                {tech}
            </Text>
        </group>
    )
}

function Island({ x, y, name, note, color }) {
    return (
        <Float position={[x, y, 0]} speed={2} floatIntensity={0.6}>
            <mesh>
                <cylinderGeometry args={[1, 0.55, 0.45, 6]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <Text position={[0, 0.7, 0]} fontSize={0.42} anchorY="bottom" color={colors.ink}>
                {name}
            </Text>
            <Text position={[0, -0.55, 0]} fontSize={0.3} anchorY="top" color={colors.muted}>
                {note}
            </Text>
        </Float>
    )
}

const vanillaEffect = `const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
composer.addPass(new EffectPass(camera, new NoiseEffect()))
// in the render loop:
composer.render()
// on resize:
composer.setSize(innerWidth, innerHeight)`

const r3fEffect = `<EffectComposer>
  <Noise opacity={0.08} />
</EffectComposer>`

function CodeBlock({ y, label, code, color }) {
    return (
        <group position={[-5.4, y, 0]}>
            <Text fontSize={0.36} anchorX="left" anchorY="top" color={color}>
                {label}
            </Text>
            <Text font={monoFont} position={[0, -0.6, 0]} fontSize={0.27} lineHeight={1.4} anchorX="left" anchorY="top" color={colors.ink}>
                {code}
            </Text>
        </group>
    )
}

const labels = ['1 / 3   Atmos, built twice', '2 / 3   One effect, two ways', '3 / 3   Alternatives']

const stepPoints = [
    [
        'Atmos: an award-winning scroll website',
        'Original: plain Three.js + GSAP',
        'Rebuilt in R3F by Wawa Sensei',
        'Same result, different way of working',
    ],
    [
        'Same postprocessing library underneath',
        'Three.js: composer, passes, render call and resize by hand',
        'R3F: one component does the setup',
        'Less setup, same result',
    ],
    [
        'Babylon.js: full engine, physics and editor built in',
        'A-Frame: HTML tags, quick VR scenes',
        'Threlte / TresJS: the R3F idea for Svelte / Vue',
        'Spline: design 3D without code',
        'R3F: the best fit for React websites',
    ],
]


const islandSpots = [
    [-3.8, 1.6],
    [0, 1.6],
    [3.8, 1.6],
    [-1.9, -2.4],
    [1.9, -2.4],
]

export default function Comparison() {
    const scroll = useScroll()
    const [step, setStep] = useState(0)

    useFrame(() => {
        const current = Math.min(Math.floor(scroll.range(0.445, 0.11) * 3), 2)

        if (current !== step) setStep(current)
    })

    return (
        <group>
            <Text position={[-5.4, 4.6, 0]} fontSize={0.45} anchorX="left" anchorY="top" color={colors.accent}>
                {labels[step]}
            </Text>

            <Text position={[-16.8, 1.4, -0.3]} fontSize={0.46} lineHeight={1.45} maxWidth={10} anchorX="left" anchorY="top" color={colors.ink}>
                {stepPoints[step].map((point) => `• ${point}`).join('\n')}
            </Text>


            {step === 0 &&
                builds.map((build, index) => <Tile key={build.title} y={2.2 - index * 2.7} {...build} />)}

            {step === 1 && (
                <>
                    <CodeBlock y={3.6} label="Plain Three.js (my equivalent) · 7 lines" code={vanillaEffect} color={colors.blue} />
                    <CodeBlock y={-0.6} label="R3F (Wawa Sensei, real code) · 3 lines" code={r3fEffect} color={colors.accent} />
                </>
            )}

            {step === 2 &&
                alternatives.map((alt, index) => (
                    <Island key={alt.name} x={islandSpots[index][0]} y={islandSpots[index][1]} {...alt} />
                ))}
        </group>
    )
}

