import { Badge, WorldwideStudentDataRestriction } from '@components'
import { workplaceQuestionsKeys } from '@partials/common'
import { RtoV2Api, SubAdminApi, useAppSelector } from '@redux'
import { Bell, BellOff, Calendar, Heart, Star } from 'lucide-react'
import moment from 'moment'

export const StudentOnTrackDetails = () => {
    const studentId = useAppSelector(
        (state) => state.student?.studentDetail?.id
    )
    const rtoDetail = useAppSelector((state) => state.rto.rtoDetail)

    const { data } = SubAdminApi.Student.useStudentPreferredCallTime(
        studentId!,
        {
            skip: !studentId,
        }
    )

    const trackStudentCount = RtoV2Api.Students.studentOnTrackCounts(
        studentId!,
        {
            skip: !studentId,
        }
    )

    const getQuestionData = (type: workplaceQuestionsKeys) =>
        data?.find((d) => d?.type === type)

    const medicalCondition = getQuestionData(
        workplaceQuestionsKeys?.medicalCondition
    )
    const time = getQuestionData(workplaceQuestionsKeys?.preferredContactTime)

    const formatCallTime = (time: string | undefined) => {
        if (!time) return null

        try {
            const parsed = JSON.parse(time)
            if (parsed && typeof parsed === 'object') {
                const days = Array.isArray(parsed.days)
                    ? parsed.days.join(', ')
                    : ''
                const slot = parsed.timeSlot || ''
                if (days || slot) {
                    const label = [days, slot].filter(Boolean).join(', ')
                    return { label, badge: label }
                }
            }
        } catch (e) {
            // Not a JSON string, proceed with normal logic
        }

        // Handle different time formats
        const timeStr = time.toLowerCase().trim()

        // Map common patterns to user-friendly text
        const timePatterns: Record<string, { label: string; badge: string }> = {
            morning: { label: 'Morning (8AM - 12PM)', badge: 'Morning' },
            afternoon: { label: 'Afternoon (12PM - 5PM)', badge: 'Afternoon' },
            evening: { label: 'Evening (5PM - 8PM)', badge: 'Evening' },
            anytime: { label: 'Anytime', badge: 'Flexible' },
            weekday: { label: 'Weekdays Only', badge: 'Weekdays' },
            weekend: { label: 'Weekends Only', badge: 'Weekends' },
        }

        // Check for pattern matches
        for (const [key, value] of Object.entries(timePatterns)) {
            if (timeStr.includes(key)) {
                return value
            }
        }

        // Default: return the original time
        return { label: time, badge: time }
    }

    const preferredContactTime = formatCallTime(time?.answer)
    return (
        <div className="mt-3 rounded-xl bg-white/80 backdrop-blur-sm border border-[#044866]/20 p-2.5 shadow-sm">
            <div className="flex items-center justify-between">
                {/* Left: Header */}
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-sm">
                        <Star className="w-3.5 h-3.5 text-white fill-white" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-900">
                            On Track Details
                        </p>
                        <p className="text-xs text-slate-600">
                            Student status and contact information
                        </p>
                    </div>
                </div>

                {/* Right: Summary Badges */}
                <div className="flex items-center gap-2">
                    <Badge variant="primary">Responsive</Badge>
                    <Badge variant="primaryNew" outline>
                        Calls: {trackStudentCount?.data?.callLogs}
                    </Badge>
                    <Badge variant="primaryNew" outline>
                        Emails: {trackStudentCount?.data?.emails}
                    </Badge>
                    <Badge variant="primaryNew" outline>
                        Notes: {trackStudentCount?.data?.notes}
                    </Badge>
                    <Badge variant="primaryNew" outline>
                        Snoozes: {trackStudentCount?.data?.snoozeComments}
                    </Badge>
                </div>
            </div>

            {/* Compact Info Grid */}
            <div className="grid grid-cols-4 gap-2 mt-2.5">
                {/* Medical Condition */}
                <WorldwideStudentDataRestriction
                    anotherUserId={Number(rtoDetail?.user?.id)}
                    fallbackOptions={{
                        height: '40px',
                        width: '100%',
                    }}
                >
                    {' '}
                    <div className="rounded-lg bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200/60 px-2 py-1.5">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <Heart className="w-3 h-3 text-rose-600" />
                            <p className="text-xs text-rose-700">Medical</p>
                        </div>
                        <p className="text-xs text-slate-700">
                            {medicalCondition?.answer}
                        </p>
                    </div>
                </WorldwideStudentDataRestriction>

                {/* Preferred Contact Time */}
                <WorldwideStudentDataRestriction
                    anotherUserId={Number(rtoDetail?.user?.id)}
                    fallbackOptions={{
                        height: '40px',
                        width: '100%',
                    }}
                >
                    <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/60 px-2 py-1.5">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <Calendar className="w-3 h-3 text-emerald-600" />
                            <p className="text-xs text-emerald-700">
                                Contact Time
                            </p>
                        </div>
                        <p className="text-xs text-slate-700">
                            {' '}
                            {preferredContactTime?.badge}
                        </p>
                    </div>
                </WorldwideStudentDataRestriction>

                {/* Snoozed History */}
                <div className="rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 px-2 py-1.5">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <Bell className="w-3 h-3 text-amber-600" />
                        <p className="text-xs text-amber-700">Last Snooze</p>
                    </div>
                    <p className="text-xs text-slate-700">
                        {trackStudentCount?.data?.lastSnoozeDate
                            ? moment(
                                  trackStudentCount?.data?.lastSnoozeDate
                              ).format('DD/MM/YYYY')
                            : 'N/A'}
                    </p>
                </div>

                {/* Not Contactable History */}
                <div className="rounded-lg bg-gradient-to-br from-red-50 to-rose-50 border border-red-200/60 px-2 py-1.5">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <BellOff className="w-3 h-3 text-red-600" />
                        <p className="text-xs text-red-700">
                            Last Contactable Date
                        </p>
                    </div>
                    <p className="text-xs text-slate-700">
                        {trackStudentCount?.data?.lastFailedCallDate
                            ? moment(
                                  trackStudentCount?.data?.lastFailedCallDate
                              ).format('DD/MM/YYYY')
                            : 'N/A'}
                    </p>
                </div>
            </div>
        </div>
    )
}
