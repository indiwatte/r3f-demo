import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { CHAPTER_COUNT, FINALE } from '../utils/path'

export function TitleWatcher({ current, onChange }) {
    const scroll = useScroll()

    useFrame(() => {
        const title = scroll.offset > 0.975 ? FINALE : Math.round(scroll.offset * (CHAPTER_COUNT - 1))
        if (title !== current) onChange(title)
    })

    return null
}

export function DemoWatcher({ active, onChange }) {
    const scroll = useScroll()

    useFrame(() => {
        const isActive = scroll.visible(0.78, 0.1)
        if (isActive !== active) onChange(isActive)
    })

    return null
}
