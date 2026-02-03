import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@components/ui/alert-dialog'
import { Button } from '@components'
import { useNotification } from '@hooks'
import { CommonApi } from '@queries'
import { PlacementCall } from '@types'
import { useEffect } from 'react'

export const DeleteCallModal = ({
    item,
    onCancel,
}: {
    item: PlacementCall
    onCancel: () => void
}) => {
    const { notification } = useNotification()
    const [remove, removeResult] = CommonApi.CallManagement.useDeleteAiCallMutation()

    const onConfirmUClicked = async () => {
        if (item?.id) {
            await remove(item.id)
        }
    }

    useEffect(() => {
        if (removeResult.isSuccess) {
            notification.success({
                title: 'Call Deleted',
                description: `Call for "${item?.student?.user?.name}" has been successfully deleted.`,
            })
            onCancel()
        }
    }, [removeResult.isSuccess, item?.student?.user?.name, notification, onCancel])

    return (
        <AlertDialog open={true} onOpenChange={(open) => !open && onCancel()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. You are about to delete the call record for{" "}
                        <span className="font-semibold text-gray-900">
                            {item?.student?.user?.name}
                        </span>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-3">
                    <Button
                        variant="secondary"
                        onClick={onCancel}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="error"
                        onClick={onConfirmUClicked}
                        loading={removeResult.isLoading}
                        className="flex-1"
                    >
                        Delete
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
