import { Float, Text } from '@react-three/drei'
import { colors } from './theme'



const vanillaCode = `
import * as THREE from 'three'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer()
renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)

scene.add(new THREE.AmbientLight())
const light = new THREE.DirectionalLight()
light.position.set(3, 3, 3)
scene.add(light)

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshStandardMaterial({ color: 'orange' })
)
scene.add(cube)

function animate() {
  cube.rotation.y += 0.01
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
})
`.trim()

const r3fCode = `
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function Cube() {
  const ref = useRef()
  useFrame(() => (ref.current.rotation.y += 0.01))
  return (
    <mesh ref={ref}>
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas>
      <ambientLight />
      <directionalLight position={[3, 3, 3]} />
      <Cube />
    </Canvas>
  )
}
`.trim()

const atmosOriginal = {
    title: 'Atmos (original)',
    tech: 'Three.js + GSAP',
    points: ['scene, camera and loop set up by hand', 'GSAP for the animations', 'source: Awwwards case study'],
}

const atmosRebuild = {
    title: 'Atmos rebuild (Wawa Sensei)',
    tech: 'React Three Fiber',
    points: ['curved path', 'environment map', '3D text and UI', 'source: wawasensei.dev'],
}

const thisPresentation = {
    title: 'This presentation',
    tech: 'React Three Fiber (by me)',
    points: ['curve + useScroll()', 'camera follows with useFrame', 'drei <Text> for every title'],
}


const alternatives = [
    { name: 'Babylon.js', note: 'full game engine', color: '#bb464b' },
    { name: 'A-Frame', note: 'HTML tags, VR', color: '#ef2d5e' },
    { name: 'Threlte', note: 'R3F for Svelte', color: '#ff3e00' },
    { name: 'TresJS', note: 'R3F for Vue', color: '#42b883' },
    { name: 'Spline', note: 'no-code design tool', color: '#7c5cff' },
]

export function Card({ x, y, card, color }) {
    return (
        <group position={[x, y, 0]}>
            <mesh position={[7, -2.9, -0.05]}>
                <planeGeometry args={[14.5, 7]} />
                <meshBasicMaterial color="white" transparent opacity={0.75} />
            </mesh>
            <mesh position={[-0.15, -2.9, -0.04]}>
                <planeGeometry args={[0.25, 7]} />
                <meshBasicMaterial color={color} />
            </mesh>
            <Text position={[0.5, 0, 0]} fontSize={1} anchorX="left" anchorY="top" color={colors.ink}>
                {card.title}
            </Text>
            <Text position={[0.5, -1.25, 0]} fontSize={0.6} anchorX="left" anchorY="top" color={color}>
                {card.tech}
            </Text>
            <Text position={[0.5, -2.2, 0]} fontSize={0.6} lineHeight={1.45} anchorX="left" anchorY="top" color={colors.muted}>
                {card.points.map((point) => `• ${point}`).join('\n')}
            </Text>

        </group>
    )
}


function Island({ x, name, note, color }) {
    return (
        <Float position={[x, 5.5, 0]} speed={2} floatIntensity={1.5}>
            <mesh>
                <cylinderGeometry args={[1.4, 0.8, 0.6, 6]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <Text position={[0, 1, 0]} fontSize={0.6} anchorY="bottom" color="black">
                {name}
            </Text>
            <Text position={[0, -0.8, 0]} fontSize={0.3} anchorY="top" color="#555">
                {note}
            </Text>
        </Float>
    )
}

export default function Comparison() {
    return (
        <group>
            <Card x={-17.5} y={1} card={atmosOriginal} color={colors.blue} />
            <Card x={16} y={1} card={atmosRebuild} color={colors.accent} />
            <Card x={16} y={-6.6} card={thisPresentation} color={colors.accent} />


            {alternatives.map((alt, index) => (
                <Island key={alt.name} x={-1 + index * 4} name={alt.name} note={alt.note} color={alt.color} />
            ))}
        </group>
    )
}
