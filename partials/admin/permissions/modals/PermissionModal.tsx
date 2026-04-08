import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { useNotification } from '@hooks'
import { AdminApi } from '@queries'
import { IPermission, PermissionFormType } from '@types'
import { XIcon } from 'lucide-react'
import { RiShieldUserFill } from 'react-icons/ri'
import { PermissionForm } from '../PermissionForm'

export const PermissionModal = ({
    permission,
    onCancel,
    edit,
}: {
    permission?: IPermission
    onCancel: () => void
    edit?: boolean
}) => {
    const { notification } = useNotification()
    const [addPermission, addResult] = AdminApi.Permissions.useCreate()
    const [updatePermission, updateResult] = AdminApi.Permissions.useUpdate()

    const result = edit ? updateResult : addResult

    const handleSubmit = async (values: PermissionFormType) => {
        try {
            if (edit && permission?.id) {
                await updatePermission({
                    id: permission.id,
                    body: values,
                }).unwrap()
                notification.success({
                    title: 'Permission Updated',
                    description: `Permission "${values.name}" has been updated successfully.`,
                })
            } else {
                await addPermission(values).unwrap()
                notification.success({
                    title: 'Permission Created',
                    description: `Permission "${values.name}" has been created successfully.`,
                })
            }
            onCancel()
        } catch (error) {
            console.error('Failed to save permission:', error)
        }
    }

    return (
        <Dialog open onOpenChange={(open) => !open && onCancel()}>
            <DialogContent
                className="sm:max-w-xl! p-0 overflow- border-none"
                showCloseButton={false}
            >
                <DialogClose className="absolute top-4 right-4 text-white hover:text-white/80 transition-colors z-50">
                    <XIcon className="h-5 w-5" />
                </DialogClose>
                <DialogHeader className="bg-primaryNew p-4 text-white flex-row items-center gap-x-4 space-y-0 text-left">
                    <div className="p-2 bg-white/20 rounded-lg shrink-0">
                        <RiShieldUserFill className="text-3xl" />
                    </div>
                    <div>
                        <DialogTitle className="text-white text-xl font-bold">
                            {edit ? 'Edit Permission' : 'Add New Permission'}
                        </DialogTitle>
                        <DialogDescription className="text-white/80 mt-1">
                            {edit
                                ? 'Update the details of the existing permission.'
                                : 'Fill in the details below to create a new permission.'}
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="px-8 text-left bg-white pb-8 max-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar">
                    <PermissionForm
                        edit={edit}
                        onSubmit={handleSubmit}
                        result={result}
                        initialValues={permission}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
