import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, useScroll, Line, Text } from '@react-three/drei'

import { useRef } from 'react'
import { Model } from '../Model'
import { CatmullRomCurve3, Vector3 } from 'three'
import { easing } from 'maath'

const curve = new CatmullRomCurve3([
    new Vector3(0, 0, 0),
    new Vector3(-10, 2, -30),
    new Vector3(10, -2, -60),
    new Vector3(-8, 3, -90),
    new Vector3(8, 0, -120),
    new Vector3(-5, 2, -150),
    new Vector3(0, 0, -180),
])

const chapters = [
    { title: 'React Three Fiber', color: 'orange' },
    { title: 'What is R3F?', color: 'tomato' },
    { title: 'Core features', color: 'gold' },
    { title: 'Comparison', color: 'mediumseagreen' },
    { title: 'Research approach', color: 'deepskyblue' },
    { title: 'The demo', color: 'slateblue' },
    { title: 'Conclusion', color: 'hotpink' },
]

function Chapter({ index, title, color }) {
    const t = index / (chapters.length - 1)
    const point = curve.getPointAt(t)
    const tangent = curve.getTangentAt(t)

    const side = index % 2 === 0 ? 1 : -1
    const sideways = tangent.clone().cross(new Vector3(0, 1, 0)).multiplyScalar(8 * side)
    const position = point.clone().add(sideways).add(new Vector3(0, 2, 0))

    return (
        <group position={position}>
            <Text position={[0, 3, 0]} fontSize={1.5} color="black">
                {title}
            </Text>
            <mesh>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color={color} />
            </mesh>
        </group>
    )
}


function FlightPath() {
    return <Line points={curve.getPoints(200)} color="hotpink" lineWidth={2} />
}


function Plane() {
    const ref = useRef()
    const scroll = useScroll()

    useFrame(() => {
        const point = curve.getPointAt(scroll.offset)
        const tangent = curve.getTangentAt(scroll.offset)
        ref.current.position.copy(point)
        ref.current.lookAt(point.clone().add(tangent))

    })

    return (
        <group ref={ref}>
            <Model rotation={[0, Math.PI / 2, 0]} />
        </group>
    )
}

function CameraRig() {
    const scroll = useScroll()
    const lookTarget = useRef(new Vector3())

    useFrame((state, delta) => {
        const point = curve.getPointAt(scroll.offset)
        const tangent = curve.getTangentAt(scroll.offset)

        const behind = tangent.clone().multiplyScalar(-12)
        const above = new Vector3(0, 4, 0)
        const cameraGoal = point.clone().add(behind).add(above)
        easing.damp3(state.camera.position, cameraGoal, 0.4, delta)

        const ahead = tangent.clone().multiplyScalar(5)
        easing.damp3(lookTarget.current, point.clone().add(ahead), 0.4, delta)
        state.camera.lookAt(lookTarget.current)
    })

    return null
}


export default function Presentation() {
    return (
        <Canvas camera={{ position: [8, 4, 10] }}>
            <ambientLight />
            <directionalLight position={[3, 3, 3]} />
            <FlightPath />
            {chapters.map((chapter, index) => (
                <Chapter key={index} index={index} title={chapter.title} color={chapter.color} />
            ))}


            <ScrollControls pages={7} damping={0.2}>
                <Plane />
                <CameraRig />
            </ScrollControls>
        </Canvas>
    )
}
