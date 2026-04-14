import {
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TableChildrenProps,
    TechnicalError,
} from '@components'

import { CommonApi } from '@queries'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useEsignColumns } from '../hooks'

export const PendingEsignDocuments = () => {
    const router = useRouter()

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    useEffect(() => {
        setPage(Number(router?.query?.page || 1))
        setItemPerPage(Number(router?.query?.pageSize || 50))
    }, [router])

    const pendingDocuments = CommonApi.ESign.useListByStatusForRto(
        {
            status: 'pending',
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        },
        {
            refetchOnMountOrArgChange: true,
        }
    )

    const { columns } = useEsignColumns({
        removeColumnKeys: ['status', 'signDate'],
    })

    return (
        <>
            <div className="flex flex-col gap-y-4">
                <Card noPadding>
                    {pendingDocuments?.isError && <TechnicalError />}
                    {pendingDocuments?.isLoading ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : pendingDocuments?.data &&
                        pendingDocuments?.data?.data?.length ? (
                        <Table
                            columns={columns}
                            data={pendingDocuments?.data.data}
                        >
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
                                                    pendingDocuments?.data?.data
                                                        ?.length
                                                )}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination &&
                                                    pagination(
                                                        pendingDocuments?.data
                                                            ?.pagination,
                                                        setPage
                                                    )}
                                            </div>
                                        </div>
                                        <div className="px-6">{table}</div>
                                        {pendingDocuments?.data?.data?.length >
                                            10 && (
                                                <div className="p-6 mb-2 flex justify-between">
                                                    {pageSize &&
                                                        pageSize(
                                                            itemPerPage,
                                                            setItemPerPage,
                                                            pendingDocuments?.data
                                                                ?.data?.length
                                                        )}
                                                    <div className="flex gap-x-2">
                                                        {quickActions}
                                                        {pagination &&
                                                            pagination(
                                                                pendingDocuments
                                                                    ?.data
                                                                    ?.pagination,
                                                                setPage
                                                            )}
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                )
                            }}
                        </Table>
                    ) : (
                        <EmptyData
                            title={'No Pending Documents!'}
                            description={
                                'You have no pending e-sgn documents request yet'
                            }
                            height={'50vh'}
                        />
                    )}
                </Card>
            </div>
        </>
    )
}
