import { Text } from '@react-three/drei'
import titleFont from '@fontsource/unbounded/files/unbounded-latin-800-normal.woff'
import { colors } from '../utils/theme'

const WIDTH = 24
const HEIGHT = 11
const LEFT = -WIDTH / 2 + 1.2
const TOP = HEIGHT / 2 - 1

export default function Page({ number, title, points, source, children }) {
    return (
        <group position={[0, HEIGHT / 2, 0]}>
            <mesh position={[0, 0, -0.05]}>
                <planeGeometry args={[WIDTH, HEIGHT]} />
                <meshBasicMaterial color="white" transparent opacity={0.82} />
            </mesh>
            <mesh position={[0, HEIGHT / 2 - 0.1, -0.04]}>
                <planeGeometry args={[WIDTH, 0.2]} />
                <meshBasicMaterial color={colors.accent} />
            </mesh>

            <Text font={titleFont} position={[LEFT, TOP, 0]} fontSize={0.6} anchorX="left" anchorY="top" color={colors.accent}>
                {String(number).padStart(2, '0')}
            </Text>
            <Text font={titleFont} position={[LEFT, TOP - 0.9, 0]} fontSize={1.15} maxWidth={10.5} anchorX="left" anchorY="top" color={colors.ink}>
                {title}
            </Text>
            <mesh position={[LEFT + 1, TOP - 2.6, 0]}>
                <planeGeometry args={[2, 0.1]} />
                <meshBasicMaterial color={colors.accent} />
            </mesh>
            <Text position={[LEFT, TOP - 3.1, 0]} fontSize={0.52} lineHeight={1.5} maxWidth={10} anchorX="left" anchorY="top" color={colors.ink}>
                {points.map((point) => `• ${point}`).join('\n')}
            </Text>
            <Text position={[LEFT, -HEIGHT / 2 + 0.8, 0]} fontSize={0.34} anchorX="left" anchorY="bottom" color={colors.muted}>
                {`Source: ${source}`}
            </Text>

            <group position={[WIDTH / 4, 0, 0.3]}>{children}</group>
        </group>
    )
}
