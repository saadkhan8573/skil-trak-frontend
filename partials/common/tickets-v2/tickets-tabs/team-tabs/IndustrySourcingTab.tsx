import { NoData, PageSize, Pagination } from '@components'
import { CommonApi } from '@queries'
import { getUserCredentials } from '@utils'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { EmptyTicket, TAGS, TicketCard } from '../../components'
import { useSelectableList, useTicketListNavigation } from '../../hooks'
import { TicketListSkeleton } from '../../skeleton'
import { SelectAllTicketsCheckbox } from './SelectAllTicketsCheckbox'

export const IndustrySourcingTab = () => {
    const router = useRouter()
    const tab = router.query.tab
    const [itemPerPage, setItemPerPage] = useState(30)

    const { page, setPage, handleTicketClick } = useTicketListNavigation({
        defaultTeamTab: 'industry-sourcing',
    })

    const { data, isLoading, isError } = CommonApi.Teams.useAutomatedTickets({
        search: `status:${
            tab === 'active'
                ? 'assigned'
                : tab === 'inProgress'
                ? 'inProgress'
                : 'resolved'
        },tag:${TAGS.SOURCING_TEAM}`,
        skip: itemPerPage * page - itemPerPage,
        limit: itemPerPage,
    })

    const {
        selectedIds: selectedTicketIds,
        isAllSelected,
        toggleSelectAll,
        toggleSelectOne,
        clearSelection,
    } = useSelectableList(data?.data || [])
    return (
        <>
            <div className="space-y-2">
                {isError && <NoData isError />}
                {isLoading ? (
                    <TicketListSkeleton />
                ) : data?.data?.length > 0 ? (
                    <>
                        <div className="flex justify-between items-center">
                            <PageSize
                                itemPerPage={itemPerPage}
                                setItemPerPage={setItemPerPage}
                                records={data?.data?.length}
                            />
                            <Pagination
                                pagination={data?.pagination}
                                setPage={(newPage: any) => {
                                    setPage(newPage)
                                    router.push(
                                        {
                                            pathname: router.pathname,
                                            query: {
                                                ...router.query,
                                                page: newPage,
                                            },
                                        },
                                        undefined,
                                        { shallow: true }
                                    )
                                }}
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
                                    onClick={() =>
                                        handleTicketClick(ticket?.id)
                                    }
                                    isSelected={selectedTicketIds.includes(
                                        ticket.id
                                    )}
                                    onSelect={toggleSelectOne}
                                />
                            </div>
                        ))}
                    </>
                ) : (
                    !isError && <EmptyTicket />
                )}
            </div>
        </>
    )
}
