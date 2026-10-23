import { Float, Text } from '@react-three/drei'
import monoFont from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff'

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

const alternatives = [
    { name: 'Babylon.js', note: 'full game engine', color: '#bb464b' },
    { name: 'A-Frame', note: 'HTML tags, VR', color: '#ef2d5e' },
    { name: 'Threlte', note: 'R3F for Svelte', color: '#ff3e00' },
    { name: 'TresJS', note: 'R3F for Vue', color: '#42b883' },
    { name: 'Spline', note: 'no-code design tool', color: '#7c5cff' },
]

function CodePanel({ x, title, code, fontSize }) {
    const lineCount = code.split('\n').length

    return (
        <group position={[x, 0, 0]}>
            <Text position={[0, 1.2, 0]} fontSize={0.6} anchorX="left" anchorY="bottom" color="black">
                {`${title} · ${lineCount} lines`}
            </Text>
            <Text font={monoFont} fontSize={fontSize} anchorX="left" anchorY="top" color="#222">
                {code}
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
            <CodePanel x={-14} title="Three.js" code={vanillaCode} fontSize={0.25} />
            <CodePanel x={16} title="React Three Fiber" code={r3fCode} fontSize={0.32} />
            {alternatives.map((alt, index) => (
                <Island key={alt.name} x={index * 3.5} name={alt.name} note={alt.note} color={alt.color} />
            ))}
        </group>
    )
}
