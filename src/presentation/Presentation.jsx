import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, useScroll, Line, Text, Billboard } from '@react-three/drei'
import { configureTextBuilder } from 'troika-three-text'
import bodyFont from '@fontsource/inter/files/inter-latin-400-normal.woff'
import titleFont from '@fontsource/unbounded/files/unbounded-latin-800-normal.woff'
import { Model } from '../Model'
import { CatmullRomCurve3, Vector3 } from 'three'
import { easing } from 'maath'
import WhatIsR3F from './WhatIsR3F'
import CoreFeatures from './CoreFeatures'
import Comparison from './Comparison'
import Conclusion from './Conclusion'
import Hangar from './Hangar'
import { useRef, useState } from 'react'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import { Leva } from 'leva'

configureTextBuilder({ defaultFontURL: bodyFont })

const curve = new CatmullRomCurve3([
    new Vector3(0, 0, 0),
    new Vector3(-10, 2, -30),
    new Vector3(10, -2, -60),
    new Vector3(-8, 3, -90),
    new Vector3(8, 0, -120),
    new Vector3(-5, 2, -150),
    new Vector3(0, 0, -180),
])

const titles = [
    { title: 'React Three Fiber', subtitle: 'Scroll to begin' },
    { title: 'What is R3F?' },
    { title: 'Core features' },
    { title: 'Comparison' },
    { title: 'Research approach' },
    { title: 'The demo' },
    { title: 'Conclusion' },
    { title: 'Thank you!', subtitle: 'Questions?' },
]

const CHAPTER_COUNT = 7
const FINALE = 7

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
const finaleCamera = new Vector3(70, 110, 20)
const finaleLookAt = new Vector3(0, 0, -90)



function ChapterTitle({ index, x, y, color }) {
    const ref = useRef()
    const scroll = useScroll()
    const t = index / (CHAPTER_COUNT - 1)
    const { title, subtitle } = titles[index]

    useFrame(() => {
        const distance = Math.abs(scroll.offset - t)
        const appear = 1 - Math.min(Math.max((distance - 0.02) / 0.06, 0), 1)
        ref.current.position.y = y - (1 - appear) * 2
        ref.current.children.forEach((text) => (text.fillOpacity = appear))
    })

    return (
        <group ref={ref} position={[x, y, 0]}>
            <Text font={titleFont} fontSize={2} maxWidth={40} textAlign="center" anchorY="bottom" color={color}>
                {title}
            </Text>
            {subtitle && (
                <Text position={[0, -0.6, 0]} fontSize={0.6} letterSpacing={0.15} anchorY="top" color={color}>
                    {subtitle.toUpperCase()}
                </Text>
            )}
        </group>
    )
}

function Chapter({ index, titleX, titleY = 9, titleColor = '#111', children }) {
    const ref = useRef()
    const scroll = useScroll()
    const { t, position, facing } = chapterPlacement(index)
    const side = index % 2 === 0 ? 1 : -1

    useFrame(() => {
        ref.current.visible = Math.abs(scroll.offset - t) < 0.12 || scroll.offset > 0.97
    })
    return (
        <group ref={ref} position={position} rotation={[0, facing, 0]}>
            <ChapterTitle index={index} x={titleX ?? -7 * side} y={titleY} color={titleColor} />
            {children}
        </group>
    )
}

function Finale() {
    const ref = useRef()
    const scroll = useScroll()
    const { title, subtitle } = titles[FINALE]

    useFrame(() => {
        ref.current.visible = scroll.offset > 0.97
    })

    return (
        <Billboard ref={ref} position={[-20, 60, -110]}>
            <Text font={titleFont} fontSize={12} color="#111" anchorY="bottom">
                {title}
            </Text>
            <Text position={[0, -2, 0]} fontSize={4} letterSpacing={0.15} color="#e91e63" anchorY="top">
                {subtitle.toUpperCase()}
            </Text>
        </Billboard>
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
        const finaleWeight = scroll.range(0.94, 0.06)


        const behind = tangent.clone().multiplyScalar(-12)
        const above = new Vector3(0, 4, 0)
        const cameraGoal = point.clone().add(behind).add(above).lerp(demoCamera, demoWeight)
        cameraGoal.lerp(finaleCamera, finaleWeight)

        easing.damp3(state.camera.position, cameraGoal, 0.4, delta)

        const ahead = tangent.clone().multiplyScalar(5)
        const lookGoal = point.clone().add(ahead).lerp(demoLookAt, demoWeight)
        lookGoal.lerp(finaleLookAt, finaleWeight)
        easing.damp3(lookTarget.current, lookGoal, 0.4, delta)

        state.camera.lookAt(lookTarget.current)
    })

    return null
}

function TitleWatcher({ current, onChange }) {
    const scroll = useScroll()

    useFrame(() => {
        let title = null
        if (scroll.offset > 0.97) {
            title = FINALE
        } else {
            const nearest = Math.round(scroll.offset * (CHAPTER_COUNT - 1))
            if (Math.abs(scroll.offset - nearest / (CHAPTER_COUNT - 1)) < 0.07) title = nearest
        }
        if (title !== current) onChange(title)
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
    const [currentTitle, setCurrentTitle] = useState(0)

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
                    <TitleWatcher current={currentTitle} onChange={setCurrentTitle} />
                    <Finale />
                    <DemoWatcher active={demoActive} onChange={changeDemoActive} />

                    <Chapter index={0}>
                        <Placeholder color="orange" />
                    </Chapter>
                    <Chapter index={1}>
                        <WhatIsR3F />
                    </Chapter>
                    <Chapter index={2}>
                        <CoreFeatures />
                    </Chapter>
                    <Chapter index={3}>
                        <Comparison />
                    </Chapter>
                    <Chapter index={4}>
                        <Placeholder color="deepskyblue" />
                    </Chapter>
                    <Chapter index={5} titleX={-12} titleY={-1} titleColor={night ? 'white' : '#111'}>
                        <Hangar crates={crates} night={night} active={demoActive} />
                    </Chapter>
                    <Chapter index={6}>
                        <Conclusion />
                    </Chapter>
                </ScrollControls>

                <EffectComposer>
                    {night && <Bloom luminanceThreshold={1} intensity={1.5} mipmapBlur />}
                    <Noise opacity={0.06} />
                    <Vignette offset={0.3} darkness={0.5} />
                </EffectComposer>

            </Canvas>

            <Leva hidden={currentTitle !== 2} titleBar={{ position: { x: 0, y: 140 } }} />

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


