import React from 'react'
import { RtoApprovalWorkplaceRequest } from '@types'
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { RtoV2Api } from '@queries'

export const PlacementRequestStatusAlert = ({
    approval,
}: {
    approval: RtoApprovalWorkplaceRequest
}) => {
    // Check if RTO checklist file exists
    const courseId = Number(approval?.workplaceRequest?.courses?.[0]?.id)
    const studentId = Number(approval?.student?.id)
    const industryUserId = Number(approval?.industry?.user?.id)

    const getRtoCourseChecklist =
        RtoV2Api.ApprovalRequest.getRtoCourseChecklist(
            { courseId, studentId, industryUserId },
            {
                skip: !courseId || !studentId || !industryUserId,
            }
        )

    const file =
        getRtoCourseChecklist?.data?.url ||
        getRtoCourseChecklist?.data?.studentResponse?.[0]?.files?.[0]?.file ||
        getRtoCourseChecklist?.data?.files?.[0]

    const hasFile = !!file

    const statusConfig = {
        pending: {
            border: 'border-[#F7A619]',
            bg: 'bg-gradient-to-r from-[#F7A619]/10 to-amber-50',
            iconBg: 'bg-[#F7A619]',
            shadow: 'shadow-[#F7A619]/30',
            icon: Clock,
            iconClass: 'animate-pulse',
            text: 'text-slate-900',
            title: 'Action Required:',
            titleColor: 'text-[#044866]',
            message:
                'Review all workplace information and make your approval decision below.',
        },
        approved: {
            border: 'border-emerald-500',
            bg: 'bg-gradient-to-r from-emerald-50 to-emerald-100/50',
            iconBg: 'bg-emerald-500',
            shadow: 'shadow-emerald-500/30',
            icon: CheckCircle2,
            iconClass: '',
            text: 'text-emerald-900',
            title: 'Workplace Approved:',
            titleColor: '',
            message:
                'This placement will proceed to Industry Confirmation for final acceptance.',
        },
        rejected: {
            border: 'border-red-500',
            bg: 'bg-gradient-to-r from-red-50 to-red-100/50',
            iconBg: 'bg-red-500',
            shadow: 'shadow-red-500/30',
            icon: AlertCircle,
            iconClass: '',
            text: 'text-red-900',
            title: 'Workplace Rejected:',
            titleColor: '',
            message:
                'SkilTrak has been notified and will search for an alternative placement option.',
        },
        incomplete: {
            border: 'border-blue-500',
            bg: 'bg-gradient-to-r from-blue-50 to-blue-100/50',
            iconBg: 'bg-blue-500',
            shadow: 'shadow-blue-500/30',
            icon: AlertCircle,
            iconClass: '',
            text: 'text-blue-900',
            title: 'Schedule 4 Incomplete:',
            titleColor: 'text-blue-700',
            message:
                'RTO Facility Checklist (Schedule 4) is not completed yet. Approval cannot proceed until this is completed.',
        },
    }

    // Determine which status to show: if no file and status is pending, show incomplete
    let statusToShow: 'pending' | 'approved' | 'rejected' | 'incomplete' =
        approval?.rtoApprovalStatus
    if (
        !hasFile &&
        !getRtoCourseChecklist?.isLoading &&
        statusToShow === 'pending'
    ) {
        statusToShow = 'incomplete'
    }

    const config = statusConfig[statusToShow]
    if (!config) return null

    const Icon = config.icon

    return (
        <div className="container mx-auto px-4 md:px-6 animate-fade-in">
            <div
                className={`px-2 rounded-md border-2 ${config.border} ${config.bg} shadow-md py-3`}
            >
                <div className="flex items-center gap-3">
                    <div
                        className={`w-8 h-8 ${config.iconBg} rounded-full flex items-center justify-center flex-shrink-0 ${config.iconClass} shadow-lg ${config.shadow}`}
                    >
                        <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className={`text-sm ${config.text}`}>
                            <strong className={config.titleColor}>
                                {config.title}
                            </strong>{' '}
                            {config.message}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
