import { Typography } from '@components'
import { LucideIcon } from 'lucide-react'

interface AnalyticsCardProps {
    card: {
        title: string
        value: string | number
        change?: string
        changeText?: string
        icon: LucideIcon
        gradient: string
        trend: string
        percentage?: number
        color: string
        showBar?: boolean
        showButton?: boolean
        buttonText?: string
        showChart?: boolean
    }
    index: number
}

export function AnalyticsCard({ card, index }: AnalyticsCardProps) {
    const Icon = card.icon

    return (
        <div
            key={index}
            className="relative group"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Gradient Glow Effect on Hover */}
            <div
                className={`absolute -inset-px bg-linear-to-r ${card.gradient} rounded-xl opacity-0 group-hover:opacity-10 blur-sm transition-all duration-300`}
            />

            {/* Card Content */}
            <div className="relative w-full bg-white rounded-md shadow-md border border-slate-100 p-2 hover:shadow-md transition-all duration-300 group-hover:-translate-y-0.5 overflow-hidden cursor-pointer text-left h-full flex flex-col justify-between">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-12 h-12 opacity-[0.03]">
                    <div
                        className={`absolute inset-0 bg-linear-to-br ${card.gradient}`}
                        style={{
                            clipPath: 'circle(50% at 100% 0)',
                        }}
                    />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            {/* Icon with Gradient */}
                            <div
                                className={`w-5 h-5 bg-linear-to-br ${card.gradient} bg-opacity-10 rounded flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/50`}
                            >
                                <Icon
                                    className="w-3 h-3 text-white"
                                    strokeWidth={2.5}
                                />
                            </div>

                            {/* Title */}
                            <Typography
                                variant="label"
                                className="font-semibold text-slate-500 uppercase leading-none"
                            >
                                {card.title}
                            </Typography>
                        </div>

                        {/* Urgent Badge */}
                        {card.trend === 'urgent' && (
                            <div className="flex items-center gap-0.5 bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded-full text-[8px] font-bold border border-rose-100/50 animate-pulse">
                                <span>Urgent</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-0.5">
                        <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-slate-800 tracking-tight">
                                {card.value}
                            </span>
                            {card.change && card.changeText && (
                                <div className="flex items-center gap-1 text-[11px] font-medium">
                                    <span
                                        className={
                                            card.trend === 'up'
                                                ? 'text-emerald-600'
                                                : 'text-slate-600'
                                        }
                                    >
                                        {card.change}
                                    </span>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-slate-400  truncate max-w-[80px]">
                                        {card.changeText}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {card.showBar && (
                        <div className="mt-2">
                            <div className="flex items-center justify-between mb-0.5">
                                <span className="text-[8px] text-slate-500 font-semibold tracking-wide">
                                    USAGE
                                </span>
                                <span className="text-[8px] text-slate-700 font-bold">
                                    {card.percentage || 0}%
                                </span>
                            </div>
                            <div className="h-1 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                                <div
                                    className={`h-full bg-linear-to-r ${card.gradient} rounded-full transition-all duration-1000`}
                                    style={{
                                        width: `${card.percentage || 0}%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    {card.showButton && (
                        <div className="mt-2 w-full px-2 py-1 bg-linear-to-r from-amber-500 to-orange-600 text-white rounded-md transition-all text-[9px] font-bold shadow-sm text-center hover:shadow-md hover:from-amber-600 hover:to-orange-700 active:scale-95 cursor-pointer">
                            {card.buttonText}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
