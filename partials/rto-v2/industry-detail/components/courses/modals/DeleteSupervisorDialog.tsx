import {
    Badge,
    Button,
    ShowErrorNotifications,
    Typography,
} from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { useNotification } from '@hooks'
import { IndustryApi } from '@queries'
import { Supervisor } from '@types'
import { AlertTriangle, Trash2, XCircle } from 'lucide-react'
import { useEffect } from 'react'

interface DeleteSupervisorDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    supervisor: Supervisor
}

export function DeleteSupervisorDialog({
    open,
    onOpenChange,
    supervisor,
}: DeleteSupervisorDialogProps) {
    const { notification } = useNotification()
    const [deleteSupervisor, deleteSupervisorResult] =
        IndustryApi.Supervisor.removeSupervisor()

    useEffect(() => {
        if (deleteSupervisorResult.isSuccess) {
            notification.success({
                title: 'Supervisor Removed',
                description: `${supervisor?.name} has been successfully removed.`,
            })
            onOpenChange(false)
        }
    }, [deleteSupervisorResult.isSuccess, supervisor?.name, notification, onOpenChange])

    const handleDelete = async () => {
        if (supervisor?.id) {
            await deleteSupervisor(supervisor.id)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm p-0 overflow-hidden border-none shadow-2xl [&>button]:text-white">
                <ShowErrorNotifications result={deleteSupervisorResult} />

                {/* Danger Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-500 p-5 flex flex-row items-center gap-4 text-white relative">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shrink-0">
                        <Trash2 className="w-6 h-6 text-white" />
                    </div>
                    <DialogHeader className="text-left !space-y-0.5">
                        <DialogTitle className="text-lg font-bold text-white">
                            Remove Supervisor
                        </DialogTitle>
                        <DialogDescription className="text-red-100 text-sm">
                            This action will permanently delete this supervisor.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Decorative Elements */}
                    <div className="absolute top-2 right-2 opacity-10">
                        <XCircle className="w-16 h-16" />
                    </div>
                </div>

                <div className="px-5 py-4 space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-[#64748B]">
                            <span>Supervisor</span>
                            <span className="font-bold text-[#1A2332]">{supervisor?.name}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-[#64748B]">
                            <span>Role</span>
                            <span className="font-bold text-[#044866]">{supervisor?.position}</span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-4 bg-gray-50 border-t flex flex-row gap-2 sm:justify-center">
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        className="flex-1 h-9 text-xs font-bold"
                    >
                        Keep Supervisor
                    </Button>
                    <Button
                        variant="error"
                        onClick={handleDelete}
                        loading={deleteSupervisorResult.isLoading}
                        disabled={deleteSupervisorResult.isLoading}
                        className="flex-1 h-9 bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-200"
                    >
                        Confirm Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
