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
    taskId: number
    industryId: number
    showNotAvailable?: boolean
    confirmationDetailId?: number
}

export function ConfirmHighlightedTasksModal({
    isOpen,
    onClose,
    taskId,
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
            await confirmHighlightedTask({
                industryId,
                taskId,
                confirmationSource,
                isConfirmed,
                confirmationDetailId
            }).unwrap()
            notification.success({
                title: 'Task Confirmed',
                description: 'Highlighted task has been successfully confirmed.',
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
                <DialogContent className="!max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CheckSquare className="w-5 h-5 text-primary" />
                            Confirm Task
                        </DialogTitle>
                        <DialogDescription>
                            How did you confirm this highlighted task?
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
                                Mark as Not Available
                            </Button>
                        )}
                        <Button
                            onClick={() => handleConfirm(true)}
                            variant="primaryNew"
                            disabled={confirmHighlightedTaskResult.isLoading}
                            loading={confirmHighlightedTaskResult.isLoading}
                        >
                            Confirm Method
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
