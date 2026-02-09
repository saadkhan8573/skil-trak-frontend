import {
    Button,
    ShowErrorNotifications,
    useShowErrorNotification,
} from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { CheckSquare, Mail, Phone, CheckCircle2 } from 'lucide-react'

import { RtoV2Api } from '@queries'
import { useNotification } from '@hooks'
import { useState } from 'react'
import { ConfirmationSource } from '@types'

interface ConfirmHighlightedTasksModalProps {
    isOpen: boolean
    onClose: () => void
    courseId?: number
    taskIds: number[]
    industryId: number
    showNotAvailable?: boolean
    confirmationDetailId?: number // Note: This might need adjustment for bulk, usually only for single edit
}

export function ConfirmHighlightedTasksModal({
    isOpen,
    onClose,
    taskIds,
    industryId,
    showNotAvailable = true,
    confirmationDetailId
}: ConfirmHighlightedTasksModalProps) {
    const [confirmHighlightedTask, confirmHighlightedTaskResult] =
        RtoV2Api.Industries.useConfirmHighlightedTask()
    const { notification } = useNotification()
    const showErrorNotifications = useShowErrorNotification()
    const [confirmationSource, setConfirmationSource] = useState<ConfirmationSource>(
        ConfirmationSource.EMAIL
    )

    const handleConfirm = async (isConfirmed: boolean = true) => {
        try {
            // Bulk confirmation by iterating (if API is single)
            const promises = taskIds.map(id =>
                confirmHighlightedTask({
                    industryId,
                    taskId: id,
                    confirmationSource,
                    isConfirmed,
                    confirmationDetailId: taskIds.length === 1 ? confirmationDetailId : undefined
                }).unwrap()
            );

            await Promise.all(promises);

            notification.success({
                title: isConfirmed
                    ? (taskIds.length > 1 ? 'Tasks Confirmed' : 'Task Confirmed')
                    : (taskIds.length > 1 ? 'Tasks Marked Not Available' : 'Task Marked Not Available'),
                description: isConfirmed
                    ? (taskIds.length > 1 ? `${taskIds.length} tasks have been successfully confirmed.` : 'Highlighted task has been successfully confirmed.')
                    : (taskIds.length > 1 ? `${taskIds.length} tasks have been marked as Not Available.` : 'Highlighted task has been marked as Not Available.'),
            })
            onClose()
        } catch (error) {
            showErrorNotifications({ isError: true, error })
        }
    }
    return (
        <>
            <ShowErrorNotifications result={confirmHighlightedTaskResult} />
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-xl!">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CheckSquare className="w-5 h-5 text-primary" />
                            {taskIds.length > 1 ? `Confirm ${taskIds.length} Tasks` : 'Confirm Task'}
                        </DialogTitle>
                        <DialogDescription>
                            How did you confirm {taskIds.length > 1 ? 'these tasks' : 'this highlighted task'}?
                            Please select a confirmation method below.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-4 py-6">
                        {/* Email Option */}
                        <div
                            onClick={() => setConfirmationSource(ConfirmationSource.EMAIL)}
                            className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 group ${confirmationSource === ConfirmationSource.EMAIL
                                ? 'border-[#044866] bg-[#044866]/5 shadow-md'
                                : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                                }`}
                        >
                            {confirmationSource === ConfirmationSource.EMAIL && (
                                <div className="absolute top-2 right-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#044866]" />
                                </div>
                            )}
                            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${confirmationSource === ConfirmationSource.EMAIL ? 'bg-[#044866] text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                                }`}>
                                <Mail className="w-5 h-5" />
                            </div>
                            <h4 className={`text-sm font-bold ${confirmationSource === ConfirmationSource.EMAIL ? 'text-[#044866]' : 'text-slate-700'}`}>
                                Email
                            </h4>
                            <p className="mt-1 text-[11px] text-slate-500 leading-tight">
                                Confirmed via official email record
                            </p>
                        </div>

                        {/* Phone Option */}
                        <div
                            onClick={() => setConfirmationSource(ConfirmationSource.PHONE)}
                            className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 group ${confirmationSource === ConfirmationSource.PHONE
                                ? 'border-[#044866] bg-[#044866]/5 shadow-md'
                                : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                                }`}
                        >
                            {confirmationSource === ConfirmationSource.PHONE && (
                                <div className="absolute top-2 right-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#044866]" />
                                </div>
                            )}
                            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${confirmationSource === ConfirmationSource.PHONE ? 'bg-[#044866] text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                                }`}>
                                <Phone className="w-5 h-5" />
                            </div>
                            <h4 className={`text-sm font-bold ${confirmationSource === ConfirmationSource.PHONE ? 'text-[#044866]' : 'text-slate-700'}`}>
                                Phone Call
                            </h4>
                            <p className="mt-1 text-[11px] text-slate-500 leading-tight">
                                Confirmed during a phone discussion
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="sm:justify-end gap-2">
                        <Button variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        {showNotAvailable && (
                            <Button
                                onClick={() => handleConfirm(false)}
                                variant="primary"
                                outline
                                className="border-red-200 text-red-600 hover:bg-red-50"
                                disabled={confirmHighlightedTaskResult.isLoading}
                            >
                                {taskIds.length > 1 ? `Mark ${taskIds.length} as Not Available` : 'Mark as Not Available'}
                            </Button>
                        )}
                        <Button
                            onClick={() => handleConfirm(true)}
                            variant="primaryNew"
                            disabled={confirmHighlightedTaskResult.isLoading}
                            loading={confirmHighlightedTaskResult.isLoading}
                        >
                            Confirm {taskIds.length > 1 ? `All ${taskIds.length}` : 'Method'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
