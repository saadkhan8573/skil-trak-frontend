import { Ban, AlertCircle, PhoneOff, Clock } from 'lucide-react'
import { Typography } from '@components'
import { useAppSelector } from '@redux/hooks'
import { UserStatus } from '@types'

export function StudentStatusBanner() {
    const student = useAppSelector((state) => state.student.studentDetail)

    if (!student) return null

    const isBlocked = student?.user?.status === UserStatus.Blocked
    const isFlagged = student?.hasIssue
    const isNonContactable = student?.nonContactable
    const isSnoozed = student?.isSnoozed

    if (!isBlocked && !isFlagged && !isNonContactable && !isSnoozed) return null

    let title = ''
    let description = ''
    let Icon = AlertCircle
    let colorClasses = ''

    if (isBlocked) {
        title = '🚫 Student Blocked'
        description = 'This student is currently blocked from the platform'
        Icon = Ban
        colorClasses = 'bg-gradient-to-r from-[#EF4444] via-[#DC2626] to-[#EF4444]'
    } else if (isFlagged) {
        title = '⚠️ Issue Reported'
        description = 'A profile issue has been flagged for this student'
        Icon = AlertCircle
        colorClasses = 'bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#F59E0B]'
    } else if (isNonContactable) {
        title = '🔇 Non-Contactable'
        description = 'This student has been marked as difficult to reach'
        Icon = PhoneOff
        colorClasses = 'bg-gradient-to-r from-[#6366F1] via-[#4F46E5] to-[#6366F1]'
    } else if (isSnoozed) {
        title = '💤 Student Snoozed'
        const snoozedEndDate = student?.snoozedDate
        description = snoozedEndDate
            ? `Student is snoozed until ${new Date(snoozedEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
            : 'This student is temporarily snoozed'
        Icon = Clock
        colorClasses = 'bg-gradient-to-r from-[#F7A619] via-[#EA580C] to-[#F7A619]'
    }

    return (
        <div className={`relative px-4 py-2 overflow-hidden ${colorClasses} bg-[length:200%_100%] animate-gradient`}>
            {/* Animated Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

            <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <div className="w-6 h-6 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center shadow-2xl border border-white/30">
                            <Icon className="w-3 h-3 text-white" />
                        </div>
                    </div>
                    <div>
                        <Typography variant="title" color={'text-white'} bold>
                            {title}
                        </Typography>
                        <Typography variant="label" color={'text-white/95'}>
                            {description}
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
    )
}
