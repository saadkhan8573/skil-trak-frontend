import { Button } from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { useNotification } from '@hooks'
import { RtoV2Api } from '@queries'
import { Student } from '@types'
import { AlertCircle } from 'lucide-react'

interface RemoveExpectedDelayModalProps {
    isOpen: boolean
    onClose: () => void
    student: Student
}

export const RemoveExpectedDelayModal = ({
    isOpen,
    onClose,
    student,
}: RemoveExpectedDelayModalProps) => {
    const [addExpectedDelay, { isLoading }] =
        RtoV2Api.Students.addExpectedDelay()

    const { notification } = useNotification()

    const onRemoveDelay = () => {
        addExpectedDelay({
            id: student?.id,
            expectedDelayReason: null,
        }).then((res: any) => {
            if (res?.data) {
                notification.success({
                    title: 'Delay Removed',
                    description:
                        'Expected delay has been successfully removed.',
                })
                onClose()
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-white border-none shadow-2xl p-0 overflow-hidden">
                <div className="p-6 pb-4">
                    <DialogHeader className="mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center shrink-0">
                                <AlertCircle className="w-6 h-6 text-amber-600" />
                            </div>
                            <DialogTitle className="text-xl font-bold text-gray-900">
                                Delay Information
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-gray-500 text-sm mt-2">
                            Current expected delay status for{' '}
                            {student?.user?.name}.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                                Reason for Delay
                            </label>
                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                {student?.expectedDelay ||
                                    'No reason provided.'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-4 border-t border-gray-100 bg-gray-50/50">
                    <Button
                        text="Cancel"
                        variant="secondary"
                        onClick={onClose}
                        disabled={isLoading}
                        outline
                        className="w-24"
                    />
                    <Button
                        text="Remove from delay"
                        variant="error"
                        onClick={onRemoveDelay}
                        loading={isLoading}
                        className="w-48"
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
