import {
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TableChildrenProps,
    TechnicalError,
} from '@components'

import { useGetRtoStudentsQuery } from '@queries'
import { UserStatus } from '@types'
import { useState } from 'react'
import { useColumns } from './hooks'

export const RejectedStudent = () => {
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    const { isLoading, data, isError } = useGetRtoStudentsQuery({
        search: `status:${UserStatus.Rejected}`,
        skip: itemPerPage * page - itemPerPage,
        limit: itemPerPage,
    })

    const { getTableConfig, modal } = useColumns()

    const { columns } = getTableConfig({
        actionKeys: ['accept', 'delete'],
        removeColumnKeys: ['assigned', 'progress', 'expiry', 'industry', 'batch', 'sectors', 'snoozed'],
    })

    return (
        <>
            {modal}
            <div className="flex flex-col gap-y-4">
                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : data && data?.data.length ? (
                        <Table columns={columns} data={data.data}>
                            {({
                                table,
                                pagination,
                                pageSize,
                                quickActions,
                            }: TableChildrenProps) => (
                                <div>
                                    <div className="p-6 mb-2 flex justify-between">
                                        {pageSize &&
                                            pageSize(
                                                itemPerPage,
                                                setItemPerPage
                                            )}
                                        <div className="flex gap-x-2">
                                            {quickActions}
                                            {pagination &&
                                                pagination(
                                                    data?.pagination,
                                                    setPage
                                                )}
                                        </div>
                                    </div>
                                    <div className="px-6 overflow-auto">
                                        {table}
                                    </div>
                                </div>
                            )}
                        </Table>
                    ) : (
                        !isError && (
                            <EmptyData
                                title={'No Rejected Student!'}
                                description={
                                    'You have not rejected any Student request yet'
                                }
                                height={'50vh'}
                            />
                        )
                    )}
                </Card>
            </div>
        </>
    )
}
