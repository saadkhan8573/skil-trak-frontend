import { ActionButton, Badge } from '@components'
import { UrgencyLevel } from '@partials/admin/rto/message-center/enum'
import { RtoV2Api } from '@queries'
import {
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Info,
    Megaphone,
} from 'lucide-react'
import moment from 'moment'
import { useState } from 'react'

interface AdminMessageProps {
    studentUserId: number
}

export const StudentInfoMessage = ({ studentUserId }: AdminMessageProps) => {
    const [isExpanded, setIsExpanded] = useState(false)

    const infoMessages = RtoV2Api.Students.getStudentInfoMessages(
        { userId: studentUserId },
        {
            skip: !studentUserId,
        }
    )

    const config = {
        [UrgencyLevel.URGENT]: {
            bgColor: 'bg-primary-light/50',
            borderColor: 'border-destructive/30',
            icon: AlertTriangle,
            iconColor: 'text-white',
            iconBg: 'bg-gradient-to-br from-destructive to-red-600',
            badgeClass:
                'bg-gradient-to-r from-destructive to-red-600 text-white animate-pulse shadow-lg',
            badgeText: 'URGENT',
            accentColor: 'text-destructive',
        },
        [UrgencyLevel.HIGH]: {
            bgColor:
                'bg-gradient-to-r from-warning/10 via-accent/5 to-warning/10',
            borderColor: 'border-warning/30',
            icon: AlertTriangle,
            iconColor: 'text-white',
            iconBg: 'bg-gradient-to-br from-warning to-accent',
            badgeClass:
                'bg-gradient-to-r from-warning to-accent text-white shadow-md',
            badgeText: 'Important',
            accentColor: 'text-warning',
        },
        [UrgencyLevel.MEDIUM]: {
            bgColor:
                'bg-gradient-to-r from-success/10 via-emerald-500/5 to-success/10',
            borderColor: 'border-success/30',
            icon: CheckCircle2,
            iconColor: 'text-white',
            iconBg: 'bg-gradient-to-br from-success to-emerald-500',
            badgeClass:
                'bg-gradient-to-r from-success to-emerald-500 text-white shadow-md',
            badgeText: 'Update',
            accentColor: 'text-success',
        },
        [UrgencyLevel.LOW]: {
            bgColor:
                'bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10',
            borderColor: 'border-primary/30',
            icon: Info,
            iconColor: 'text-white',
            iconBg: 'bg-gradient-to-br from-primary to-secondary',
            badgeClass:
                'bg-gradient-to-r from-primary to-secondary text-white shadow-md',
            badgeText: 'Info',
            accentColor: 'text-primary',
        },
    }

    if (infoMessages?.isSuccess && infoMessages?.data) {
        const currentConfig =
            config[infoMessages?.data?.urgencyLevel as UrgencyLevel]
        return (
            <div
                className={`border ${currentConfig.borderColor} ${currentConfig.bgColor} rounded-2xl shadow-premium-lg overflow-hidden animate-scale-in backdrop-blur-sm relative hover-lift`}
            >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>

                {/* Compact Header - Always Visible */}
                <div className="flex items-center gap-3 p-4 relative">
                    {/* Icon */}
                    <div className="relative shrink-0">
                        <div
                            className={`absolute inset-0 bg-primary rounded-xl blur opacity-30`}
                        ></div>
                        <div
                            className={`relative h-10 w-10 rounded-xl flex items-center justify-center bg-primary shadow-premium`}
                        >
                            <Info
                                className={`h-5 w-5 text-white`}
                                strokeWidth={2.5}
                            />
                        </div>
                    </div>

                    {/* Title & Badge - Clickable to expand */}
                    <div
                        className="flex-1 min-w-0 flex items-center gap-2.5 flex-wrap cursor-pointer"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <span className="font-bold truncate text-sm">
                            {infoMessages?.data?.title}
                        </span>

                        <Badge
                            // className={`${currentConfig.badgeClass} border-0 shadow-premium text-xs h-5 px-2.5 font-semibold`}
                            className="animate-pulse bg-red-600! text-white"
                            text={currentConfig.badgeText}
                        />
                    </div>

                    {/* Metadata - Desktop only - Clickable to expand */}
                    <div
                        className="hidden md:flex items-center gap-3 text-xs text-muted-foreground cursor-pointer"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <div className="flex items-center gap-1.5">
                            <Megaphone className="h-3 w-3" />
                            <span>{infoMessages?.data?.senderName}</span>
                        </div>
                        {infoMessages?.data?.createdAt && (
                            <>
                                <span>•</span>
                                <span>
                                    {moment(
                                        infoMessages?.data?.createdAt
                                    ).fromNow()}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        <ActionButton
                            simple
                            variant="light"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </ActionButton>
                    </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                    <div className="border-t px-4 py-3 space-y-2 animate-fade-in">
                        <p className="text-xs text-foreground/90 leading-relaxed">
                            {infoMessages?.data?.message}
                        </p>

                        {/* Metadata - Mobile only */}
                        <div className="md:hidden flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Megaphone className="h-3 w-3" />
                                <span>{infoMessages?.data?.senderName}</span>
                            </div>
                            {infoMessages?.data?.createdAt && (
                                <>
                                    <span>•</span>
                                    <span>
                                        {moment(
                                            infoMessages?.data?.createdAt
                                        ).fromNow()}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )
    }
    return <></>
}
