import React, { useState } from 'react'
import { CommonApi } from '@queries'
import { LoadingAnimation, NoData, Table, TextInput } from '@components'
import { useScheduledCallsColumns } from '../hooks/useScheduledCallsColumns'

export const ScheduledCallsTab = () => {
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')

    const { data, isLoading, isError } =
        CommonApi.CallManagement.useGetScheduledAiCallListQuery({
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
            search,
        })

    const { columns } = useScheduledCallsColumns()

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="w-full md:w-96">
                    <TextInput
                        name={"filter"}
                        placeholder="Search scheduled calls..."
                        value={search}
                        onChange={(e: any) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden !p-4">
                {isError && <NoData isError />}
                {isLoading ? (
                    <LoadingAnimation />
                ) : data?.data && data?.data?.length > 0 ? (
                    <>
                        <Table
                            columns={columns}
                            data={data?.data}
                        >
                            {({ pageSize, pagination, table }) => (
                                <>
                                    <div className="flex items-center justify-between mb-4">
                                        {pageSize && pageSize(itemPerPage, setItemPerPage, data?.data?.length)}
                                        <div className="flex gap-x-2">
                                            {pagination &&
                                                pagination(
                                                    data?.pagination,
                                                    setPage
                                                )}
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        {table}
                                    </div>
                                </>
                            )}
                        </Table>
                    </>
                ) : (
                    !isError && <NoData text="No scheduled calls found." />
                )}
            </div>
        </div>
    )
}
