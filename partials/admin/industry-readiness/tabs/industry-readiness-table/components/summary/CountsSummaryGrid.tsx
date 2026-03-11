import React, { useMemo } from 'react'
import { ReadinessCountsCard } from './ReadinessCountsCard'
import { AdminApi } from '@queries'

interface SummaryData {
    status: string
    count: number
}

interface SummaryGridProps {
    data: SummaryData[]
}

export const IndustryReadinessSummary = ({ filters }: any) => {
    const searchString = useMemo(() => {
        return Object.entries(filters || {})
            .filter(
                ([_, value]) =>
                    value !== 'all' &&
                    value !== '' &&
                    value !== null &&
                    value !== undefined
            )
            .map(([key, value]) => `${key}:${value}`)
            .join(',')
    }, [filters])
    const { data, isLoading, isError } =
        AdminApi.IndustryReadiness.useForecastCounts({
            search: searchString || undefined,
        })
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
