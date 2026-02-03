import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { Button } from '@components'
import { useNotification } from '@hooks'
import { RtoV2Api } from '@queries'
import { useEffect } from 'react'

interface PlacementReadyModalProps {
    industryId: number
    industryName: string
    onCancel: () => void
}

export const PlacementReadyModal = ({
    industryId,
    industryName,
    onCancel,
}: PlacementReadyModalProps) => {
    const { notification } = useNotification()
    const [markReady, result] = RtoV2Api.Industries.industryPlacementReady()

    const onConfirm = async () => {
        if (industryId) {
            await markReady({ id: industryId })
        }
    }

    useEffect(() => {
        if (result.isSuccess) {
            notification.success({
                title: 'Success',
                description: `"${industryName}" is now marked as Placement Ready.`,
            })
            onCancel()
        }
    }, [result.isSuccess, industryName, notification, onCancel])

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Ready for Placements?</DialogTitle>
                    <DialogDescription>
                        You are about to mark <span className="font-semibold text-gray-900">{industryName}</span> as ready for placements. This will signify that the industry profile is optimized and prepared to host students.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex sm:justify-between gap-3 mt-4">
                    <Button
                        variant="secondary"
                        onClick={onCancel}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primaryNew"
                        onClick={onConfirm}
                        loading={result.isLoading}
                        className="flex-1"
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
