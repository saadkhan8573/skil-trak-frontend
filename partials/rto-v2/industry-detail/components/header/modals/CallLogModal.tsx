import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/ui/dialog'
import {
    LoadingAnimation,
    NoData,
    ShowErrorNotifications,
    Button
} from '@components'
import { IndustryCallLogDetail } from '@partials/sub-admin/Industries/components'
import { SubAdminApi } from '@queries'
import { CallLog } from '@types'
import { maskText } from '@utils'
import { Copy, PhoneCall } from 'lucide-react'
import { UserRoles } from '@constants'
import { useNotification } from '@hooks'

interface CallLogModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    industryId?: number
    phoneNumber?: string
    isSnoozed?: boolean
    industryName?: string
}

export function CallLogModal({
    open,
    onOpenChange,
    industryId,
    phoneNumber,
    isSnoozed,
    industryName
}: CallLogModalProps) {
    const { notification } = useNotification()
    const [callLog, callLogResult] = SubAdminApi.Industry.useIndustryCallLog()

    const callLogs = SubAdminApi.Industry.useGetIndustryCallLog(
        industryId || 0,
        {
            skip: !industryId,
        }
    )

    const handleCallAndCopy = () => {
        if (phoneNumber) {
            navigator.clipboard.writeText(phoneNumber)
            callLog({
                industry: industryId,
                receiver: UserRoles.INDUSTRY,
            }).then((res: any) => {
                if (res?.data) {
                    notification.success({
                        title: 'Called Industry',
                        description: `Called Industry with Name: ${industryName}`,
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
            <DialogContent className="!max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden p-0 gap-0">
                <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-800 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                            <PhoneCall className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-white font-bold text-lg">
                                Call Logs
                            </DialogTitle>
                            <p className="text-white/80 text-xs">
                                History of calls made to this industry
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="px-6 py-3">
                    {/* Phone Number Action Section */}
                    <div className="bg-slate-50 rounded px-4 py-2 border border-slate-100 flex items-center justify-between mb-6 shadow-sm">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">
                                Phone Number
                            </p>
                            <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                                {isSnoozed
                                    ? '---'
                                    : phoneNumber
                                        ? maskText(phoneNumber)
                                        : 'Number blocked'}
                            </h3>
                        </div>
                        <Button
                            onClick={handleCallAndCopy}
                            loading={callLogResult.isLoading}
                            disabled={!!(isSnoozed || !phoneNumber) || callLogResult.isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-transform active:scale-95"
                        >
                            <Copy className="w-4 h-4" />
                            <span>Call & Copy</span>
                        </Button>
                    </div>

                    {/* Logs List Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-slate-700">Recent Calls</h4>
                            <span className="text-xs text-slate-400">
                                {callLogs.data?.length || 0} records found
                            </span>
                        </div>

                        <div className="bg-white border rounded-lg max-h-[50vh] overflow-y-auto custom-scrollbar p-2">
                            <ShowErrorNotifications result={callLogs} />
                            <ShowErrorNotifications result={callLogResult} />

                            {callLogs.isLoading ? (
                                <div className="h-full flex items-center justify-center">
                                    <LoadingAnimation />
                                </div>
                            ) : callLogs.data &&
                                callLogs.data.length > 0 &&
                                callLogs.isSuccess ? (
                                <div className="flex flex-col gap-2">
                                    {callLogs.data.map((log: CallLog) => (
                                        <IndustryCallLogDetail
                                            key={log.id}
                                            callLog={log}
                                        />
                                    ))}
                                </div>
                            ) : (
                                !callLogs.isError && (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                        <NoData text={'No call history available'} />
                                    </div>
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
