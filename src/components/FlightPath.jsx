import { Line } from '@react-three/drei'
import { curve } from '../utils/path'

export default function FlightPath() {
    return <Line points={curve.getPoints(300)} color="#8fa8c8" lineWidth={1.5} dashed dashSize={1} gapSize={0.6} />
}
