import { Card, EmptyData, LoadingAnimation, Table } from '@components'
import { PageHeading } from '@components/headings'

import { useColumns } from './hooks'

export const FilteredSearchIndustries = ({
    industries,
    setPage,
    itemPerPage,
    setItemPerPage,
    onSetIndustryData,
}: {
    industries: any
    setPage: any
    itemPerPage: any
    setItemPerPage: any
    onSetIndustryData: (val: any) => void
}) => {
    const { columns, modal, actionsModal, quickActionsElements } = useColumns({
        data: industries?.data,
        onSetIndustryData,
    })

    const industriesData =
        industries?.data?.paginatedResults?.data || industries?.data?.data
    const industriesPagination =
        industries?.data?.paginatedResults?.pagination ||
        industries?.data?.pagination

    return (
        <>
            {modal}
            {actionsModal}
            <div className="flex flex-col gap-y-4 p-4">
                <PageHeading
                    title={'Filtered Industries'}
                    subtitle={'List of Filtered Industries'}
                />

                <Card noPadding>
                    {industries?.isLoading || industries?.isFetching ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : industriesData && industriesData?.length ? (
                        <Table
                            columns={columns as any}
                            data={industriesData}
                            quickActions={quickActionsElements}
                            enableRowSelection
                        >
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
                                                industriesData?.length
                                            )}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination(
                                                    industriesPagination,
                                                    setPage
                                                )}
                                            </div>
                                        </div>
                                        <div className="px-6 overflow-auto custom-scrollbar">
                                            {table}
                                        </div>
                                        {industriesData?.length > 10 && (
                                            <div className="px-6 py-2 mb-2 flex justify-between">
                                                {pageSize(
                                                    itemPerPage,
                                                    setItemPerPage,
                                                    industriesData?.length
                                                )}
                                                <div className="flex gap-x-2">
                                                    {quickActions}
                                                    {pagination(
                                                        industriesPagination,
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
                        <>
                            {/* <div className="flex justify-center mt-4 mb-24">
                                <Button
                                    text="Click here to add industry"
                                    variant="primary"
                                    onClick={() =>
                                        router.push(
                                            '/portals/admin/add-industry'
                                        )
                                    }
                                />
                            </div> */}
                            <EmptyData
                                title={'No Industry in your Search!'}
                                description={'No Industry in your Search yet'}
                                height={'50vh'}
                            />
                        </>
                    )}
                </Card>
            </div>
        </>
    )
}
