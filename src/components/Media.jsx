import { Suspense } from 'react'
import { Text, useTexture, useVideoTexture } from '@react-three/drei'
import { colors } from '../utils/theme'

function fit(mediaWidth, mediaHeight, maxWidth, maxHeight) {
    const scale = Math.min(maxWidth / mediaWidth, maxHeight / mediaHeight)
    return [mediaWidth * scale, mediaHeight * scale]
}

function Video({ src, maxWidth, maxHeight }) {
    const texture = useVideoTexture(src, { muted: true, loop: true, start: true })
    const { videoWidth, videoHeight } = texture.image

    return (
        <mesh>
            <planeGeometry args={fit(videoWidth, videoHeight, maxWidth, maxHeight)} />
            <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
    )
}

function Image({ src, maxWidth, maxHeight }) {
    const texture = useTexture(src)
    const { width, height } = texture.image

    return (
        <mesh>
            <planeGeometry args={fit(width, height, maxWidth, maxHeight)} />
            <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
    )
}

function Placeholder({ maxWidth, maxHeight, label }) {
    return (
        <group>
            <mesh>
                <planeGeometry args={[maxWidth, maxHeight]} />
                <meshBasicMaterial color="#e6ecf4" />
            </mesh>
            <Text fontSize={0.4} color={colors.muted}>
                {label}
            </Text>
        </group>
    )
}

export default function Media({ src, maxWidth, maxHeight }) {
    if (!src) return <Placeholder maxWidth={maxWidth} maxHeight={maxHeight} label="Recording coming soon" />

    const isVideo = src.endsWith('.mp4')

    return (
        <Suspense fallback={<Placeholder maxWidth={maxWidth} maxHeight={maxHeight} label="Loading…" />}>
            {isVideo ? (
                <Video src={src} maxWidth={maxWidth} maxHeight={maxHeight} />
            ) : (
                <Image src={src} maxWidth={maxWidth} maxHeight={maxHeight} />
            )}
        </Suspense>
    )
}
