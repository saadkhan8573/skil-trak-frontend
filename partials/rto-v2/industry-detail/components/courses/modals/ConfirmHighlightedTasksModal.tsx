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

import { AdminApi, RtoV2Api } from '@queries'
import { useNotification } from '@hooks'

interface ConfirmHighlightedTasksModalProps {
    isOpen: boolean
    onClose: () => void
    courseId: number
    industryId: number
}

export function ConfirmHighlightedTasksModal({
    isOpen,
    onClose,
    courseId,
    industryId,
}: ConfirmHighlightedTasksModalProps) {
    const [confirmHighlightedTasks, confirmHighlightedTasksResult] =
        RtoV2Api.Industries.useConfirmHighlightedTasks()
    const { notification } = useNotification()
    const showErrorNotifications = useShowErrorNotification()

    const handleConfirm = async () => {
        try {
            await confirmHighlightedTasks({
                id: industryId,
                courseId: courseId,
            }).unwrap()
            notification.success({
                title: 'Tasks Confirmed',
                description:
                    'Highlighted tasks have been successfully confirmed.',
            })
            onClose()
        } catch (error) {
            console.log({ error })
            showErrorNotifications({ isError: true, error })
        }
    }
    return (
        <>
            <ShowErrorNotifications result={confirmHighlightedTasksResult} />
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CheckSquare className="w-5 h-5 text-primary" />
                            Confirm Highlighted Tasks
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to confirm all highlighted
                            tasks? This action will be recorded.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="sm:justify-end gap-2">
                        <Button variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            variant="primaryNew"
                            disabled={confirmHighlightedTasksResult.isLoading}
                            loading={confirmHighlightedTasksResult.isLoading}
                        >
                            Confirm Tasks
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
