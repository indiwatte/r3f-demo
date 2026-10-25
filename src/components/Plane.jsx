import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { Vector3 } from 'three'
import { easing } from 'maath'
import { Spaceship } from './Spaceship'
import { curve, flight } from '../utils/path'

const point = new Vector3()
const tangent = new Vector3()
const ahead = new Vector3()
const lookAhead = new Vector3()

export default function Plane() {
    const ref = useRef()
    const bank = useRef()
    const scroll = useScroll()

    useFrame((state, delta) => {
        const progress = flight(scroll.offset)
        curve.getPointAt(progress, point)
        curve.getTangentAt(progress, tangent)

        ref.current.position.copy(point)
        ref.current.lookAt(lookAhead.copy(point).add(tangent))

        curve.getTangentAt(Math.min(progress + 0.01, 1), ahead)
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
