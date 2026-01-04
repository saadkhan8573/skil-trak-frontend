import {
    Button,
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TechnicalError,
} from '@components'
import { PageHeading } from '@components/headings'
import { FaFileExport } from 'react-icons/fa'

import { CommonApi } from '@queries'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
// import { IndustryCell, SectorCell } from './components'
// import { BlockModal } from './modals'

// hooks
import { useColumns } from '../hooks'

export const WithoutEmailListingByState = ({
    onSetIndustryData,
}: {
    onSetIndustryData: (val: any) => void
}) => {
    const router = useRouter()
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])

    const { isLoading, data, isError } = CommonApi.FindWorkplace.listingByState(
        {
            search: 'emailStatus:withoutEmail',
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        },
        {
            refetchOnMountOrArgChange: true,
        }
    )

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
                    title={'Partial Listing'}
                    subtitle={'List of Partial Listing'}
                >
                    {data && data?.data?.length ? (
                        <Button
                            text="Export"
                            variant="action"
                            Icon={FaFileExport}
                        />
                    ) : null}
                </PageHeading>

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
