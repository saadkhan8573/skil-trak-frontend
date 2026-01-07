import { CommonApi } from '@queries'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/router'
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
    const { data, isLoading } = CommonApi.Teams.useAutomatedTicketDetails(
        tickedId,
        {
            skip: !tickedId,
        }
    )
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 animate-fade-in py-6">
            {isLoading ? (
                <TicketDetailsSkeleton />
            ) : (
                <div className="w-full mx-auto px-4 sm:px-6">
                    {/* Top Bar */}
                    <div className="mb-4">
                        {/* <button
                            // onClick={onClose}
                            className="group inline-flex items-center gap-2 px-4 py-2 bg-white text-[#044866] rounded-lg hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-[#044866]/30"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm">Back to Dashboard</span>
                        </button> */}
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
