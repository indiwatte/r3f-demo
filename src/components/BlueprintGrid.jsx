import { Grid } from '@react-three/drei'

export default function BlueprintGrid({ night }) {
    return (
        <Grid
            position={[0, -14, -90]}
            args={[10, 10]}
            infiniteGrid
            cellSize={2}
            cellThickness={0.6}
            cellColor={night ? '#1d2a4a' : '#c9d7e8'}
            sectionSize={10}
            sectionThickness={1.2}
            sectionColor={night ? '#34466e' : '#8fa8c8'}
            fadeDistance={140}
            fadeStrength={1.5}
            fadeFrom={1}
        />
    )
}
