import { CHAPTER_COUNT } from '../utils/path'
import { titles } from '../data/chapters'

export default function Progress({ current }) {
    const reached = Math.min(current, CHAPTER_COUNT - 1)

    return (
        <nav className="progress">
            <div className="progress-track">
                <div className="progress-fill" style={{ height: `${(reached / (CHAPTER_COUNT - 1)) * 100}%` }} />
            </div>
            {titles.slice(0, CHAPTER_COUNT).map((item, index) => {
                const state = index === reached ? 'current reached' : index < reached ? 'reached' : ''
                return (
                    <div key={item.title} className={`progress-step ${state}`}>
                        <span>{item.title}</span>
                        <div className="progress-dot" />
                    </div>
                )
            })}
        </nav>
    )
}
