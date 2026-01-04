import { Button, ShowErrorNotifications } from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { useNotification } from '@hooks'
import { RtoV2Api } from '@queries'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface ApproveRejectConfirmationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    action: 'approved' | 'rejected'
    id: number
}

export function ApproveRejectConfirmationModal({
    open,
    onOpenChange,
    action,
    id,
}: ApproveRejectConfirmationModalProps) {
    const { notification } = useNotification()
    const [changeCourseApprovalStatus, changeCourseApprovalStatusResult] =
        RtoV2Api.Industries.statusChangeCourseFacilityChecklist()

    const handleConfirm = async () => {
        const res: any = await changeCourseApprovalStatus({
            id,
            status: action,
        })
        if (res?.data) {
            notification.success({
                title: 'Status Changed',
                description: `Status Changed Successfully to ${action}!`,
            })
            onOpenChange(false)
        }
    }

    return (
        <>
            <ShowErrorNotifications result={changeCourseApprovalStatusResult} />
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {action === 'approved' ? (
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-500" />
                            )}
                            Confirm {action === 'approved' ? 'Approval' : 'Rejection'}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-500">
                            Are you sure you want to {action} this course approval request?
                            {action === 'rejected' && " This will notify the industry partner."}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2 flex justify-end">
                        <Button
                            variant="secondary"
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800"
                            onClick={() => onOpenChange(false)}
                            disabled={changeCourseApprovalStatusResult.isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={action === 'approved' ? 'success' : 'error'}
                            onClick={handleConfirm}
                            loading={changeCourseApprovalStatusResult.isLoading}
                        >
                            Confirm {action === 'approved' ? 'Approve' : 'Reject'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
