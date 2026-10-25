import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { Vector3 } from 'three'
import { easing } from 'maath'
import { curve, CHAPTER_COUNT, clamp01, flight, stopDistance, toWorld } from '../utils/path'
import { titles } from '../data/chapters'

const demoCamera = toWorld(5, [-12, 3, 16])
const demoLookAt = toWorld(5, [-12, -7, 0])
const finaleCamera = new Vector3(70, 110, 20)
const finaleLookAt = new Vector3(0, 0, -90)

const point = new Vector3()
const tangent = new Vector3()
const cameraGoal = new Vector3()
const lookGoal = new Vector3()


const pageViews = titles.slice(0, CHAPTER_COUNT).map((item, index) => {
    const pageX = index % 2 === 0 ? -7 : 7
    return {
        hasPage: Boolean(item.points),
        camera: toWorld(index, [pageX, 6.5, 15]),
        lookAt: toWorld(index, [pageX, 6.5, 0]),
    }
})

export default function CameraRig() {
    const scroll = useScroll()
    const lookTarget = useRef(new Vector3())

    useFrame((state, delta) => {
        const progress = flight(scroll.offset)
        curve.getPointAt(progress, point)
        curve.getTangentAt(progress, tangent)

        const nearest = Math.round(scroll.offset * (CHAPTER_COUNT - 1))
        const view = pageViews[nearest]
        const pageWeight = view.hasPage ? 1 - clamp01(Math.abs(stopDistance(scroll.offset, nearest)) / 0.04) : 0

        const demoWeight = scroll.curve(0.75, 0.16)
        const finaleWeight = scroll.range(0.975, 0.025)

        cameraGoal.copy(point).addScaledVector(tangent, -12)
        cameraGoal.y += 4
        cameraGoal.lerp(view.camera, pageWeight).lerp(demoCamera, demoWeight).lerp(finaleCamera, finaleWeight)
        easing.damp3(state.camera.position, cameraGoal, 0.4, delta)

        state.scene.fog.near = 40 + finaleWeight * 150
        state.scene.fog.far = 160 + finaleWeight * 400

        lookGoal.copy(point).addScaledVector(tangent, 5)
        lookGoal.lerp(view.lookAt, pageWeight).lerp(demoLookAt, demoWeight).lerp(finaleLookAt, finaleWeight)
        easing.damp3(lookTarget.current, lookGoal, 0.4, delta)



        state.camera.lookAt(lookTarget.current)
    })

    return null
}

