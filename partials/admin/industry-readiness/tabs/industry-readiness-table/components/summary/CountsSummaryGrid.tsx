import React from 'react'
import { ReadinessCountsCard } from './ReadinessCountsCard'
import { AdminApi } from '@queries'

interface SummaryData {
    status: string
    count: number
}

interface SummaryGridProps {
    data: SummaryData[]
}

export const IndustryReadinessSummary = () => {
    const { data, isLoading, isError } =
        AdminApi.IndustryReadiness.useForecastCounts()
    const getCount = (status: string) => {
        return (
            (data?.length > 0 &&
                data?.find((item: any) => item.status === status)?.count) ??
            0
        )
    }

    const summaryItems = [
        {
            variant: 'not-ready' as const,
            count: getCount('not_ready'),
        },
        {
            variant: 'at-risk' as const,
            count: getCount('at_risk'),
        },
        {
            variant: 'ready' as const,
            count: getCount('ready'),
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {summaryItems?.map((item) => (
                <ReadinessCountsCard
                    key={item?.variant}
                    variant={item?.variant}
                    count={item?.count ?? 0}
                    isLoading={isLoading}
                />
            ))}
        </div>
    )
}
