import { Float, Text } from '@react-three/drei'


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

function Card({ x, y, card, color }) {
    return (
        <group position={[x, y, 0]}>
            <mesh position={[5.3, -2.2, -0.05]}>
                <planeGeometry args={[11, 5.4]} />
                <meshBasicMaterial color="#f2f2f2" />
            </mesh>
            <mesh position={[-0.1, -2.2, -0.04]}>
                <planeGeometry args={[0.2, 5.4]} />
                <meshBasicMaterial color={color} />
            </mesh>
            <Text position={[0.4, 0, 0]} fontSize={0.7} anchorX="left" anchorY="top" color="black">
                {card.title}
            </Text>
            <Text position={[0.4, -1, 0]} fontSize={0.45} anchorX="left" anchorY="top" color={color}>
                {card.tech}
            </Text>
            <Text position={[0.4, -1.8, 0]} fontSize={0.38} lineHeight={1.4} anchorX="left" anchorY="top" color="#333">
                {card.points.map((point) => `• ${point}`).join('\n')}
            </Text>
        </group>
    )
}


function Island({ x, name, note, color }) {
    return (
        <Float position={[x, 8, 0]} speed={2} floatIntensity={1.5}>
            <mesh>
                <cylinderGeometry args={[1.4, 0.8, 0.6, 6]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <Text position={[0, 1, 0]} fontSize={0.5} anchorY="bottom" color="black">
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
            <Card x={-15} y={1} card={atmosOriginal} color="#049ef4" />
            <Card x={17} y={1} card={atmosRebuild} color="#e91e63" />
            <Card x={17} y={-5.5} card={thisPresentation} color="#e91e63" />

            {alternatives.map((alt, index) => (
                <Island key={alt.name} x={index * 3.5} name={alt.name} note={alt.note} color={alt.color} />
            ))}
        </group>
    )
}
