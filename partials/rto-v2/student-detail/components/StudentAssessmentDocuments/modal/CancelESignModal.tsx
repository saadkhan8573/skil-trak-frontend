import { Button, useShowErrorNotification } from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui'
import { CommonApi } from '@queries'
import { useNotification } from '@hooks'
import { EsignDocumentStatus } from '@utils'

interface CancelESignModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    eSign: any
}

export const CancelESignModal = ({
    open,
    onOpenChange,
    eSign,
}: CancelESignModalProps) => {
    const { notification } = useNotification()
    const showErrorNotification = useShowErrorNotification()
    const [cancelESign, cancelResult] = CommonApi.ESign.useCancelESign()

    const handleCancelESign = async () => {
        if (eSign?.id) {
            try {
                await cancelESign({
                    id: Number(eSign.id),
                    status: EsignDocumentStatus.CANCELLED,
                }).unwrap()
                notification.success({
                    title: 'E-Sign Cancelled',
                    description: `The E-Sign process for "${eSign?.template?.name}" has been successfully cancelled.`,
                })
                onOpenChange(false)
            } catch (error: any) {
                showErrorNotification({ isError: true, error })
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cancel E-Sign</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to cancel the E-Sign process for "{eSign?.template?.name}"?
                        This will make the process invalid and signatories won't be able to sign.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 flex flex-row justify-end gap-2">
                    <Button
                        variant="action"
                        onClick={() => onOpenChange(false)}
                        disabled={cancelResult.isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="error"
                        onClick={handleCancelESign}
                        loading={cancelResult.isLoading}
                        disabled={cancelResult.isLoading}
                    >
                        Confirm Cancellation
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
