export const renderStudentJourneyResponse = (text: string): React.ReactNode => {
    if (!text) return null

    const paragraphs = text.split(/\n{1,2}/).filter((p) => p.trim() !== '')

    return (
        <div className="space-y-3">
            {paragraphs.map((para, i) => {
                const parts = para.split(/(\*\*[^*]+\*\*)/g)

                const rendered = parts.map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return (
                            <strong
                                key={j}
                                className="font-semibold text-slate-900"
                            >
                                {part.slice(2, -2)}
                            </strong>
                        )
                    }
                    return <span key={j}>{part}</span>
                })

                return (
                    <p
                        key={i}
                        className={`leading-relaxed ${i === 0 ? 'font-medium text-slate-800' : 'text-slate-700'}`}
                    >
                        {rendered}
                    </p>
                )
            })}
        </div>
    )
}
