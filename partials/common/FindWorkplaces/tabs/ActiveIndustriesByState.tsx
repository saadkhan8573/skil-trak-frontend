import {
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TechnicalError,
} from '@components'
import { PageHeading } from '@components/headings'

import { CommonApi } from '@queries'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

// hooks
import { useColumns } from '../hooks'

export const ActiveIndustriesByState = ({
    onSetIndustryData,
}: {
    onSetIndustryData: (val: any) => void
}) => {
    const router = useRouter()
    const [itemPerPage, setItemPerPage] = useState(10)
    const [page, setPage] = useState(1)

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 10))
    }, [router])

    const { isLoading, data, isError } = CommonApi.FindWorkplace.listingByState(
        {
            search: '',
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        },
        {
            refetchOnMountOrArgChange: true,
        }
    )

    const notContactedMoreThan7Days = data?.data?.filter((industry: any) => {
        const created = new Date(industry?.createdAt)
        const currentDate = new Date()
        const timeDiff = currentDate.getTime() - created.getTime()
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
        return industry?.status === 'favourite' && daysDiff >= 7
    })

    const { columns, modal, actionsModal, quickActionsElements } = useColumns({
        data,
        onSetIndustryData,
    })

    return (
        <>
            {modal}
            {actionsModal}
            <div className="flex flex-col gap-y-4 mb-32">
                <PageHeading
                    title={'All Industries'}
                    subtitle={'List of all Industries'}
                ></PageHeading>

                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : data?.data && data?.data?.length ? (
                        <Table
                            columns={columns as any}
                            data={data?.data}
                            quickActions={quickActionsElements}
                            enableRowSelection
                            findCallLogsUnanswered={notContactedMoreThan7Days}
                        >
                            {({
                                table,
                                pagination,
                                pageSize,
                                quickActions,
                            }: any) => (
                                <div>
                                    <div className="p-6 mb-2 flex justify-between">
                                        {pageSize(
                                            itemPerPage,
                                            setItemPerPage,
                                            data?.data?.length
                                        )}
                                        <div className="flex gap-x-2">
                                            {quickActions}
                                            {pagination(
                                                data?.pagination,
                                                setPage
                                            )}
                                        </div>
                                    </div>
                                    <div className=" overflow-x-scroll remove-scrollbar">
                                        <div className="px-6 w-full">
                                            {table}
                                        </div>
                                    </div>
                                    {data?.data?.length > 10 && (
                                        <div className="px-6 py-2 mb-2 flex justify-between">
                                            {pageSize(
                                                itemPerPage,
                                                setItemPerPage,
                                                data?.data?.length
                                            )}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination(
                                                    data?.pagination,
                                                    setPage
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Table>
                    ) : (
                        !isError && (
                            <EmptyData
                                title={'No All Industry!'}
                                description={
                                    'You have not all any Industry request yet'
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
