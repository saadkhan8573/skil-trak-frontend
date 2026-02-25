import { EmptyData, LoadingAnimation, PageSize, Paginate, Pagination } from '@components'
import { PageHeading } from '@components/headings'
import { ApprovedPlacementCard, PendingPlacementCard, RejectPlacementCard } from './card'
import { RtoApprovalWorkplaceRequest } from '@types'

export const FilteredPlacements = ({
    placements,
    setPage,
    itemPerPage,
    setItemPerPage,
}: {
    placements: any
    setPage: any
    itemPerPage: any
    setItemPerPage: any
}) => {
    return (
        <div className="flex flex-col gap-y-4 p-4">
            <PageHeading
                title={'Filtered Placements'}
                subtitle={'List of Filtered Placements'}
            />

            <div className="space-y-4">
                {placements?.isLoading || placements?.isFetching ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : placements?.data?.data && placements?.data?.data?.length ? (
                    <>
                        <div className="flex justify-between items-center px-2">
                            <PageSize
                                itemPerPage={itemPerPage}
                                setItemPerPage={setItemPerPage}
                                records={placements?.data?.data?.length}
                            />
                            <Pagination
                                pagination={placements?.data?.pagination}
                                setPage={setPage}
                            />
                        </div>
                        {placements?.data?.data?.map((approval: RtoApprovalWorkplaceRequest) => {
                            if (approval?.status === "approved") {
                                return <ApprovedPlacementCard
                                    key={approval?.id}
                                    approval={approval}
                                />
                            }

                            if (approval?.status === "rejected") {
                                return (
                                    <RejectPlacementCard
                                        key={approval?.id}
                                        approval={approval}
                                    />
                                )
                            }

                            return (
                                <PendingPlacementCard
                                    key={approval.id}
                                    approval={approval}
                                />
                            )
                        })}
                        <div className="flex justify-between items-center px-2 border-t pt-4">
                            <PageSize
                                itemPerPage={itemPerPage}
                                setItemPerPage={setItemPerPage}
                                records={placements?.data?.data?.length}
                            />
                            <Pagination
                                pagination={placements?.data?.pagination}
                                setPage={setPage}
                            />
                        </div>
                    </>
                ) : (
                    <EmptyData
                        title={'No Placements in your Search!'}
                        description={'No Placements in your Search yet'}
                        height={'50vh'}
                    />
                )}
            </div>
        </div>
    )
}
