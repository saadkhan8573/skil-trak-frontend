import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@components/ui/alert-dialog'
import { Button, ShowErrorNotifications } from '@components'
import { useNotification } from '@hooks'
import { AdminApi } from '@queries'
import { IPermission } from '@types'

export const DeletePermissionModal = ({
    permission,
    onCancel,
}: {
    permission: IPermission
    onCancel: () => void
}) => {
    const { notification } = useNotification()
    const [remove, removeResult] = AdminApi.Permissions.useRemove()

    const onConfirmDelete = async () => {
        try {
            await remove(permission.id).unwrap()
            notification.error({
                title: `Permission Deleted`,
                description: `Permission "${permission.name}" has been deleted successfully.`,
            })
            onCancel()
        } catch (error) {
            console.error('Failed to delete permission', error)
        }
    }

    return (
        <AlertDialog open onOpenChange={(open) => !open && onCancel()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the permission{' '}
                        <span className="font-semibold">{permission.name}</span>
                        .
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <ShowErrorNotifications result={removeResult} />

                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={removeResult.isLoading}
                        className="cursor-pointer text-gray-600! hover:text-gray-900!"
                    >
                        Cancel
                    </AlertDialogCancel>
                    <Button
                        onClick={onConfirmDelete}
                        loading={removeResult.isLoading}
                        disabled={removeResult.isLoading}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md transition-colors"
                    >
                        Delete Permission
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
