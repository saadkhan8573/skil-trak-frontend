import { Button, ShowErrorNotifications } from '@components'
import { useNotification } from '@hooks'
import { StudentMessageModal } from '@partials/rto-v2/student-detail/modals/StudentMessageModal'
import { SubAdminApi } from '@queries'
import { Student } from '@types'
import { Clock, Info, Mail, MessageSquare, Phone } from 'lucide-react'
import { ReactElement, useState } from 'react'
import { ComposeEmailModal } from '../modal'

export const QuickActions = ({ student }: { student: Student }) => {
    const [modal, setModal] = useState<ReactElement | null>(null)

    const { notification } = useNotification()

    const [callLog, callLogResult] = SubAdminApi.Student.useStudentCallLog()
    const { data, isLoading } = SubAdminApi.Student.useStudentPreferredCallTime(
        student?.id,
        {
            skip: !student?.id,
        }
    )
    const onCancelClicked = () => setModal(null)
    const onComposeMailClicked = () => {
        setModal(
            <ComposeEmailModal
                onCancel={onCancelClicked}
                user={student?.user}
            />
        )
    }

    const onMessageSendClicked = () => {
        setModal(
            <StudentMessageModal onCancel={onCancelClicked} student={student} />
        )
    }

    const onMakeCallClicked = () => {
        callLog({
            student: student?.id,
        }).then((res: any) => {
            if (res?.data) {
                notification.success({
                    title: 'Called Student',
                    description: `Called Student with Id: ${student?.studentId}`,
                })
            }
        })
    }

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
        <>
            {modal}
            <ShowErrorNotifications result={callLogResult} />

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="bg-linear-to-br from-slate-50 to-slate-100 border mb-4 border-slate-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <Clock className="w-5 h-5 text-slate-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-semibold text-slate-700">
                                    Preferred Contact Time
                                </h4>
                                {!isLoading && !data?.answer && (
                                    <div className="group relative">
                                        <Info className="w-4 h-4 text-slate-400 cursor-help" />
                                        <div className="invisible group-hover:visible absolute left-0 top-6 bg-slate-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                                            No preference set
                                        </div>
                                    </div>
                                )}
                            </div>

                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-pulse bg-slate-200 h-6 w-32 rounded"></div>
                                </div>
                            ) : data?.answer ? (
                                <div className="flex flex-col gap-2">
                                    <span className="inline-flex items-center w-fit px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                                        {callTimeInfo?.badge}
                                    </span>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 italic">
                                    No preferred time set
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                        variant="primaryNew"
                        text="Send Email"
                        Icon={Mail}
                        className="h-auto py-4"
                        onClick={onComposeMailClicked}
                    />
                    <Button
                        variant="primaryNew"
                        text="Send SMS"
                        Icon={MessageSquare}
                        className="h-auto py-4"
                        onClick={onMessageSendClicked}
                    />
                    <Button
                        variant="info"
                        text="Make Call"
                        Icon={Phone}
                        className="h-auto py-4"
                        loading={callLogResult.isLoading}
                        disabled={callLogResult.isLoading}
                        onClick={onMakeCallClicked}
                    />
                </div>
            </div>
        </>
    )
}
