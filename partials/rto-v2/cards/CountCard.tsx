import { Card } from '@components'
import { LucideIcon } from 'lucide-react'
import { Progressbar } from '../components'

interface StatCard {
    label: string
    value: string | number
    subValue?: string
    icon: LucideIcon
    iconColor: string
    iconBgColor: string
    valueColor?: string
    showProgress?: boolean
    progressValue?: number
    highlight?: boolean
}

interface ActionRequiredStatsGridProps {
    stat: StatCard
}

export const CountCard = ({ stat }: ActionRequiredStatsGridProps) => {
    return (
        <Card
            noPadding
            className={`shadow-premium border hover:shadow-premium-lg transition-all hover-lift border-red-400/30 bg-linear-to-br from-red-400/15 to-transparent`}
        >
            <div className="p-2.5">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">
                            {stat.label}
                        </p>
                        <p
                            className={`text-xl font-bold ${stat.valueColor || ''
                                }`}
                        >
                            {stat.value}
                        </p>
                        {stat.subValue && (
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                {stat.subValue}
                            </p>
                        )}
                    </div>
                    <div
                        className={`h-10 w-10 rounded-xl ${stat.iconBgColor} flex items-center justify-center`}
                    >
                        <stat.icon
                            className={`h-5 w-5 ${stat.iconColor} ${stat.highlight ? 'animate-pulse' : ''
                                }`}
                        />
                    </div>
                </div>
                {stat.showProgress && stat.progressValue !== undefined && (
                    <Progressbar
                        value={stat.progressValue}
                        size="xs"
                    // className="h-2 mt-3"
                    />
                )}
            </div>
        </Card>
    )
}
