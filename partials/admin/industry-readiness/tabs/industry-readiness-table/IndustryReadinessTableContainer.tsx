import { useState, useMemo } from 'react'
import { IndustryReadinessTable } from './components/IndustryReadinessTable'
import { PageSize, Pagination, LoadingAnimation, NoData } from '@components'
import { AdminApi } from '@queries'
import { IndustryReadinessSummary } from './components/summary/CountsSummaryGrid'
import {
    ReadinessFilterBar,
    ReadinessFilters,
} from './components/ReadinessFilterBar'

export enum ReadinessStatus {
    ALL = 'all',
    READY = 'ready',
    AT_RISK = 'at_risk',
    NOT_READY = 'not_ready',
    UNKNOWN = 'unknown',
}
const INITIAL_FILTERS: ReadinessFilters = {
    suburb: '',
    postalCode: '',
    sectorName: null,
    status: 'all',
}
export const IndustryReadinessTableContainer = () => {
    const [filters, setFilters] = useState<ReadinessFilters>(INITIAL_FILTERS)
    const [itemPerPage, setItemPerPage] = useState(30)
    const [page, setPage] = useState(1)
    const [sortConfig, setSortConfig] = useState<{
        key: string
        direction: 'asc' | 'desc'
    } | null>(null)
    const searchString = useMemo(() => {
        return Object.entries(filters)
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
        AdminApi.IndustryReadiness.useForecastList({
            search: searchString || undefined,
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        })

    const toggleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc'
        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'asc'
        ) {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }
     // const sortedData = useMemo(() => {
    //     let sortableItems = [...data?.data]
    //     if (sortConfig !== null) {
    //         sortableItems.sort((a, b) => {
    //             // @ts-ignore - dynamic key access
    //             if (a[sortConfig.key] < b[sortConfig.key]) {
    //                 return sortConfig.direction === 'asc' ? -1 : 1
    //             }
    //             // @ts-ignore
    //             if (a[sortConfig.key] > b[sortConfig.key]) {
    //                 return sortConfig.direction === 'asc' ? 1 : -1
    //             }
    //             return 0
    //         })
    //     }
    //     return sortableItems
    // }, [data?.data, sortConfig])
    return (
        <div>
            <IndustryReadinessSummary />
            <ReadinessFilterBar filters={filters} setFilters={setFilters} />
            {isError && <NoData isError text="Something went wrong" />}
            {isLoading ? (
                <LoadingAnimation />
            ) : data && data?.data?.length > 0 ? (
                <>
                    {' '}
                    <div className="flex items-center justify-between bg-white rounded-xl shadow-lg p-2 mb-2">
                        <PageSize
                            itemPerPage={itemPerPage}
                            setItemPerPage={setItemPerPage}
                            records={data?.data?.length}
                        />
                        <Pagination
                            pagination={data?.pagination}
                            setPage={setPage}
                        />
                    </div>
                    <IndustryReadinessTable
                        data={data?.data}
                        onSort={toggleSort}
                    />
                </>
            ) : (
                !isError && <NoData text="No data found" />
            )}
        </div>
    )
}
