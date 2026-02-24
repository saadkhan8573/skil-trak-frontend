import React from 'react'

interface ForecastCardProps {
    title: string
    icon: React.ElementType
    data: any[]
    totalStudents: number
    colorClass: string
    renderLabel: (item: any) => string
    height?: string // Allow custom height, defaulting to a sensible value
}

export const ForecastCard = ({
    title,
    icon: Icon,
    data,
    totalStudents,
    colorClass,
    renderLabel,
    height = 'h-[400px]', // Default fixed height
}: ForecastCardProps) => {
    // Tao of React Tip: Keep the sorting logic outside the return if it's complex
    const sortedData = [...data].sort(
        (a, b) => Number(b.studentCount) - Number(a.studentCount)
    )

    return (
        <div
            className={`bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden flex flex-col ${height}`}
        >
            {/* Header - Fixed at top */}
            <div
                className="p-5 border-b border-slate-200 shrink-0"
                style={{ backgroundColor: colorClass }}
            >
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-white font-semibold">{title}</h3>
                </div>
            </div>

            {/* Scrollable List Container */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                {sortedData.map((item, index) => {
                    const label = renderLabel(item) || 'Unknown'
                    const count = Number(item.studentCount)
                    const percentage =
                        totalStudents > 0 ? (count / totalStudents) * 100 : 0

                    return (
                        <div key={index} className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-700 font-semibold flex-1 pr-2 truncate">
                                    {label}
                                </div>
                                <div className="text-slate-900 font-bold">
                                    {count}
                                </div>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000"
                                    style={{
                                        width: `${percentage}%`,
                                        backgroundColor: colorClass,
                                    }}
                                ></div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
