import { Button } from '@components/buttons'
import { useAppSelector } from '@redux/hooks'
import { Clock, Edit2, Star } from 'lucide-react'
import moment from 'moment'
import { useState } from 'react'
import { PreferredContactTime } from './components'
import { ExtendStudentExpiryDialog } from './modals'

// Function 1: Calculate time remaining from expiry date using moment
const calculateTimeRemaining = (expiryDate?: Date | string | null) => {
    if (!expiryDate || expiryDate === 'undefined' || expiryDate === 'null') {
        return {
            isExpired: false,
            days: 0,
            hours: 0,
            minutes: 0,
            totalDays: 0,
            formattedTime: 'N/A',
            formattedDate: 'N/A',
        }
    }

    const now = moment()
    const expiry = moment(expiryDate)
    const duration = moment.duration(expiry.diff(now))

    // If expired
    if (!expiry.isValid() || duration.asMilliseconds() <= 0) {
        return {
            isExpired: true,
            days: 0,
            hours: 0,
            minutes: 0,
            totalDays: 0,
            formattedTime: 'Expired',
            formattedDate: expiry.isValid()
                ? expiry.format('MMMM D, YYYY')
                : 'Invalid Date',
        }
    }

    // Calculate time components
    const days = Math.floor(duration.asDays())
    const hours = duration.hours()
    const minutes = duration.minutes()
    const totalDays = Math.ceil(duration.asDays())

    return {
        isExpired: false,
        days,
        hours,
        minutes,
        totalDays,
        formattedTime: `${days}d, ${hours}h`,
        formattedDate: expiry.format('MMMM D, YYYY'),
    }
}

// Function 2: Determine student status based on time remaining
const getStudentStatus = (expiryDate?: Date | string | null) => {
    const timeRemaining = calculateTimeRemaining(expiryDate)

    if (timeRemaining.isExpired) {
        return {
            status: 'Expired',
            color: '#DC2626', // red
            bgColor: '#FEE2E2',
            icon: 'AlertCircle',
            message: 'Course deadline has passed',
        }
    }

    // Less than 7 days
    if (timeRemaining.totalDays <= 7) {
        return {
            status: 'Urgent',
            color: '#DC2626', // red
            bgColor: '#FEE2E2',
            icon: 'AlertTriangle',
            message: 'Deadline approaching soon',
        }
    }

    // Less than 30 days
    if (timeRemaining.totalDays <= 30) {
        return {
            status: 'Warning',
            color: '#F59E0B', // amber
            bgColor: '#FEF3C7',
            icon: 'Clock',
            message: 'Complete soon to stay on track',
        }
    }

    // More than 30 days
    return {
        status: 'On Track',
        color: '#044866',
        bgColor: '#DCFCE7',
        icon: 'CheckCircle',
        message: 'You have plenty of time',
    }
}

export const StudentTimeline = () => {
    const { studentDetail } = useAppSelector((state) => state?.student)
    const [isExtendModalOpen, setIsExtendModalOpen] = useState(false)

    // Get expiry date from student detail
    const expiryDate = studentDetail?.expiryDate

    // Calculate time remaining
    const timeInfo = calculateTimeRemaining(expiryDate)
    const statusInfo = getStudentStatus(expiryDate)

    return (
        <div className="rounded-lg bg-linear-to-r from-[#044866]/5 via-[#0D5468]/5 to-transparent border border-[#044866]/20 p-3.5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg"
                            style={{
                                background: `linear-gradient(to bottom right, ${statusInfo.color}, ${statusInfo.color}dd)`,
                                boxShadow: `0 10px 15px -3px ${statusInfo.color}40`,
                            }}
                        >
                            <Clock className="w-4 h-4 text-white" />
                        </div>
                        {!timeInfo.isExpired && timeInfo.totalDays <= 30 && (
                            <div
                                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-ping"
                                style={{ backgroundColor: statusInfo.color }}
                            ></div>
                        )}
                    </div>
                    <div>
                        <p className="text-slate-900 mb-0.5">
                            {timeInfo.isExpired ? (
                                <>
                                    <span
                                        className="font-medium"
                                        style={{ color: statusInfo.color }}
                                    >
                                        Expired
                                    </span>{' '}
                                    on {timeInfo.formattedDate}
                                </>
                            ) : (
                                <>
                                    Time Remaining:{' '}
                                    <span
                                        className="font-medium"
                                        style={{ color: statusInfo.color }}
                                    >
                                        {timeInfo.formattedTime}
                                    </span>{' '}
                                    until {timeInfo.formattedDate}
                                </>
                            )}
                        </p>
                        <p className="text-sm text-slate-600">
                            Course completion deadline
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className="flex items-center gap-2 px-4 py-2 rounded shadow-sm border"
                        style={{
                            backgroundColor: statusInfo.bgColor,
                            borderColor: `${statusInfo.color}33`,
                        }}
                    >
                        <Star
                            className="w-3.5 h-3.5"
                            style={{
                                color: statusInfo.color,
                                fill: statusInfo.color,
                            }}
                        />
                        <span
                            className="text-sm font-medium"
                            style={{ color: statusInfo.color }}
                        >
                            {statusInfo.status}
                        </span>
                    </div>

                    {/* Extend Deadline Button */}
                    <Button
                        variant="primaryNew"
                        outline
                        onClick={() => setIsExtendModalOpen(true)}
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>

            {/* Old Expiry and New Expiry Display */}
            {studentDetail?.oldExpiry && (
                <div className="mt-2 pt-2 border-t border-[#044866]/10 flex gap-2">
                    <div className="flex-1 bg-slate-100 rounded-md p-2">
                        <p className="text-[10px] text-slate-600 mb-0.5">
                            Original Deadline
                        </p>
                        <p className="text-xs font-semibold text-slate-900">
                            {moment(studentDetail.oldExpiry).format(
                                'MMM D, YYYY'
                            )}
                        </p>
                    </div>
                    <div className="flex-1 bg-linear-to-br from-emerald-50 to-emerald-100/50 rounded-md p-2 border border-emerald-200/50">
                        <p className="text-[10px] text-emerald-700 mb-0.5">
                            Extended To
                        </p>
                        <p className="text-xs font-semibold text-emerald-900">
                            {expiryDate
                                ? moment(expiryDate).format('MMM D, YYYY')
                                : 'N/A'}
                        </p>
                    </div>
                </div>
            )}

            {/* Extend Expiry Modal */}
            <ExtendStudentExpiryDialog
                open={isExtendModalOpen}
                onOpenChange={setIsExtendModalOpen}
                studentId={studentDetail?.user?.id}
                currentExpiryDate={
                    expiryDate ? new Date(expiryDate).toISOString() : ''
                }
            />
        </div>
    )
}
