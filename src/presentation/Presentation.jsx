import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, useScroll, Text, Billboard } from '@react-three/drei'


import { configureTextBuilder } from 'troika-three-text'
import bodyFont from '@fontsource/inter/files/inter-latin-400-normal.woff'
import titleFont from '@fontsource/unbounded/files/unbounded-latin-800-normal.woff'

import Sky from '../components/Sky'
import BlueprintGrid from '../components/BlueprintGrid'
import FlightPath from '../components/FlightPath'
import Plane from '../components/Plane'
import CameraRig from '../components/CameraRig'
import WhatIsR3F from './WhatIsR3F'
import CoreFeatures from './CoreFeatures'
import Comparison from './Comparison'
import Conclusion from './Conclusion'
import Hangar from './Hangar'
import Page from './Page'

import ResearchApproach from './ResearchApproach'
import { useRef, useState } from 'react'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import { Leva } from 'leva'


import { colors } from './theme'

import { CHAPTER_COUNT, FINALE, clamp01, stopDistance, chapterPlacement } from '../utils/path'
import { titles } from '../data/chapters'




configureTextBuilder({ defaultFontURL: bodyFont })




function ChapterTitle({ index, x, y, color }) {
    const ref = useRef()
    const scroll = useScroll()
    const { title, subtitle } = titles[index]

    useFrame(() => {
        const appear = 1 - clamp01(Math.abs(stopDistance(scroll.offset, index)) / 0.045)

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

function Chapter({ index, titleX, titleY = 9, titleColor = '#111', fade = true, children }) {
    const ref = useRef()
    const scroll = useScroll()
    const hinge = useRef()

    const { position, facing } = chapterPlacement(index)

    const side = index % 2 === 0 ? 1 : -1
    const hasPage = Boolean(titles[index].points)


    useFrame(() => {

        const distance = stopDistance(scroll.offset, index)
        const fadeIn = clamp01((distance + 0.085) / 0.05)
        const fadeOut = clamp01((0.015 - distance) / 0.015)



        const opacity = scroll.offset > 0.975 ? 1 : Math.min(fadeIn, fadeOut)


        ref.current.visible = fade ? opacity > 0 : opacity >= 1

        if (hasPage) {
            const open = distance < 0 ? clamp01(1 + distance / 0.05) : 1
            hinge.current.rotation.x = -(1 - open) * Math.PI * 0.45
        }

        if (!fade) return

        ref.current.traverse((object) => {
            if (!object.material) return
            object.userData.baseOpacity ??= object.material.opacity
            object.material.opacity = object.userData.baseOpacity * opacity
            object.material.transparent = object.material.opacity < 1
        })
    })
    return (
        <group ref={ref} position={position} rotation={[0, facing, 0]}>
            {hasPage ? (
                <group ref={hinge} position={[-7 * side, 1, 0]}>
                    <Page number={index} {...titles[index]}>
                        {children}
                    </Page>
                </group>
            ) : (
                <>
                    <ChapterTitle index={index} x={titleX ?? -7 * side} y={titleY} color={titleColor} />
                    {children}
                </>
            )}


        </group>
    )
}

function Finale() {
    const ref = useRef()
    const scroll = useScroll()
    const { title, subtitle } = titles[FINALE]

    useFrame(() => {
        ref.current.visible = scroll.offset > 0.975

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



function Progress({ current }) {
    const reached = Math.min(current, CHAPTER_COUNT - 1)

    return (
        <nav className="progress">
            <div className="progress-track">
                <div className="progress-fill" style={{ width: `${(reached / (CHAPTER_COUNT - 1)) * 100}%` }} />
            </div>
            {titles.slice(0, CHAPTER_COUNT).map((item, index) => (
                <div
                    key={item.title}
                    title={item.title}
                    className={index <= reached ? 'progress-dot reached' : 'progress-dot'}
                />
            ))}
        </nav>
    )
}







function TitleWatcher({ current, onChange }) {
    const scroll = useScroll()

    useFrame(() => {
        const title = scroll.offset > 0.975 ? FINALE : Math.round(scroll.offset * (CHAPTER_COUNT - 1))

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
                <Sky night={night} />
                <fog attach="fog" args={[night ? colors.night : colors.horizon, 40, 160]} />
                <BlueprintGrid night={night} />

                <hemisphereLight args={['#dceeff', '#ffe8cc', night ? 0.15 : 1.4]} />
                <directionalLight position={[10, 20, 5]} color="#fff1dc" intensity={night ? 0.1 : 1.5} />

                <FlightPath />

                <ScrollControls pages={9} damping={0.2}>
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
                        <ResearchApproach />
                    </Chapter>
                    <Chapter index={5} titleX={-12} titleY={-1} titleColor={night ? 'white' : '#111' } fade={false}>
                        <Hangar crates={crates} night={night} active={demoActive} />
                    </Chapter>
                    <Chapter index={6}>
                        <Conclusion />
                    </Chapter>
                </ScrollControls>

                <EffectComposer>
                    {night && <Bloom luminanceThreshold={1} intensity={1.5} mipmapBlur />}
                    <Noise opacity={0.06} />
                    <Vignette offset={0.4} darkness={0.25} />

                </EffectComposer>

            </Canvas>

            <Progress current={currentTitle} />

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


