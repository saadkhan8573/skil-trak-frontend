import { CommonApi } from '@queries'
import { getUserCredentials } from '@utils'
import { UserRoles } from '@constants'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import {
    MainContentCard,
    QuickActionsBar,
    TicketDetailsSkeleton,
    UserTicketInfoCard,
} from './components'
import { Ticket } from './components/cards/types'

interface TicketDetailsProps {
    ticket: any
    onClose?: () => void
    onUpdate?: (ticket: Ticket) => void
    onResolve?: (ticketId: string, resolution: string) => void
    onViewStudentProfile?: (studentId: string) => void
    onViewIndustryProfile?: (industryId: string) => void
}

export const TicketDetails = () => {
    const router = useRouter()
    const tickedId = router.query.id
    const role = getUserCredentials()?.role

    const { data, isLoading } = CommonApi.Teams.useAutomatedTicketDetails(
        tickedId,
        {
            skip: !tickedId,
        }
    )

    // const handleBack = () => {
    //     const savedState = sessionStorage.getItem('ticketListState')

    //     let basePath = ''
    //     if (role === UserRoles.RTO) {
    //         basePath = '/portals/rto/communications/tickets'
    //     } else if (role === UserRoles.ADMIN) {
    //         basePath = '/portals/admin/support-tickets'
    //     } else if (role === UserRoles.SUBADMIN) {
    //         basePath = '/portals/sub-admin/support-tickets'
    //     }

    //     if (savedState) {
    //         const { tab, teamTab, page } = JSON.parse(savedState)
    //         router.push({
    //             pathname: basePath,
    //             query: {
    //                 tab: tab || 'active',
    //                 teamTab: teamTab || 'all', // Restore team tab
    //                 page: page || '1',
    //             },
    //         })
    //         sessionStorage.removeItem('ticketListState')
    //     } else {
    //         router.back()
    //     }
    // }
    const handleBack = () => {
        let basePath = ''

        if (role === UserRoles.RTO) {
            basePath = '/portals/rto/communications/tickets'
        } else if (role === UserRoles.ADMIN) {
            basePath = '/portals/admin/support-tickets'
        } else if (role === UserRoles.SUBADMIN) {
            basePath = '/portals/sub-admin/support-tickets'
        }

        router.push({
            pathname: basePath,
            query: router.query, // 👈 restores ALL filters, page, tabs
        })
    }

    return (
        <div className="min-h-screen `bg-gradient-to-br` from-slate-50 to-gray-100 animate-fade-in py-6">
            {isLoading ? (
                <TicketDetailsSkeleton />
            ) : (
                <div className="w-full mx-auto px-4 sm:px-6">
                    {/* Top Bar */}
                    <div className="mb-4">
                        <button
                            onClick={handleBack}
                            className="group inline-flex items-center gap-2 px-4 py-2 bg-white text-[#044866] rounded-lg hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-[#044866]/30"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm">Back to Dashboard</span>
                        </button>
                    </div>

                    {/* Quick Actions Bar - Dropdown Style */}
                    <QuickActionsBar ticket={data} />

                    {/* Hero Header */}
                    <UserTicketInfoCard ticket={data} />

                    {/* Main Content */}
                    <MainContentCard ticket={data} />
                </div>
            )}
        </div>
    )
}
