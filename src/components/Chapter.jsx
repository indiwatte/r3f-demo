import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll, Text } from '@react-three/drei'
import titleFont from '@fontsource/unbounded/files/unbounded-latin-800-normal.woff'
import Page from './Page'
import { clamp01, stopDistance, chapterPlacement } from '../utils/path'
import { titles } from '../data/chapters'

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

export default function Chapter({ index, titleX, titleY = 9, titleColor = '#111', fade = true, children }) {
    const ref = useRef()
    const hinge = useRef()
    const scroll = useScroll()

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
