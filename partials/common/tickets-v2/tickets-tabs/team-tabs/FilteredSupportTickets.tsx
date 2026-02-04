import { CommonApi } from '@queries'
import React, { useState } from 'react'
import { TicketListSkeleton } from '../../skeleton'
import { NoData, PageSize, Pagination } from '@components'
import { SelectAllTicketsCheckbox } from './SelectAllTicketsCheckbox'
import { useSelectableList } from '../../hooks'
import { EmptyTicket, TicketCard } from '../../components'
import { getUserCredentials } from '@utils'
import { useRouter } from 'next/router'
import { UserRoles } from '@constants'

export const FilteredSupportTickets = ({
    isLoading,
    isError,
    data,
    itemPerPage,
    setItemPerPage,
    setPage,
    page,
}: any) => {
    const {
        selectedIds: selectedTicketIds,
        isAllSelected,
        toggleSelectAll,
        toggleSelectOne,
        clearSelection,
    } = useSelectableList(data?.data || [])
    const router = useRouter()
    const tab = router.query.tab
    const role = getUserCredentials()?.role
    return (
        <>
            {isError && <NoData isError />}
            {isLoading ? (
                <TicketListSkeleton />
            ) : data?.data?.length > 0 ? (
                <>
                    <div
                        className="mb-4 animate-slide-up"
                        style={{ animationDelay: '0.25s' }}
                    ></div>
                    <div className="flex items-center justify-between">
                        <PageSize
                            itemPerPage={itemPerPage}
                            setItemPerPage={setItemPerPage}
                            records={data?.data?.length}
                        />
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
                                onClick={() => {
                                    if (role === UserRoles.RTO) {
                                        router.push(
                                            `/portals/rto/communications/tickets/${ticket?.id}`
                                        )
                                    } else if (role === UserRoles.ADMIN) {
                                        router.push({
                                            pathname: `/portals/admin/support-tickets/${ticket.id}`,
                                            query: router.query,
                                        })
                                    } else if (role === UserRoles.SUBADMIN) {
                                        router.push(
                                            `/portals/sub-admin/support-tickets/${ticket?.id}`
                                        )
                                    }
                                }}
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
        </>
    )
}
