const MAX_LINES = 8

export default function DataPanel({ crates, highlight }) {
    const visible = crates.slice(-MAX_LINES)
    const hidden = crates.length - visible.length

    return (
        <aside className="data-panel">
            <p className="data-panel-title">React state</p>
            <pre>
                <span className="code-muted">const</span> crates = [{'\n'}
                {hidden > 0 && <span className="code-muted">{`  // …${hidden} more\n`}</span>}
                {visible.map((crate) => (
                    <span key={crate.id} className={crate.id === highlight ? 'code-line highlight' : 'code-line'}>
                        {`  { id: ${crate.id}, shape: "${crate.shape}" },\n`}
                    </span>
                ))}
                ]
            </pre>
            <p className="data-panel-note">{crates.length} items = {crates.length} objects in 3D</p>
        </aside>
    )
}
