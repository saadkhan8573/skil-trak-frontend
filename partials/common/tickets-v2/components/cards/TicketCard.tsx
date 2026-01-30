import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@components/ui/tooltip'
import { getUserCredentials } from '@utils'
import {
    ArrowRight,
    Building2,
    Clock,
    ExternalLink,
    RefreshCw,
    User,
} from 'lucide-react'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { memo } from 'react'
import { getDetailedTimeStuck, getProfileUrl } from '../ticket-details/helper'
import { Ticket } from './types'

interface TicketCardProps {
    ticket: Ticket
    onClick: () => void
    onViewStudentProfile?: (studentId: string) => void
    onViewIndustryProfile?: (industryId: string) => void
    isSelected: boolean
    onSelect: (ticketId: number, checked: boolean) => void
}

const priorityStyles: any = {
    LOW: 'bg-slate-50 text-slate-600 border-slate-200',
    MEDIUM: 'bg-blue-50 text-blue-600 border-blue-200',
    HIGH: 'bg-[#F7A619]/10 text-[#F7A619]/90 border-[#F7A619]/20',
    CRITICAL: 'bg-red-50 text-red-600 border-red-200',
}

const statusColors = {
    open: 'bg-red-500',
    inProgress: 'bg-[#0D5468]',
    pending: 'bg-[#F7A619]',
    resolved: 'bg-green-500',
    assigned: 'bg-red-500',
}

const statusLabels = {
    open: 'Open',
    inProgress: 'In Progress',
    pending: 'Pending',
    resolved: 'Resolved',
    assigned: 'Assigned',
}

const teamStyles = {
    'student-services': 'bg-[#044866]',
    'industry-sourcing': 'bg-[#0D5468]',
    rto: 'bg-[#044866]/90',
    qa: 'bg-[#0D5468]/90',
}

const teamLabels: Record<string, string> = {
    'student services': 'Student Services',
    'sourcing team': 'Industry Sourcing',
    'rto team': 'RTO Team',
    'qa team': 'QA Team',
}

const TicketCardComponent = ({
    ticket,
    onClick,
    onViewStudentProfile,
    onViewIndustryProfile,
    onSelect,
    isSelected,
}: TicketCardProps) => {
    const timeAgo = getTimeAgo(ticket?.createdAt)

    // Check if ticket is over 2 days old
    const createdDate = new Date(ticket?.createdAt)
    const now = new Date()
    const diffDays =
        (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    const isOverTwoDays = diffDays > 2 && ticket.status !== 'resolved'

    // Helper to get industry ID from industry name
    const getIndustryId = (
        industryName: string | undefined
    ): string | undefined => {
        if (!industryName) return undefined
        const industryMap: Record<string, string> = {
            'TechCorp Solutions': 'IND-001',
            'Global Industries Ltd': 'IND-002',
            'Marketing Pro Agency': 'IND-003',
            'City Hospital': 'IND-004',
        }
        return industryMap[ticket?.user?.name]
    }

    const handleProfileClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (ticket.team === 'industry-sourcing' && ticket?.user?.name) {
            const industryId = getIndustryId(ticket?.user?.name)
            if (industryId && onViewIndustryProfile) {
                onViewIndustryProfile(industryId)
            }
        } else if (onViewStudentProfile) {
            // onViewStudentProfile(ticket.studentId)
            console.log('profile view')
        }
    }
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation()
        onSelect(ticket.id, e.target.checked)
    }
    const router = useRouter()
    const role = getUserCredentials().role
    const profileUrl = getProfileUrl({
        role,
        origin: ticket?.origin,
        studentId: ticket?.user?.student?.id,
        industryId: ticket?.user?.industry?.id,
    })

    return (
        <div
            onClick={onClick}
            className={`
        group cursor-pointer bg-white rounded-lg px-3 py-2
        transition-all duration-300 hover:shadow-lg hover:shadow-[#044866]/10
        border hover:border-[#F7A619]/30
        ${ticket.status === 'resolved' ? 'opacity-60 border-green-200' : ''}
        ${
            ticket?.severity === 'CRITICAL'
                ? 'border-red-200 shadow-sm shadow-red-50'
                : 'border-gray-200'
        }
        ${isOverTwoDays ? 'animate-flash-red' : ''}
        relative overflow-hidden
      `}
        >
            {/* Decorative left border */}
            <div
                className={`absolute left-0 top-0 bottom-0 w-1 ${
                    isOverTwoDays
                        ? 'bg-red-500 animate-pulse'
                        : ticket?.severity === 'CRITICAL'
                          ? 'bg-red-400'
                          : ticket?.severity === 'HIGH'
                            ? 'bg-[#F7A619]'
                            : ticket?.severity === 'MEDIUM'
                              ? 'bg-blue-600'
                              : ticket?.severity === 'LOW'
                                ? 'bg-green-600'
                                : 'bg-[#044866]'
                }`}
            ></div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 `bg-gradient-to-r` from-[#F7A619]/3 to-[#0D5468]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>

            {/* Single Line Layout */}
            <div className="relative z-10 flex items-center gap-4">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={handleCheckboxChange}
                    onClick={(e) => e.stopPropagation()}
                    className="h-4 w-4 accent-[#044866]"
                />
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="relative `flex-shrink-0`">
                                <div
                                    className={`w-2 h-2 rounded-full ${
                                        statusColors[ticket?.status]
                                    }`}
                                />
                                {ticket?.status === 'assigned' && (
                                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-red-500 animate-ping opacity-75"></div>
                                )}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            {ticket?.status ?? 'Status of the ticket here'}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {/* Ticket ID */}
                <span className="text-[#044866] text-xs w-20 `flex-shrink-0`">
                    TKT-{ticket?.id}
                </span>
                <span
                    className={`px-2 py-0.5  ${
                        statusColors[ticket?.status]
                    } text-white rounded text-[10px]`}
                >
                    {ticket?.status === 'assigned'
                        ? 'Opened'
                        : ticket?.status === 'inProgress'
                          ? 'In Progress'
                          : 'Resolved'}
                </span>

                {/* Badges */}
                <div className="flex items-center gap-1.5 `flex-shrink-0`">
                    {isOverTwoDays && (
                        <span className="px-2 py-0.5 bg-red-500 text-white rounded text-[10px] animate-pulse">
                            {getDetailedTimeStuck(ticket?.createdAt)}
                        </span>
                    )}
                    <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                            ticket?.severity
                                ? priorityStyles[ticket?.severity]
                                : 'bg-gray-200 text-gray-600 border-gray-200'
                        }`}
                    >
                        {ticket?.severity || '---'}
                    </span>
                </div>

                {/* Title */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-[#044866] text-xs group-hover:text-[#0D5468] transition-colors truncate">
                        {ticket.title}
                    </h3>
                </div>

                {/* Student/Industry Info - conditionally render based on team */}
                {ticket?.origin === 'INDUSTRY' ? (
                    <Link
                        href={profileUrl}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 w-36 `flex-shrink-0` hover:bg-[#F7A619]/5 rounded px-1 -mx-1 py-0.5 transition-colors group/profile"
                        title="View industry profile"
                    >
                        <div className="w-5 h-5 bg-[#F7A619] rounded-full flex items-center justify-center">
                            <Building2 className="w-2.5 h-2.5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-[#044866] text-[10px] truncate flex items-center gap-1">
                                <span>{ticket?.user?.name || 'Industry'}</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover/profile:opacity-100 transition-opacity" />
                            </div>
                            <div className="text-[#0D5468]/60 text-[9px] truncate">
                                {ticket.industryType || ticket.studentId}
                            </div>
                        </div>
                    </Link>
                ) : (
                    <Link
                        href={profileUrl}
                        className="flex items-center gap-2 w-36 `flex-shrink-0` hover:bg-[#044866]/5 rounded px-1 -mx-1 py-0.5 transition-colors group/profile"
                        title="View student profile"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-5 h-5 bg-[#044866] rounded-full flex items-center justify-center">
                            <User className="w-2.5 h-2.5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-[#044866] text-[10px] truncate flex items-center gap-1">
                                <span>{ticket?.user?.name}</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover/profile:opacity-100 transition-opacity" />
                            </div>
                            <div className="text-[#0D5468]/60 text-[9px] truncate">
                                {ticket?.user?.student?.studentId}
                            </div>
                        </div>
                    </Link>
                )}

                {/* Time */}
                <div className="flex items-center gap-1 text-[10px] text-[#0D5468]/70 w-16 `flex-shrink-0`">
                    <Clock className="w-3 h-3" />
                    <span>{getDetailedTimeStuck(ticket?.createdAt)}</span>
                </div>
                {router.query.tab === 'resolved' && (
                    <div className="flex items-center gap-1 text-[10px] text-[#0D5468]/70 w-16 `flex-shrink-0`">
                        <RefreshCw className="w-3 h-3" />
                        <span>{moment(ticket?.updatedAt).fromNow()}</span>
                    </div>
                )}

                {/* Team */}
                <div className="flex gap-1 flex-wrap">
                    {ticket?.supportTeam?.tags?.map((tag: any) => (
                        <span
                            key={tag}
                            className={`px-2 py-0.5  bg-gray-400
                         text-white rounded text-[10px] truncate`}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Assignee */}
                <div className="w-24 `flex-shrink-0` text-right">
                    <span className="text-[#044866] text-[10px] truncate block">
                        {ticket?.assignedTo?.user?.name ?? '---'}
                    </span>
                </div>

                {/* Arrow */}
                <ArrowRight className="w-3.5 h-3.5 text-[#F7A619] opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 `flex-shrink-0`" />
            </div>
        </div>
    )
}

export const TicketCard = memo(TicketCardComponent)

function getTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
}
