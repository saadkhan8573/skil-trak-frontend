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
import { CheckSquare } from 'lucide-react'

import { RtoV2Api } from '@queries'
import { useNotification } from '@hooks'
import { useState } from 'react'
import { ConfirmationSource } from '@types'
import { ConfirmationSourceSelect } from './components/ConfirmationSourceSelect'

interface BulkConfirmHighlightedTasksModalProps {
    isOpen: boolean
    onClose: () => void
    tasks: { id: number; confirmationDetailId?: number }[]
    industryId: number
    showNotAvailable?: boolean
}

export function BulkConfirmHighlightedTasksModal({
    isOpen,
    onClose,
    tasks,
    industryId,
    showNotAvailable = true,
}: BulkConfirmHighlightedTasksModalProps) {
    const [confirmBulkHighlightedTasks, confirmBulkHighlightedTasksResult] =
        RtoV2Api.Industries.useConfirmBulkHighlightedTasks()
    const { notification } = useNotification()
    const showErrorNotifications = useShowErrorNotification()
    const [confirmationSource, setConfirmationSource] =
        useState<ConfirmationSource>(ConfirmationSource.EMAIL)

    const handleConfirm = async (isConfirmed: boolean = true) => {
        try {
            await confirmBulkHighlightedTasks({
                industryId,
                isConfirmed,
                confirmationSource,
                tasks: tasks.map((task) => ({
                    taskId: task.id,
                    industryTaskId: task.confirmationDetailId,
                })),
            }).unwrap()

            notification.success({
                title: isConfirmed
                    ? 'Tasks Confirmed'
                    : 'Tasks Marked Not Available',
                description: isConfirmed
                    ? `${tasks.length} tasks have been successfully confirmed.`
                    : `${tasks.length} tasks have been marked as Not Available.`,
            })
            onClose()
        } catch (error) {
            showErrorNotifications({ isError: true, error })
        }
    }
    return (
        <>
            <ShowErrorNotifications
                result={confirmBulkHighlightedTasksResult}
            />
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-xl!">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CheckSquare className="w-5 h-5 text-primary" />
                            Confirm {tasks.length} Tasks
                        </DialogTitle>
                        <DialogDescription>
                            How did you confirm these tasks? Please select a
                            confirmation method below.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-2">
                        <ConfirmationSourceSelect
                            selectedSource={confirmationSource}
                            onSelect={setConfirmationSource}
                        />
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
                                disabled={
                                    confirmBulkHighlightedTasksResult.isLoading
                                }
                            >
                                Mark {tasks.length} as Not Available
                            </Button>
                        )}
                        <Button
                            onClick={() => handleConfirm(true)}
                            variant="primaryNew"
                            disabled={
                                confirmBulkHighlightedTasksResult.isLoading
                            }
                            loading={
                                confirmBulkHighlightedTasksResult.isLoading
                            }
                        >
                            Confirm All {tasks.length}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
