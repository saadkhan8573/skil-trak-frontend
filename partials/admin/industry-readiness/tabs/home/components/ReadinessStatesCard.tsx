import React from 'react'
import {
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    Users,
    LucideIcon,
} from 'lucide-react'
import { cn } from '@utils'

type CardVariant = 'ready' | 'at-risk' | 'not-ready' | 'students'

interface ReadinessStatesCardProps {
    variant: CardVariant
    value: string | number
}

const VARIANT_CONFIGS: Record<
    CardVariant,
    {
        label: string
        subtext: string
        icon: LucideIcon
        colorClass: string
        bgIcon: string
        borderColor: string
    }
> = {
    ready: {
        label: 'Ready Locations',
        subtext: 'All capacity secured',
        icon: CheckCircle2,
        colorClass: 'text-[#0D5468]',
        bgIcon: 'bg-[#0D5468]',
        borderColor: 'hover:border-[#0D5468]/30',
    },
    'at-risk': {
        label: 'At-Risk Locations',
        subtext: 'Minor gaps in capacity',
        icon: AlertCircle,
        colorClass: 'text-[#F7A619]',
        bgIcon: 'bg-[#F7A619]',
        borderColor: 'hover:border-[#F7A619]/30',
    },
    'not-ready': {
        label: 'Not Ready Locations',
        subtext: 'Urgent action needed',
        icon: AlertTriangle,
        colorClass: 'text-red-600',
        bgIcon: 'bg-red-500',
        borderColor: 'hover:border-red-300',
    },
    students: {
        label: 'Expected Students',
        subtext: 'Next 30-60 days',
        icon: Users,
        colorClass: 'text-[#044866]',
        bgIcon: 'bg-[#044866]',
        borderColor: 'hover:border-[#044866]/30',
    },
}

export const ReadinessStatesCard = ({
    variant,
    value,
}: ReadinessStatesCardProps) => {
    const config = VARIANT_CONFIGS[variant]
    const Icon = config.icon

    return (
        <div
            className={cn(
                'group bg-white rounded-xl p-5 border border-slate-200 shadow-lg transition-all duration-300',
                'hover:shadow-xl',
                config.borderColor
            )}
        >
            <div className="flex items-center justify-between mb-3">
                <div
                    className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center shadow-lg',
                        config.bgIcon
                    )}
                >
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div className={cn('text-2xl font-bold', config.colorClass)}>
                    {value}
                </div>
            </div>
            <div className="text-sm text-slate-900 font-semibold mb-1">
                {config.label}
            </div>
            <div className="text-xs text-slate-500">{config.subtext}</div>
        </div>
    )
}
