import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/ui/dialog'
import {
    LoadingAnimation,
    NoData,
    ShowErrorNotifications,
    Button
} from '@components'
import { SubAdminApi } from '@queries'
import { CallLog } from '@types'
import { maskText } from '@utils'
import { Copy, PhoneCall } from 'lucide-react'
import { useNotification } from '@hooks'
import { CallLogDetail } from '@partials/sub-admin/students'

interface StudentCallLogModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    studentId?: number
    studentDisplayId?: string
    phoneNumber?: string
    studentName?: string
}

export function StudentCallLogModal({
    open,
    onOpenChange,
    studentId,
    studentDisplayId,
    phoneNumber,
    studentName
}: StudentCallLogModalProps) {
    const { notification } = useNotification()
    const [callLog, callLogResult] = SubAdminApi.Student.useStudentCallLog()

    const callLogs = SubAdminApi.Student.useGetStudentCallLog(
        studentId || 0,
        {
            skip: !studentId,
        }
    )

    const handleCallAndCopy = () => {
        if (phoneNumber) {
            navigator.clipboard.writeText(phoneNumber)
            callLog({
                student: studentId!,
            }).then((res: any) => {
                if (res?.data) {
                    notification.success({
                        title: 'Called Student',
                        description: `Called Student with Name: ${studentName}`,
                    })
                }
            })
            notification.success({
                title: 'Copied',
                description: 'Phone Number Copied',
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-2xl !p-0 bg-white rounded-2xl shadow-2xl overflow-hidden gap-0 border-none">
                <DialogHeader className="bg-gradient-to-r from-[#044866] to-[#0D5468] p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                            <PhoneCall className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-white font-bold text-lg">
                                Call Logs
                            </DialogTitle>
                            <p className="text-white/80 text-xs">
                                History of calls made to this student
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="px-6 py-1.5 space-y-1.5">
                    {/* Phone Number Action Section */}
                    <div className="bg-slate-50 rounded px-4 py-2 border border-slate-100 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">
                                Phone Number
                            </p>
                            <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                                {phoneNumber
                                    ? maskText(phoneNumber)
                                    : 'Number blocked'}
                            </h3>
                        </div>
                        <Button
                            onClick={handleCallAndCopy}
                            loading={callLogResult.isLoading}
                            disabled={!phoneNumber || callLogResult.isLoading}
                            className="bg-[#044866] hover:bg-[#0D5468] text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-transform active:scale-95"
                        >
                            <Copy className="w-4 h-4" />
                            <span>Call & Copy</span>
                        </Button>
                    </div>

                    {/* Logs List Section */}
                    <div>
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-slate-700">Recent Calls</h4>
                            <span className="text-xs text-slate-400">
                                {callLogs.data?.length || 0} records found
                            </span>
                        </div>

                        <div className="bg-white border rounded-lg max-h-[40vh] overflow-y-auto custom-scrollbar p-2">
                            <ShowErrorNotifications result={callLogs} />
                            <ShowErrorNotifications result={callLogResult} />

                            {callLogs.isLoading ? (
                                <div className="h-full flex items-center justify-center py-10">
                                    <LoadingAnimation />
                                </div>
                            ) : callLogs.data &&
                                callLogs.data.length > 0 &&
                                callLogs.isSuccess ? (
                                <div className="flex flex-col gap-2">
                                    {callLogs.data.map((log: CallLog) => (
                                        <CallLogDetail
                                            key={log.id}
                                            callLog={log}
                                        />
                                    ))}
                                </div>
                            ) : (
                                !callLogs.isError && (
                                    <NoData simple text={'No call history available'} />
                                )
                            )}
                        </div>
                    </div>

                    <div className="mt-2 flex justify-end">
                        <Button
                            variant="secondary"
                            outline
                            onClick={() => onOpenChange(false)}
                            className="px-6"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
