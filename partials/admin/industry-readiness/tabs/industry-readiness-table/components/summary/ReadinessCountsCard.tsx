import { cn } from '@utils'
import React from 'react'
import { PuffLoader } from 'react-spinners'

type SummaryVariant = 'ready' | 'at-risk' | 'not-ready'

interface ReadinessCountsCardProps {
    variant: SummaryVariant
    count: number | string
    isLoading?: boolean
}

const SUMMARY_CONFIG = {
    'not-ready': {
        label: 'Not Ready',
        subtext: 'Urgent action required',
        bgColor: 'bg-red-500',
    },
    'at-risk': {
        label: 'At Risk',
        subtext: 'Monitor closely',
        bgColor: 'bg-[#F7A619]',
    },
    ready: {
        label: 'Ready',
        subtext: 'No action needed',
        bgColor: 'bg-[#0D5468]',
    },
}

export const ReadinessCountsCard = ({
    variant,
    count,
    isLoading,
}: ReadinessCountsCardProps) => {
    const config = SUMMARY_CONFIG[variant]

    return (
        <div
            className={cn(
                'rounded-xl p-5 text-white shadow-xl transition-transform hover:scale-[1.02]',
                config.bgColor
            )}
        >
            <div className="text-sm font-semibold opacity-90 mb-2.5">
                {config.label}
            </div>
            {isLoading ? (
                <PuffLoader
                    size={24}
                    color={'#fff'}
                    data-testid="puff-loader"
                />
            ) : (
                <>
                    <div className="text-3xl font-bold mb-1.5">{count}</div>
                    <div className="text-sm opacity-80">{config.subtext}</div>
                </>
            )}
        </div>
    )
}
