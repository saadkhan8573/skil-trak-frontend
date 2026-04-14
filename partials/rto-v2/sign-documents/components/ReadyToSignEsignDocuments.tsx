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
import { ReactElement, useEffect, useState } from 'react'
import { useEsignColumns } from '../hooks/useEsignColumns'

export const ReadyToSignEsignDocuments = () => {
    const router = useRouter()

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    useEffect(() => {
        setPage(Number(router?.query?.page || 1))
        setItemPerPage(Number(router?.query?.pageSize || 50))
    }, [router])

    const readyToSignDocuments = CommonApi.ESign.useReadyToSignDocumentsList(
        {
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
                    {readyToSignDocuments?.isError && <TechnicalError />}
                    {readyToSignDocuments?.isLoading ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : readyToSignDocuments?.data &&
                        readyToSignDocuments?.data?.data?.length ? (
                        <Table
                            columns={columns}
                            data={readyToSignDocuments?.data.data}
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
                                                    readyToSignDocuments?.data?.data
                                                        ?.length
                                                )}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination &&
                                                    pagination(
                                                        readyToSignDocuments?.data
                                                            ?.pagination,
                                                        setPage
                                                    )}
                                            </div>
                                        </div>
                                        <div className="px-6">{table}</div>
                                        {readyToSignDocuments?.data?.data?.length >
                                            10 && (
                                                <div className="p-6 mb-2 flex justify-between">
                                                    {pageSize &&
                                                        pageSize(
                                                            itemPerPage,
                                                            setItemPerPage,
                                                            readyToSignDocuments?.data
                                                                ?.data?.length
                                                        )}
                                                    <div className="flex gap-x-2">
                                                        {quickActions}
                                                        {pagination &&
                                                            pagination(
                                                                readyToSignDocuments
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
                            title={'No Ready-To-Sign Documents!'}
                            description={
                                'You have no e-sign documents currently ready to sign'
                            }
                            height={'50vh'}
                        />
                    )}
                </Card>
            </div>
        </>
    )
}
