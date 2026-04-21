import {
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TableChildrenProps,
    TechnicalError,
} from '@components'

import { RtoApi } from '@queries'
import { useState } from 'react'
import { useColumns } from './hooks'

export const PendingStudent = () => {
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const { isLoading, data, isError, isSuccess } =
        RtoApi.Students.usePendingStudentsList({
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        })

    const { getTableConfig, modal } = useColumns()

    const { columns } = getTableConfig({
        actionKeys: ['accept', 'reject'],
        columnKeys: ['studentMaskedId', 'name', 'createdAt', 'action'],
    })

    return (
        <>
            {modal}
            <div className="flex flex-col gap-y-4">
                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : data?.data && data?.data?.length && isSuccess ? (
                        <Table columns={columns} data={data.data}>
                            {({
                                table,
                                pagination,
                                pageSize,
                                quickActions,
                            }: TableChildrenProps) => {
                                return (
                                    <div>
                                        <div className="p-6 mb-2 flex justify-between">
                                            {pageSize &&
                                                pageSize(
                                                    itemPerPage,
                                                    setItemPerPage,
                                                    data?.data?.length
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
                                        <div className="px-6">{table}</div>
                                        {data?.data?.length > 10 && (
                                            <div className="p-6 mb-2 flex justify-between">
                                                {pageSize &&
                                                    pageSize(
                                                        itemPerPage,
                                                        setItemPerPage,
                                                        data?.data?.length
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
                                        )}
                                    </div>
                                )
                            }}
                        </Table>
                    ) : isSuccess ? (
                        <EmptyData
                            title={'No Pending Student!'}
                            description={
                                'You have no pending Student request yet'
                            }
                            height={'50vh'}
                        />
                    ) : null}
                </Card>
            </div>
        </>
    )
}
