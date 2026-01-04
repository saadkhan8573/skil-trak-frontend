import {
    Button,
    EmptyData,
    TechnicalError,
    TextInput,
} from '@components'
import { UserRoles } from '@constants'
import { CommonApi } from '@queries'
import { Student } from '@types'
import { getUserCredentials } from '@utils'
import { Plus, Sparkles, Ticket } from 'lucide-react'
import { useRouter } from 'next/router'
import { TicketCard } from './cards'
import { TicketCounts, TicketFooter } from './components'
import { useCallback, useState } from 'react'
import { debounce } from 'lodash'
import { TicketsTabSkeleton } from '../../skeletonLoader'

export const Tickets = ({ student }: { student: Student }) => {
    const [searchQuery, setSearchQuery] = useState('')
    const tickets = CommonApi.Tickets.useStudentTicketsList(
        { id: student?.id, search: `subject:${searchQuery}` },
        {
            skip: !student?.id,
        }
    )

    const router = useRouter()
    const { role } = getUserCredentials()

    const onAddTicket = () => {
        if (role === UserRoles.ADMIN) {
            router.push(
                `/portals/admin/tickets/add-ticket?student=${student?.id}`
            )
        } else if (role === UserRoles.SUBADMIN) {
            router.push(
                `/portals/sub-admin/tickets/add-ticket?student=${student?.id}`
            )
        } else {
            router.push(
                `/portals/rto/students-and-placements/tickets/add-ticket?student=${student?.id}`
            )
        }
    }

    const delayedSearch = useCallback(
        debounce((value: string) => setSearchQuery(value), 700),
        []
    )

    return (
        <div className="space-y-3">
            {/* Stats Overview */}
            <TicketCounts studentId={student.id} />

            {/* Action Bar */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl p-3">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-lg shadow-[#044866]/20">
                            <Ticket className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-slate-900 text-sm flex items-center gap-2">
                                Support Tickets
                                <Sparkles className="w-5 h-5 text-[#F7A619]" />
                            </h3>
                            <p className="text-xs text-slate-600 mt-1">
                                Manage your support requests and queries
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-72">
                            <TextInput
                                name="search"
                                placeholder="Search Tickets by name"
                                onChange={(e: any) =>
                                    delayedSearch(e.target.value)
                                }
                                showError={false}
                            />
                        </div>

                        <Button
                            onClick={onAddTicket}
                            className="flex-shrink-0 bg-gradient-to-r from-[#044866] to-[#0D5468] hover:from-[#0D5468] hover:to-[#044866] shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            New Ticket
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tickets List */}
            {tickets?.isError ? (
                <TechnicalError
                    height={'50vh'}
                    description={false}
                    imageUrl={'/images/icons/common/ticketError.png'}
                />
            ) : null}
            {tickets?.isLoading ? (
                <TicketsTabSkeleton />
            ) : tickets?.data?.data &&
                tickets?.data?.data?.length > 0 &&
                tickets?.isSuccess ? (
                tickets?.data?.data?.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                ))
            ) : (
                tickets?.isSuccess && <EmptyData height={'50vh'} />
            )}

            {/* Create New Ticket Section */}
            <TicketFooter studentId={student?.id} />
        </div>
    )
}
