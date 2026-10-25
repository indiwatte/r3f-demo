import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { easing } from 'maath'
import { Spaceship } from './Spaceship'
import { curve, flight } from '../utils/path'

export default function Plane() {
    const ref = useRef()
    const bank = useRef()
    const scroll = useScroll()

    useFrame((state, delta) => {
        const progress = flight(scroll.offset)
        const point = curve.getPointAt(progress)
        const tangent = curve.getTangentAt(progress)

        ref.current.position.copy(point)
        ref.current.lookAt(point.clone().add(tangent))

        const ahead = curve.getTangentAt(Math.min(progress + 0.01, 1))
        const turn = tangent.x * ahead.z - tangent.z * ahead.x
        const targetBank = Math.max(-0.6, Math.min(0.6, turn * 3))
        easing.damp(bank.current.rotation, 'z', targetBank, 0.3, delta)
    })

    return (
        <group ref={ref}>
            <group ref={bank}>
                <Spaceship scale={0.6} />
            </group>
        </group>
    )
}
