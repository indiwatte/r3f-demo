import { CatmullRomCurve3, Vector3 } from 'three'

export const curve = new CatmullRomCurve3([
    new Vector3(0, 0, 0),
    new Vector3(-10, 2, -30),
    new Vector3(10, -2, -60),
    new Vector3(-8, 3, -90),
    new Vector3(8, 0, -120),
    new Vector3(-5, 2, -150),
    new Vector3(0, 0, -180),
])

export const CHAPTER_COUNT = 7
export const FINALE = 7

export const HOLD = [0.035, 0.035, 0.07, 0.06, 0.08, 0.05, 0.1]

export function clamp01(value) {
    return Math.min(Math.max(value, 0), 1)
}

export function flight(offset) {
    for (let i = 0; i < CHAPTER_COUNT; i++) {
        const t = i / (CHAPTER_COUNT - 1)
        if (Math.abs(offset - t) <= HOLD[i]) return t

        const next = (i + 1) / (CHAPTER_COUNT - 1)
        const leave = t + HOLD[i]
        const arrive = next - HOLD[i + 1]
        if (offset > leave && offset < arrive) {
            const s = (offset - leave) / (arrive - leave)
            return t + s * s * (3 - 2 * s) * (next - t)
        }
    }
    return 1
}

export function stopDistance(offset, index) {
    const distance = offset - index / (CHAPTER_COUNT - 1)
    if (distance > 0) return Math.max(distance - HOLD[index], 0)
    return Math.min(distance + HOLD[index], 0)
}

export function chapterPlacement(index) {
    const t = index / (CHAPTER_COUNT - 1)
    const point = curve.getPointAt(t)
    const tangent = curve.getTangentAt(t)

    const side = index % 2 === 0 ? 1 : -1
    const ahead = tangent.clone().multiplyScalar(15)
    const sideways = tangent.clone().cross(new Vector3(0, 1, 0)).multiplyScalar(7 * side)
    const position = point.clone().add(ahead).add(sideways).add(new Vector3(0, 2, 0))

    const facing = Math.atan2(-tangent.x, -tangent.z)

    return { t, position, facing }
}

export function toWorld(index, local) {
    const { position, facing } = chapterPlacement(index)
    return new Vector3(...local).applyAxisAngle(new Vector3(0, 1, 0), facing).add(position)
}
