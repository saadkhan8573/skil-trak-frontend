import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@components/ui/dialog'
import { Button, ShowErrorNotifications } from '@components'
import { WorkplaceCurrentStatus, WorkplaceStatusLabels } from '@utils'
import { AlertCircle, CheckCircle2, ArrowRight, X } from 'lucide-react'
import { useManuallyUpdateWorkplaceStatusMutation } from '@redux/queries/portals/rto-v2/rto-v2.query'
import { useNotification } from '@hooks'

interface ManualUpdateStatusModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    workplaceId: number
    currentStatus: WorkplaceCurrentStatus
    newStatus: WorkplaceCurrentStatus | null
}

export function ManualUpdateStatusModal({
    isOpen,
    onOpenChange,
    workplaceId,
    currentStatus,
    newStatus,
}: ManualUpdateStatusModalProps) {
    const [updateStatus, updateStatusResult] =
        useManuallyUpdateWorkplaceStatusMutation()
    const { notification } = useNotification()

    const handleConfirm = async () => {
        if (newStatus) {
            try {
                await updateStatus({
                    id: workplaceId,
                    status: newStatus,
                }).unwrap()
                notification.success({
                    title: 'Status Updated',
                    description: `Workplace status has been successfully updated to ${WorkplaceStatusLabels[newStatus]}.`,
                })
                onOpenChange(false)
            } catch (error) {
                console.error('Failed to update status:', error)
            }
        }
    }

    if (!newStatus) return null

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <ShowErrorNotifications result={updateStatusResult} />
            <DialogContent
                className="p-0 overflow-hidden sm:max-w-2xl! bg-white border-0 shadow-2xl rounded-xl"
                showCloseButton={false}
            >
                <DialogHeader className="bg-primaryNew px-6 py-3 text-white m-0 relative flex-row items-center gap-4 space-y-0">
                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md shadow-inner border border-white/20">
                        <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                        <DialogTitle className="text-lg font-bold text-white tracking-tight">
                            Confirm Status Update
                        </DialogTitle>
                        <DialogDescription className="text-white/80 text-xs mt-0.5 font-medium">
                            Manual status changes will be logged.
                        </DialogDescription>
                    </div>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-lg transition-colors group"
                    >
                        <X className="w-5 h-5 text-white/70 group-hover:text-white" />
                    </button>
                </DialogHeader>

                <div className="px-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <div className="space-y-6">
                        <div className="bg-slate-50/80 rounded-2xl px-3.5 py-2.5 border border-slate-100/80 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div className="space-y-2 flex-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">
                                        Current
                                    </span>
                                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm text-center">
                                        {WorkplaceStatusLabels[currentStatus]}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                        <ArrowRight className="w-4 h-4 text-slate-400" />
                                    </div>
                                </div>

                                <div className="space-y-2 flex-1">
                                    <span className="text-[10px] font-bold text-primaryNew uppercase tracking-widest pl-0.5">
                                        Target
                                    </span>
                                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-700 shadow-sm text-center">
                                        {WorkplaceStatusLabels[newStatus]}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider pl-1">
                                Important Notice
                            </h4>
                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 text-xs leading-relaxed text-amber-800 font-medium">
                                <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-[10px] font-bold text-amber-900">
                                        !
                                    </span>
                                </div>
                                <p>
                                    Manually updating the status overrides the
                                    automatic workflow. Please ensure all
                                    required actions and documents are completed
                                    before proceeding.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-2.5 bg-slate-50/50 border-t border-slate-100 flex flex-row gap-3 sm:justify-end">
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        className="flex-1 sm:flex-none font-bold text-slate-600"
                        disabled={updateStatusResult.isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        className="flex-1 sm:min-w-[160px] bg-primaryNew text-white font-bold shadow-lg shadow-primaryNew/20 hover:scale-[1.02] active:scale-95 transition-all uppercase!"
                        loading={updateStatusResult.isLoading}
                    >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Confirm Update
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
