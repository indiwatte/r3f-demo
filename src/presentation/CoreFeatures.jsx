import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll, Text } from '@react-three/drei'
import { useControls } from 'leva'
import monoFont from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff'
import { colors } from './theme'

function Spinner() {
    const ref = useRef()

    useFrame((state, delta) => {
        ref.current.rotation.x += delta
        ref.current.rotation.y += delta * 0.5
    })

    return (
        <mesh ref={ref}>
            <torusKnotGeometry args={[0.9, 0.3, 100, 16]} />
            <meshStandardMaterial color={colors.sun} />
        </mesh>
    )
}

function Clickable() {
    const [hovered, setHovered] = useState(false)
    const [clicked, setClicked] = useState(false)

    return (
        <mesh
            scale={clicked ? 1.4 : 1}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={() => setClicked(!clicked)}
        >
            <sphereGeometry args={[1.2, 32, 32]} />
            <meshStandardMaterial color={hovered ? colors.accent : colors.blue} />
        </mesh>
    )
}

function Tweakable() {
    const { color, scale } = useControls('Chapter 2', {
        color: colors.mint,
        scale: { value: 1, min: 0.5, max: 2 },
    })

    return (
        <mesh scale={scale} rotation={[0.4, 0.6, 0]}>
            <boxGeometry args={[1.8, 1.8, 1.8]} />
            <meshStandardMaterial color={color} />
        </mesh>
    )
}

function Clones() {
    return Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2
        return (
            <mesh key={i} position={[Math.cos(angle) * 1.6, Math.sin(angle) * 1.6, 0]}>
                <boxGeometry args={[0.35, 0.35, 0.35]} />
                <meshStandardMaterial color={colors.accent} />
            </mesh>
        )
    })
}

const steps = [
    {
        label: 'Components + props',
        code: `function Crate({ position }) {
  return (
    <mesh position={position}>
      <boxGeometry />
    </mesh>
  )
}

<Crate position={[0, 1, 0]} />`,
        visual: <Clones />,
    },
    {
        label: 'Hooks',
        code: `useFrame((state, delta) => {
  ref.current.rotation.y += delta
})

const { camera, size } = useThree()
const { nodes } = useGLTF('/spaceship.glb')`,
        visual: <Spinner />,
    },
    {
        label: 'Events',
        code: `<mesh
  onClick={() => setClicked(!clicked)}
  onPointerOver={() => setHovered(true)}
  onPointerOut={() => setHovered(false)}
>`,
        visual: <Clickable />,
    },
    {
        label: 'State',
        code: `const [color, setColor] = useState('orange')

<meshStandardMaterial color={color} />

// shared between components:
// a global store with zustand`,
        visual: <Tweakable />,
    },
]

export default function CoreFeatures() {
    const scroll = useScroll()
    const [step, setStep] = useState(0)

    useFrame(() => {
        const current = Math.min(Math.floor(scroll.range(0.27, 0.12) * steps.length), steps.length - 1)
        if (current !== step) setStep(current)
    })

    const { label, code, visual } = steps[step]

    return (
        <group>
            <Text position={[-5.4, 4.6, 0]} fontSize={0.45} anchorX="left" anchorY="top" color={colors.accent}>
                {`${step + 1} / ${steps.length}   ${label}`}
            </Text>
            <Text font={monoFont} position={[-5.4, 3.7, 0]} fontSize={0.3} lineHeight={1.35} anchorX="left" anchorY="top" color={colors.ink}>
                {code}
            </Text>
            <group position={[0, -2.8, 0]}>{visual}</group>
        </group>
    )
}

