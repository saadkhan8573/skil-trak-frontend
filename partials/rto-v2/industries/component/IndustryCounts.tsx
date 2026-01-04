import { Card } from '@components/cards'
import { Progress } from '@components/ui/progress'
import { cn } from '@utils'
import { RtoV2Api } from '@redux/queries/portals/rto-v2'
import { Activity, Briefcase, Building2, Clock, Handshake } from 'lucide-react'
import React from 'react'

export const IndustryCounts = () => {
    const { data: counts } = RtoV2Api.Industries.getIndustriesCounts()

    const config = [
        {
            label: 'Active Placement Industries',
            value: counts?.active || 0,
            icon: Activity,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            progressColor: 'bg-green-600',
        },
        {
            label: 'Non-Partner Industries',
            value: counts?.nonPartnerIndustries || 0,
            icon: Building2,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200',
        },
        {
            label: 'Partner Industries',
            value: counts?.partnerIndustries || 0,
            icon: Handshake,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            progressColor: 'bg-blue-600',
        },
        {
            label: 'Ready For Placement',
            value: counts?.readyForPlacementIndustries || 0,
            icon: Briefcase,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            progressColor: 'bg-purple-600',
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {config.map((item, index) => {
                const Icon = item.icon
                return (
                    <Card
                        key={index}
                        noPadding
                        className={cn(
                            'relative overflow-hidden transition-all duration-200 hover:shadow-md',
                            'border',
                            item.borderColor,
                            item.bgColor
                        )}
                    >
                        {/* Decorative Background Icon */}
                        <div className="absolute -right-6 -top-6 opacity-[0.05]">
                            <Icon className={cn('w-24 h-24', item.color)} />
                        </div>

                        <div className="p-4 relative z-10">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">
                                        {item.label}
                                    </p>
                                    <h3
                                        className={cn(
                                            'text-2xl font-bold tracking-tight',
                                            item.color
                                        )}
                                    >
                                        {item.value}
                                    </h3>
                                </div>
                                <div
                                    className={cn(
                                        'p-2 rounded-lg bg-white shadow-sm',
                                        item.color
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </Card>
                )
            })}
        </div>
    )
}
