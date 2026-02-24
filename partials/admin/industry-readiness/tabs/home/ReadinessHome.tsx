import React from 'react'
import { ReadinessStatesCard } from './components/ReadinessStatesCard'

const stats = [
    { variant: 'ready' as const, value: 20 },
    { variant: 'at-risk' as const, value: 30 },
    { variant: 'not-ready' as const, value: 2 },
    { variant: 'students' as const, value: 60 },
]
export const ReadinessHome = () => {
    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <ReadinessStatesCard
                        key={stat.variant}
                        variant={stat.variant}
                        value={stat.value}
                    />
                ))}
            </div>
        </div>
    )
}
