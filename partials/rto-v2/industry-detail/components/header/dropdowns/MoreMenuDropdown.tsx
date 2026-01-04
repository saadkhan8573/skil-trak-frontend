import { UserRoles } from '@constants'
import { Industry } from '@types'
import { cn } from '@utils'
import {
    Award,
    Eye,
    FileQuestion,
    Image,
    Key,
    MapPin,
    MessageSquare,
    Send,
    Users,
    Utensils,
    Briefcase,
    Ban,
    Unlock,
} from 'lucide-react'
import { UserStatus } from '@types'

interface MoreMenuDropdownProps {
    onClose: () => void
    actions: {
        onEditPassword: () => void
        onSendPassword: () => void
        onViewPassword: () => void
        onPlacementStatus: () => void
        onViewVisitors: () => void
        onViewIndustryAnswers: () => void
        onAddIndustryAnswers: () => void
        onAddRpl: () => void
        onIndustryGallery: () => void
        onSendInfoMessage: () => void
        onServiceOffered: () => void
        onWorkplaceType: () => void
        onStatusChange: () => void
        onBranchLocations: () => void
    }
    role: string | undefined
    industry: Industry
}

export function MoreMenuDropdown({
    onClose,
    actions,
    role,
    industry,
}: MoreMenuDropdownProps) {
    const isIndustryAnswersAvailable =
        industry?.approvalReviewQuestionCount &&
        industry?.approvalReviewQuestionCount > 0

    const securityItems = [
        {
            label: 'Edit Password',
            icon: Key,
            action: actions.onEditPassword,
            color: 'text-[#044866]',
            bg: 'bg-[#044866]/10',
            groupHoverBg: 'group-hover:bg-[#044866]/20',
            show: role === UserRoles.ADMIN,
        },
        {
            label: 'Send Password',
            icon: Send,
            action: actions.onSendPassword,
            color: 'text-[#044866]',
            bg: 'bg-[#044866]/10',
            groupHoverBg: 'group-hover:bg-[#044866]/20',
            show: true,
        },
        {
            label: 'View Password',
            icon: Eye,
            action: actions.onViewPassword,
            color: 'text-[#044866]',
            bg: 'bg-[#044866]/10',
            groupHoverBg: 'group-hover:bg-[#044866]/20',
            show: role === UserRoles.ADMIN,
        },
    ]

    const managementItems = [
        {
            label: 'Placement Status',
            icon: MapPin,
            action: actions.onPlacementStatus,
            color: 'text-[#8B5CF6]',
            bg: 'bg-[#8B5CF6]/10',
            groupHoverBg: 'group-hover:bg-[#8B5CF6]/20',
            show: true,
        },
        {
            label: 'View Visitors',
            icon: Users,
            action: actions.onViewVisitors,
            color: 'text-[#14B8A6]',
            bg: 'bg-[#14B8A6]/10',
            groupHoverBg: 'group-hover:bg-[#14B8A6]/20',
            show: role === UserRoles.ADMIN || role === UserRoles.SUBADMIN,
        },
        {
            label: isIndustryAnswersAvailable
                ? 'View Industry Answers'
                : 'Add Industry Answers',
            icon: FileQuestion,
            action: isIndustryAnswersAvailable
                ? actions.onViewIndustryAnswers
                : actions.onAddIndustryAnswers,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            groupHoverBg: 'group-hover:bg-blue-500/20',
            show: true,
        },
        {
            label: 'Add RPL',
            icon: Award,
            action: actions.onAddRpl,
            color: 'text-[#F7A619]',
            bg: 'bg-[#F7A619]/10',
            groupHoverBg: 'group-hover:bg-[#F7A619]/20',
            show: true,
        },
        {
            label: 'Industry Gallery',
            icon: Image,
            action: actions.onIndustryGallery,
            color: 'text-[#EC4899]',
            bg: 'bg-[#EC4899]/10',
            groupHoverBg: 'group-hover:bg-[#EC4899]/20',
            show: true,
            className: 'rounded-b-lg',
        },
        {
            label: 'Send Info Message',
            icon: MessageSquare,
            action: actions.onSendInfoMessage,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
            groupHoverBg: 'group-hover:bg-orange-500/20',
            show: true,
        },
        {
            label: 'Workplace Type',
            icon: Briefcase,
            action: actions.onWorkplaceType,
            color: 'text-[#3B82F6]',
            bg: 'bg-[#3B82F6]/10',
            groupHoverBg: 'group-hover:bg-[#3B82F6]/20',
            show: true,
        },
        {
            label: 'Service Offered',
            icon: Utensils,
            action: actions.onServiceOffered,
            color: 'text-[#10B981]',
            bg: 'bg-[#10B981]/10',
            groupHoverBg: 'group-hover:bg-[#10B981]/20',
            show: true,
        },
        {
            label: 'Branch Locations',
            icon: MapPin,
            action: actions.onBranchLocations,
            color: 'text-sky-500',
            bg: 'bg-sky-500/10',
            groupHoverBg: 'group-hover:bg-sky-500/20',
            show: true,
        },
        {
            label:
                industry?.user?.status === UserStatus.Blocked
                    ? 'Unblock Industry'
                    : 'Block Industry',
            icon: industry?.user?.status === UserStatus.Blocked ? Unlock : Ban,
            action: actions.onStatusChange,
            color:
                industry?.user?.status === UserStatus.Blocked
                    ? 'text-green-500'
                    : 'text-red-500',
            bg:
                industry?.user?.status === UserStatus.Blocked
                    ? 'bg-green-500/10'
                    : 'bg-red-500/10',
            groupHoverBg:
                industry?.user?.status === UserStatus.Blocked
                    ? 'group-hover:bg-green-500/20'
                    : 'group-hover:bg-red-500/20',
            show: true,
            className: 'rounded-b-lg',
        },
    ]

    const renderMenuItem = (item: any, index: number) => {
        if (!item.show) return null
        const Icon = item.icon

        return (
            <button
                key={index}
                onClick={item.action}
                className={cn(
                    'w-full px-3 py-2 text-left hover:bg-[#F8FAFB] flex items-center gap-2.5 text-[#1A2332] transition-all group',
                    item.className
                )}
            >
                <div
                    className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
                        item.bg,
                        item.groupHoverBg
                    )}
                >
                    <Icon className={cn('w-3.5 h-3.5', item.color)} />
                </div>
                <span className="text-xs font-medium">{item.label}</span>
            </button>
        )
    }

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border border-[#E2E8F0] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2 border-b border-[#E2E8F0]">
                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wide">
                        Security
                    </p>
                </div>
                {securityItems.map(renderMenuItem)}

                <div className="px-3 py-2 border-b border-t border-[#E2E8F0] mt-1">
                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wide">
                        Management
                    </p>
                </div>
                {managementItems.map(renderMenuItem)}
            </div>
        </>
    )
}
