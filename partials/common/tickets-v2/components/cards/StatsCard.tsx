import { ReactNode } from 'react'

interface StatsCardProps {
    icon: ReactNode
    label: string
    value: number | string
    color: 'orange' | 'teal' | 'dark' | 'green' | 'red' | 'indigo'
    gradient: string
}

export const StatsCard = ({ icon, label, value, gradient }: StatsCardProps) => {
    return (
        <div
            className={`group relative bg-gradient-to-br ${gradient} rounded-lg p-3 text-white shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden hover:scale-105`}
        >
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-xl transform translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform duration-500"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-white/15 backdrop-blur-sm rounded-lg group-hover:scale-110 transition-transform duration-300">
                        {icon}
                    </div>
                    <div className="text-2xl tracking-tight">{value}</div>
                </div>

                <div className="text-white/80 text-xs uppercase tracking-wider">
                    {label}
                </div>

                {/* Progress indicator */}
                {typeof value === 'number' && (
                    <div className="mt-2 h-1 bg-white/15 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white/40 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${Math.min(value * 15, 100)}%` }}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
