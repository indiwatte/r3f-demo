import { useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll, Text } from '@react-three/drei'
import Media from './Media'
import { colors } from './theme'

const single = { spots: [[0, -0.6, 0]], size: [11, 7.2] }
const row = { spots: [[-3.7, 0.4, 0], [0, 0.4, 0], [3.7, 0.4, 0]], size: [3.4, 4.2] }
const grid = { spots: [[-2.85, 2, 0], [2.85, 2, 0], [0, -2.1, 0]], size: [5.2, 2.7] }


const steps = [
    {
        title: 'Explore',
        points: ['Looked at finished R3F projects first', 'Configurators, portfolios, galleries', 'Why R3F: 3D that lives inside a React site'],
        media: [
            { src: '/research/example1.png', caption: 'Product configurator: AF1 Studio', why: 'React UI and 3D shoe share one state' },
            { src: '/research/example2.png', caption: 'Portfolio: Unfor Dev', why: '3D hero inside a normal React website' },
            { src: '/research/example3.png', caption: 'Interactive gallery: pmndrs', why: 'drei helpers: scroll + images in a few lines' },
        ],
        layout: grid,

    },
    {
        title: 'Basics',
        points: ['R3F docs: Canvas, hooks, events', 'How R3F works together with Three.js', 'Articles: CreativeDevJobs, ICS MEDIA'],
        media: [],
        layout: single,
    },
    {
        title: 'Tutorials',
        points: ['Small demos by Wawa Sensei and Three.js Journey', 'Built along to learn the structure', 'Followed his Atmos rebuild series'],
        media: [
            { src: '/research/atmos1.png', caption: 'Wawa Sensei tutorial: the code' },
            { src: '/research/atmos2.png', caption: 'Wawa Sensei tutorial: the result' },
            { src: '/research/atmos3.png', caption: 'Awwwards case study: Atmos' },
        ],
        layout: grid,
    },
    {
        title: 'Case study',
        points: ['Atmos: Three.js + GSAP vs the R3F rebuild', "Read Wawa Sensei's real code on GitHub"],
        media: [],
        layout: single,
    },
    {
        title: 'Experiments',
        points: ['Tried drei, leva, rapier, postprocessing and gltfjsx', 'Logged what was easy and confusing', 'Found a bug: R3F 9.8 broke drei scrolling'],
        media: [
            { src: '/research/leva.mp4', caption: 'leva' },
            { src: '/research/rapier.mp4', caption: 'rapier' },
            { src: '/research/bloom.mp4', caption: 'postprocessing' },
        ],
        layout: row,
    },
    {
        title: 'Demo',
        points: ['Friday: a first rough skeleton', 'Then: stops, pages, sky and the demo', 'This presentation is the result'],
        media: [{ src: '/research/skeleton.mp4' }],
        layout: single,
    },
]

export default function ResearchApproach() {
    const scroll = useScroll()
    const [step, setStep] = useState(0)

    useFrame(() => {
        const current = Math.min(Math.floor(scroll.range(0.59, 0.15) * steps.length), steps.length - 1)
        if (current !== step) setStep(current)
    })

    const { title, points, media, layout } = steps[step]
    const [maxWidth, maxHeight] = layout.size

    return (
        <group>
            <Text position={[-5.4, 4.6, 0]} fontSize={0.45} anchorX="left" anchorY="top" color={colors.accent}>
                {`${step + 1} / ${steps.length}   ${title}`}
            </Text>

            <Text position={[-16.8, 1.4, -0.3]} fontSize={0.46} lineHeight={1.45} maxWidth={10} anchorX="left" anchorY="top" color={colors.ink}>
                {points.map((point) => `• ${point}`).join('\n')}
            </Text>

            {media.length === 0 && (
                <group position={layout.spots[0]}>
                    <Media src={null} maxWidth={maxWidth} maxHeight={maxHeight} />
                </group>
            )}

            {media.map((item, index) => (
                <group key={item.src} position={layout.spots[index]}>
                    <Media src={item.src} maxWidth={maxWidth} maxHeight={maxHeight} />
                    {item.caption && (
                        <Text position={[0, -maxHeight / 2 - 0.15, 0]} fontSize={0.3} anchorY="top" color={colors.ink}>
                            {item.caption}
                        </Text>
                    )}
                    {item.why && (
                        <Text position={[0, -maxHeight / 2 - 0.58, 0]} fontSize={0.26} anchorY="top" color={colors.muted}>
                            {item.why}
                        </Text>
                    )}

                </group>
            ))}
        </group>
    )
}
