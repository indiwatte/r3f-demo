import { GradientTexture } from '@react-three/drei'
import { BackSide } from 'three'
import { colors } from '../utils/theme'

export default function Sky({ night }) {
    const gradient = night
        ? ['#02040a', '#070b18', colors.night, '#1b2547']
        : [colors.skyTop, '#cfe4ff', colors.horizon, colors.horizon]

    return (
        <mesh position={[0, 0, -90]}>
            <sphereGeometry args={[400, 32, 16]} />
            <meshBasicMaterial side={BackSide} fog={false}>
                <GradientTexture stops={[0, 0.38, 0.5, 1]} colors={gradient} />
            </meshBasicMaterial>
        </mesh>
    )
}
