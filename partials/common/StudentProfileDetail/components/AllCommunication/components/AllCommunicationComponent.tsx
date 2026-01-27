// TODO: save all the workplace status in all communication, including rejection and cancellation. With date stamp and the person who did it?,
// TODO: modal view snoozed history
// TODO: student cancellation note in all communication

import { Badge, EmptyData, LoadingAnimation, TechnicalError } from '@components'
import { CommonApi } from '@queries'
import { useRef, useState } from 'react'

import { CommunicationFilters } from './CommunicationFilters'
import { CommunicationStats } from './CommunicationStats'
import { VirtualizedCommunicationList } from './VirtualizedCommunicationList'

export const AllCommunicationComponent = ({
    user,
    isEntered = true,
}: {
    user: any
    isEntered?: boolean
}) => {
    const [itemPerPage] = useState(10)
    const [page, setPage] = useState(1)

    const [searchTerm, setSearchTerm] = useState('')
    const [typeFilter, setTypeFilter] = useState('all')
    const [showLoader, setShowLoader] = useState<boolean>(false)

    // Virtualization states
    const containerRef = useRef<HTMLDivElement>(null)

    const { data, isLoading, isError, isSuccess, isFetching } =
        CommonApi.AllCommunication.useCommunications(
            {
                id: user?.user?.id,
                params: {
                    type: typeFilter,
                    skip: itemPerPage * page - itemPerPage, // ✅ new formula
                    limit: itemPerPage,
                },
            },
            {
                skip: !user?.user || !isEntered,
            }
        )

    return (
        <>
            {isError && <TechnicalError />}
            {!isError && (
                <CommunicationFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    typeFilter={typeFilter}
                    setTypeFilter={(e: any) => {
                        setPage(1)
                        setTypeFilter(e)
                        setShowLoader(true)
                    }}
                />
            )}
            {isLoading || (showLoader ? isFetching : false) ? (
                <LoadingAnimation />
            ) : data?.data && data?.data?.length > 0 && isSuccess ? (
                <>
                    <CommunicationStats
                        itemPerPage={data?.data?.length || 6}
                        totalCount={data?.pagination?.totalResult || 0}
                        currentPage={data?.pagination?.currentPage || 1}
                        loading={isFetching || isLoading}
                    />
                    <div
                        ref={containerRef}
                        className="flex-1 h-[calc(100vh-170px)] overflow-auto px-4"
                    >
                        <VirtualizedCommunicationList items={data?.data} />
                    </div>
                    {data?.pagination?.hasNext && (
                        <div className="flex justify-center py-1.5">
                            <Badge
                                variant="info"
                                text="Load more"
                                onClick={() => {
                                    setPage((prev) => prev + 1)
                                    setShowLoader(false)
                                }}
                                loading={isFetching || isLoading}
                                disabled={
                                    !data?.pagination?.hasNext ||
                                    isLoading ||
                                    isFetching
                                }
                            />
                        </div>
                    )}
                </>
            ) : (
                isSuccess && (
                    <EmptyData
                        imageUrl="/images/icons/common/notes.png"
                        title="No All Communication Attached"
                        description="Attach a note or message to view All Communication here"
                        height="40vh"
                    />
                )
            )}
        </>
    )
}
