import { SubAdminApi, useAppSelector } from '@redux'
import { Clock } from 'lucide-react'

export const PreferredContactTime = () => {
    const studentId = useAppSelector(
        (state) => state.student?.studentDetail?.id
    )

    const { data, isLoading } = SubAdminApi.Student.useStudentPreferredCallTime(
        studentId!,
        {
            skip: !studentId,
        }
    )

    const formatCallTime = (time: string | undefined) => {
        if (!time) return null

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

    const callTimeInfo = formatCallTime(data?.answer)

    return (
        <div className="flex items-center gap-3">
            {/* Medical Conditions Card */}
            <div className="flex items-center gap-2.5 bg-linear-to-br from-rose-50 to-rose-100/50 border border-rose-200/70 px-3.5 py-2.5 rounded-xl shadow-sm flex-1">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-rose-100 to-rose-200/50 flex items-center justify-center shrink-0">
                    <span className="text-lg">🩺</span>
                </div>
                <div className="flex-1">
                    <p className="text-[10px] font-semibold text-rose-600 uppercase tracking-wide mb-0.5">
                        Medical Conditions
                    </p>
                    <p className="text-sm text-rose-700 font-medium">
                        Diabetes Type 2, Asthma
                    </p>
                </div>
            </div>

            {/* Contact Time Card */}
            <div className="flex items-center gap-2.5 bg-linear-to-br from-[#044866]/5 to-[#0D5468]/5 border border-[#044866]/30 px-3.5 py-2.5 rounded-xl shadow-sm flex-1">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#044866]/10 to-[#0D5468]/10 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-[#044866]" />
                </div>
                <div className="flex-1">
                    <p className="text-[10px] font-semibold text-[#044866] uppercase tracking-wide mb-0.5">
                        Contact Time
                    </p>
                    <p className="text-sm text-[#044866] font-medium">
                        {callTimeInfo?.badge}
                    </p>
                </div>
            </div>
        </div>
    )
}
