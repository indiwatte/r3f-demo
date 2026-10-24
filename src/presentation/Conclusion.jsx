import { Card } from './Comparison'
import { Float, Text } from '@react-three/drei'
import { colors } from './theme'



const useWhen = {
    title: 'Use R3F when…',
    tech: 'a good fit',
    points: [
        'your website is already built with React',
        '3D is part of a website (portfolio, story)',
        'the scene should follow your data',
        'you want helpers: drei, rapier, effects',
    ],
}

const notWhen = {
    title: 'Maybe not when…',
    tech: 'consider an alternative',
    points: [
        "you don't know React yet",
        'you build a full game: Babylon.js',
        'you want a quick VR scene: A-Frame',
        'you design without code: Spline',
    ],
}

const references = [
    { name: 'R3F documentation', url: 'r3f.docs.pmnd.rs' },
    { name: 'drei helpers', url: 'github.com/pmndrs/drei' },
    { name: 'pmndrs libraries', url: 'rapier, postprocessing, leva, gltfjsx' },
    { name: 'Wawa Sensei', url: 'wawasensei.dev' },
    { name: 'Three.js Journey', url: 'threejs-journey.com' },
    { name: 'Atmos case study', url: 'awwwards.com/case-study-atmos' },
    { name: 'R3F vs Three.js', url: 'creativedevjobs.com' },
    { name: 'R3F introduction', url: 'ics.media/en/entry/250410' },
]

function Reference({ x, y, name, url }) {
    return (
        <Float position={[x, y, 0]} speed={1.5} floatIntensity={1}>
            <mesh position={[0, 0, -0.05]}>
                <planeGeometry args={[9.4, 2.4]} />
                <meshBasicMaterial color="white" transparent opacity={0.75} />
            </mesh>
            <Text position={[0, 0.35, 0]} fontSize={0.6} color={colors.ink}>
                {name}
            </Text>
            <Text position={[0, -0.5, 0]} fontSize={0.38} color={colors.muted}>
                {url}
            </Text>

        </Float>
    )
}


export default function Conclusion() {
    return (
        <group>
            <Card x={-30.5} y={1} card={useWhen} color={colors.accent} />
            <Card x={2} y={1} card={notWhen} color={colors.muted} />

            {references.map((ref, index) => (
                <Reference
                    key={ref.name}
                    x={-22 + (index % 4) * 10}
                    y={index < 4 ? 7 : 4.2}
                    name={ref.name}
                    url={ref.url}
                />
            ))}

        </group>
    )
}
