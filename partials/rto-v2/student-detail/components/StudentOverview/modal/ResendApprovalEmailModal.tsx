import { Button, ShowErrorNotifications, useShowErrorNotification } from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { useNotification } from '@hooks'
import { SubAdminApi, useResendWorkplaceApprovalEmailMutation } from '@queries'

interface ResendApprovalEmailModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    approvalId: number
}

export const ResendApprovalEmailModal = ({
    open,
    onOpenChange,
    approvalId,
}: ResendApprovalEmailModalProps) => {
    const { notification } = useNotification()
    const [resendEmail, resendResult] = SubAdminApi.Student.resendWorkplaceApprovalEmail()
    const showErrorNotifications = useShowErrorNotification()

    const handleConfirm = async () => {
        try {
            const res = await resendEmail(approvalId).unwrap()
            if (res) {
                notification.success({
                    title: 'Email Sent',
                    description: 'Approval email has been resent to the student successfully.',
                })
                onOpenChange(false)
            }
        } catch (error: any) {
            showErrorNotifications({ isError: true, ...error })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <ShowErrorNotifications result={resendResult} />
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Resend Approval Email</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to resend the workplace approval email to the student?
                    </DialogDescription>
                </DialogHeader>
                <ShowErrorNotifications result={resendResult} />
                <DialogFooter className="flex gap-2 sm:justify-end mt-4">
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={resendResult.isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primaryNew"
                        onClick={handleConfirm}
                        loading={resendResult.isLoading}
                    >
                        Confirm Resend
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
