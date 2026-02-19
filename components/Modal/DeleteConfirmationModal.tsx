import React from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@components/ui/alert-dialog'
import { Button } from '@components'
import { Trash2 } from 'lucide-react'
import { CommonApi } from '@queries/common/common.query'
import { useNotification } from '@hooks'

interface DeleteConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    id: number | null
}

export const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    id,
}: DeleteConfirmationModalProps) => {
    const [deleteAgent, { isLoading }] = CommonApi.CallManagement.useDeleteAgentMutation()
    const { notification } = useNotification()

    const handleDelete = async () => {
        if (!id) return
        try {
            await deleteAgent(id).unwrap()
            notification.success({
                title: 'Success',
                description: 'Agent deleted successfully',
            })
            onClose()
        } catch (error: any) {
            notification.error({
                title: 'Error',
                description: error?.data?.message || 'Failed to delete agent',
            })
        }
    }
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="max-w-md! bg-white p-0 overflow-hidden border-none shadow-2xl">
                <div className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center shrink-0">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-bold text-gray-900">
                                Delete Agent
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                    </div>

                    <AlertDialogDescription className="text-gray-400 text-sm leading-relaxed">
                        Are you sure you want to delete this agent? This action cannot be undone.
                    </AlertDialogDescription>

                    <AlertDialogFooter className="flex items-center justify-end gap-3 border-t border-gray-100 mt-2">
                        <Button
                            text="Cancel"
                            variant="secondary"
                            onClick={onClose}
                            disabled={isLoading}
                            className='w-32'
                        />
                        <Button
                            text="Delete"
                            variant="error"
                            onClick={handleDelete}
                            loading={isLoading}
                            className='w-32'
                        />
                    </AlertDialogFooter>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
