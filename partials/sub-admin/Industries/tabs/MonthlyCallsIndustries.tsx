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

interface MonthlyCallsIndustriesProps {
    baseFilter: any
}

export const MonthlyCallsIndustries: React.FC<MonthlyCallsIndustriesProps> = ({
    baseFilter,
}) => {
    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(30)

    const industries = SubAdminApi.Industry.getMonthlyCallsList({
        ...removeEmptyValues(baseFilter),
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
                            title={'No Monthly Calls Industries!'}
                            description={'No industries found for monthly calls.'}
                            height={'50vh'}
                        />
                    )
                )}
            </Card>
        </div>
    )
}
