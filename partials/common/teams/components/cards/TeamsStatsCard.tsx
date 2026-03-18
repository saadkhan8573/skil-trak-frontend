import { Card } from '@components'
import { Activity, Users } from 'lucide-react'

export const TeamsStatsCard = ({ data }: any) => {
    const STATS = [
        {
            label: 'Totsal Members',
            value: data?.member ?? 0,
            icon: Users,
            iconColor: 'from-primaryNew to-primaryNew',
        },
        {
            label: 'Team',
            value: data?.team ?? 0,
            icon: Activity,
            iconColor: 'from-primaryNew to-yellow-400',
        },
    ]

    return (
        <div>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {STATS.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <Card
                            key={index}
                            className="border border-primaryNew/20 bg-linear-to-br from-primaryNew/5 to-background hover:shadow-premium transition-all p-4"
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-400">
                                        {stat.label}
                                    </p>
                                    <p className="text-3xl text-primaryNew font-semibold">
                                        {stat.value}
                                    </p>
                                </div>
                                <div
                                    className={`h-12 w-12 rounded-xl bg-linear-to-br ${stat.iconColor} flex items-center justify-center shadow-premium`}
                                >
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
