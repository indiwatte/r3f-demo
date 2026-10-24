import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, useScroll, Line, Text } from '@react-three/drei'


import { Model } from '../Model'
import { CatmullRomCurve3, Vector3 } from 'three'
import { easing } from 'maath'
import WhatIsR3F from './WhatIsR3F'
import CoreFeatures from './CoreFeatures'
import Comparison from './Comparison'
import Hangar from './Hangar'
import { useRef, useState } from 'react'
import { EffectComposer, Bloom } from '@react-three/postprocessing'



const curve = new CatmullRomCurve3([
    new Vector3(0, 0, 0),
    new Vector3(-10, 2, -30),
    new Vector3(10, -2, -60),
    new Vector3(-8, 3, -90),
    new Vector3(8, 0, -120),
    new Vector3(-5, 2, -150),
    new Vector3(0, 0, -180),
])

const CHAPTER_COUNT = 7

function chapterPlacement(index) {
    const t = index / (CHAPTER_COUNT - 1)
    const point = curve.getPointAt(t)
    const tangent = curve.getTangentAt(t)

    const side = index % 2 === 0 ? 1 : -1
    const ahead = tangent.clone().multiplyScalar(15)
    const sideways = tangent.clone().cross(new Vector3(0, 1, 0)).multiplyScalar(7 * side)
    const position = point.clone().add(ahead).add(sideways).add(new Vector3(0, 2, 0))

    const facing = Math.atan2(-tangent.x, -tangent.z)

    return { t, position, facing }
}

function toWorld(index, local) {
    const { position, facing } = chapterPlacement(index)
    return new Vector3(...local).applyAxisAngle(new Vector3(0, 1, 0), facing).add(position)
}

const demoCamera = toWorld(5, [-12, 3, 16])
const demoLookAt = toWorld(5, [-12, -7, 0])


function Chapter({ index, title, children }) {
    const ref = useRef()
    const scroll = useScroll()
    const { t, position, facing } = chapterPlacement(index)

    useFrame(() => {
        ref.current.visible = Math.abs(scroll.offset - t) < 0.12
    })
    return (
        <group ref={ref} position={position} rotation={[0, facing, 0]}>
            <Text position={[0, 3, 0]} fontSize={1.5} maxWidth={10} textAlign="center" anchorY="bottom" color="black">
                {title}
            </Text>
            {children}
        </group>
    )
}


function Placeholder({ color }) {
    return (
        <mesh>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color={color} />
        </mesh>
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

        const demoWeight = scroll.curve(0.75, 0.16)

        const behind = tangent.clone().multiplyScalar(-12)
        const above = new Vector3(0, 4, 0)
        const cameraGoal = point.clone().add(behind).add(above).lerp(demoCamera, demoWeight)
        easing.damp3(state.camera.position, cameraGoal, 0.4, delta)

        const ahead = tangent.clone().multiplyScalar(5)
        const lookGoal = point.clone().add(ahead).lerp(demoLookAt, demoWeight)
        easing.damp3(lookTarget.current, lookGoal, 0.4, delta)

        state.camera.lookAt(lookTarget.current)
    })

    return null
}

function DemoWatcher({ active, onChange }) {
    const scroll = useScroll()

    useFrame(() => {
        const isActive = scroll.visible(0.78, 0.1)
        if (isActive !== active) onChange(isActive)
    })

    return null
}


export default function Presentation() {
    const [crates, setCrates] = useState([])
    const [night, setNight] = useState(false)
    const [demoActive, setDemoActive] = useState(false)

    function changeDemoActive(isActive) {
        setDemoActive(isActive)
        if (!isActive) setNight(false)
    }


    function dropCrate() {
        const crate = { id: Date.now(), x: -17 + Math.random() * 10, z: -3 + Math.random() * 6 }
        setCrates([...crates, crate])
    }

    function reset() {
        setCrates([])
    }

    return (
        <>
            <Canvas camera={{ position: [8, 4, 10] }}>
                <color attach="background" args={[night ? '#0b1020' : 'white']} />
                <ambientLight intensity={night ? 0.15 : 1} />
                <directionalLight position={[3, 3, 3]} intensity={night ? 0.1 : 1} />
                <FlightPath />

                <ScrollControls pages={7} damping={0.2}>
                    <Plane />
                    <CameraRig />
                    <DemoWatcher active={demoActive} onChange={changeDemoActive} />

                    <Chapter index={0} title="React Three Fiber">
                        <Placeholder color="orange" />
                    </Chapter>
                    <Chapter index={1} title="What is R3F?">
                        <WhatIsR3F />
                    </Chapter>
                    <Chapter index={2} title="Core features">
                        <CoreFeatures />
                    </Chapter>
                    <Chapter index={3} title="Comparison">
                        <Comparison />
                    </Chapter>
                    <Chapter index={4} title="Research approach">
                        <Placeholder color="deepskyblue" />
                    </Chapter>
                    <Chapter index={5} title="The demo">
                        <Hangar crates={crates} night={night} active={demoActive} />


                    </Chapter>
                    <Chapter index={6} title="Conclusion">
                        <Placeholder color="hotpink" />
                    </Chapter>
                </ScrollControls>

                {night && (
                    <EffectComposer>
                        <Bloom luminanceThreshold={1} intensity={1.5} mipmapBlur />
                    </EffectComposer>
                )}

            </Canvas>

            {demoActive && (
                <div className="demo-ui">
                    <button onClick={dropCrate}>Drop crate</button>
                    <button onClick={reset}>Reset</button>
                    <button onClick={() => setNight(!night)}>{night ? 'Day mode' : 'Night mode'}</button>
                    <span>{crates.length} crates</span>
                </div>
            )}
        </>
    )
}


