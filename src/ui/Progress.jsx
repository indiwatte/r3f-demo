import { CHAPTER_COUNT } from '../utils/path'
import { titles } from '../data/chapters'

export default function Progress({ current }) {
    const reached = Math.min(current, CHAPTER_COUNT - 1)

    return (
        <nav className="progress">
            <div className="progress-track">
                <div className="progress-fill" style={{ width: `${(reached / (CHAPTER_COUNT - 1)) * 100}%` }} />
            </div>
            {titles.slice(0, CHAPTER_COUNT).map((item, index) => (
                <div
                    key={item.title}
                    title={item.title}
                    className={index <= reached ? 'progress-dot reached' : 'progress-dot'}
                />
            ))}
        </nav>
    )
}
