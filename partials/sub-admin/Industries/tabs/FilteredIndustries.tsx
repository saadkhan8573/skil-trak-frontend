import {
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TechnicalError,
} from '@components'
import { SubAdminApi } from '@queries'
import { removeEmptyValues } from '@utils'
import React, { useState } from 'react'
import { useSubAdminIndustryColumns } from '../hooks/useSubAdminIndustryColumns'

interface FilteredIndustriesProps {
    baseFilter: any
}

export const FilteredIndustries: React.FC<FilteredIndustriesProps> = ({
    baseFilter,
}) => {
    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(30)

    const industries = SubAdminApi.Industry.useGetAllSubAdminIndustriesList({
        search: JSON.stringify(removeEmptyValues(baseFilter))
            .replaceAll('{', '')
            .replaceAll('}', '')
            .replaceAll('"', '')
            .trim(),
        skip: itemPerPage * page - itemPerPage,
        limit: itemPerPage,
    })

    const { getTableConfig, modal } = useSubAdminIndustryColumns()
    const { columns } = getTableConfig({
        columnKeys: ['name', 'abn', 'students', 'contactPerson', 'favouriteBy', 'createdAt', 'action'],
    })

    return (
        <div className="space-y-4">
            {modal}
            <div className="flex items-center justify-between px-4 py-2 bg-primary/5 rounded-lg border border-primary/10">
                <span className="text-sm font-medium text-primary">
                    Filtered Search Results
                </span>
                <span className="text-xs text-muted-foreground">
                    All Tabs Combined
                </span>
            </div>
            <Card noPadding>
                {industries?.isError && <TechnicalError />}
                {industries?.isLoading || industries?.isFetching ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : industries?.data?.data?.length ? (
                    <Table columns={columns} data={industries?.data?.data}>
                        {({
                            table,
                            pagination,
                            pageSize,
                            quickActions,
                        }: any) => {
                            return (
                                <div>
                                    <div className="p-6 mb-2 flex justify-between">
                                        {pageSize(
                                            itemPerPage,
                                            setItemPerPage,
                                            industries?.data?.data?.length
                                        )}
                                        <div className="flex gap-x-2">
                                            {quickActions}
                                            {pagination(
                                                industries?.data?.pagination,
                                                setPage
                                            )}
                                        </div>
                                    </div>
                                    <div className="px-6 w-full overflow-x-scroll remove-scrollbar">
                                        {table}
                                    </div>
                                </div>
                            )
                        }}
                    </Table>
                ) : (
                    !industries?.isError && (
                        <EmptyData
                            title={'No Results Found!'}
                            description={'Try adjusting your filters to find what you are looking for.'}
                            height={'50vh'}
                        />
                    )
                )}
            </Card>
        </div>
    )
}
