import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import { Leva } from 'leva'
import { configureTextBuilder } from 'troika-three-text'
import bodyFont from '@fontsource/inter/files/inter-latin-400-normal.woff'

import Sky from './components/Sky'
import BlueprintGrid from './components/BlueprintGrid'
import FlightPath from './components/FlightPath'
import Plane from './components/Plane'
import CameraRig from './components/CameraRig'
import Chapter from './components/Chapter'
import Finale from './components/Finale'
import { TitleWatcher, DemoWatcher } from './components/ScrollWatchers'
import Progress from './ui/Progress'

import WhatIsR3F from './chapters/WhatIsR3F'
import CoreFeatures from './chapters/CoreFeatures'
import Comparison from './chapters/Comparison'
import ResearchApproach from './chapters/ResearchApproach'
import Hangar from './chapters/Hangar'
import Conclusion from './chapters/Conclusion'
import { colors } from './utils/theme'

configureTextBuilder({ defaultFontURL: bodyFont })

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

                    <Chapter index={0} />
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
                    <Chapter index={5} titleX={-12} titleY={-1} titleColor={night ? 'white' : '#111'} fade={false}>
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

