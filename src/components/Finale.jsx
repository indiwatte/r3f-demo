import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll, Text, Billboard } from '@react-three/drei'
import titleFont from '@fontsource/unbounded/files/unbounded-latin-800-normal.woff'
import { FINALE } from '../utils/path'
import { titles } from '../data/chapters'

export default function Finale() {
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
