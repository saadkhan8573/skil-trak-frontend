import { NoData, PageSize, Pagination } from '@components'
import { CommonApi } from '@queries'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
    EmptyTicket,
    SelectAllTicketsCheckbox,
    TAGS,
    TicketCard,
    TicketListSkeleton,
    useSelectableList,
    useTicketListNavigation,
} from '@partials/common'
import { UserRoles } from '@constants'
import { getUserCredentials } from '@utils'

export const ProfileSupportTickets = ({ userId }: { userId: number }) => {
    const router = useRouter()
    const tab = router.query.tab
    const [itemPerPage, setItemPerPage] = useState(10)
    const [page, setPage] = useState(1)
    const role = getUserCredentials()?.role
    const { data, isLoading, isError } =
        CommonApi.Teams.useStudentSupportTicketsList(
            userId
                ? {
                    id: userId,
                    params: {
                        search: '',
                        skip: itemPerPage * page - itemPerPage,
                        limit: itemPerPage,
                    },
                }
                : undefined,
            { skip: !userId }
        )

    const {
        selectedIds: selectedTicketIds,
        isAllSelected,
        toggleSelectAll,
        toggleSelectOne,
        clearSelection,
    } = useSelectableList(data?.data || [])

    const handleTicketClick = (ticketId: number) => {
        // Navigate based on role
        if (role === UserRoles.RTO) {
            router.push(`/portals/rto/communications/tickets/${ticketId}`)
        } else if (role === UserRoles.ADMIN) {
            router.push(`/portals/admin/support-tickets/${ticketId}`)
        } else if (role === UserRoles.SUBADMIN) {
            router.push(`/portals/sub-admin/support-tickets/${ticketId}`)
        }
    }

    return (
        <div className="space-y-2 bg-white p-5 rounded-lg shadow-md">
            {isError && <NoData isError />}
            {isLoading ? (
                <TicketListSkeleton />
            ) : data?.data?.length > 0 ? (
                <>
                    <div className="flex justify-between">
                        <PageSize
                            itemPerPage={itemPerPage}
                            setItemPerPage={setItemPerPage}
                            records={data?.data?.length}
                        />
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center gap-x-2 ">
                                <div className="relative">
                                    <div className="bg-red-500 size-2 rounded-full"></div>
                                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-red-500 animate-ping opacity-75"></div>
                                </div>
                                <p className="text-xs text-slate-700 font-medium">
                                    Open/Assigned
                                </p>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <div className="relative">
                                    <div className="bg-green-500 size-2 rounded-full"></div>
                                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75"></div>
                                </div>
                                <p className="text-xs text-slate-700 font-medium">
                                    Resolved/Closed
                                </p>
                            </div>
                        </div>
                        <Pagination
                            pagination={data?.pagination}
                            setPage={setPage}
                        />
                    </div>
                    <SelectAllTicketsCheckbox
                        isAllSelected={isAllSelected}
                        toggleSelectAll={toggleSelectAll}
                        selectedTicketIds={selectedTicketIds}
                        data={data?.data}
                        clearSelection={clearSelection}
                    />
                    {data?.data?.map((ticket: any, index: number) => (
                        <div
                            key={ticket.id}
                            className="animate-scale-in"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <TicketCard
                                ticket={ticket}
                                onClick={() => handleTicketClick(ticket?.id)}
                                isSelected={selectedTicketIds.includes(
                                    ticket.id
                                )}
                                onSelect={toggleSelectOne}
                            // onViewStudentProfile={setSelectedStudentId}
                            // onViewIndustryProfile={setSelectedIndustryId}
                            />
                        </div>
                    ))}
                </>
            ) : (
                !isError && <EmptyTicket />
            )}
        </div>
    )
}
