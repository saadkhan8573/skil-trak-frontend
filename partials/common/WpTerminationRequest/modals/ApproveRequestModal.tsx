import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { Button, ShowErrorNotifications } from '@components'
import { AdminApi } from '@queries'
import { AlertTriangle, CheckCircle, X } from 'lucide-react'
import { CancelationRequestEnum } from '../../WpCancelationRequest/enum'
import { useNotification } from '@hooks'
import { IWorkplaceIndustries } from '@redux/queryTypes'

export const ApproveRequestModal = ({
    onCancel,
    workplace,
}: {
    workplace: IWorkplaceIndustries
    onCancel: () => void
}) => {
    const { notification } = useNotification()

    const [changeStatus, changeStatusResult] =
        AdminApi.Workplace.changeStatusTerminationReq()

    const onConfirmClicked = async () => {
        try {
            const res: any = await changeStatus({
                id: workplace?.id!,
                status: CancelationRequestEnum.Approved,
            })

            if (res?.data) {
                notification.success({
                    title: `Request Approved`,
                    description: `Termination request has been approved successfully.`,
                })
                onCancel()
            }
        } catch (error) {
            console.error('Failed to approve termination request:', error)
        }
    }

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="w-[95vw] sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
                <ShowErrorNotifications result={changeStatusResult} />

                <div className="px-5 py-5 flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mb-2.5">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>

                    <DialogHeader className="items-center">
                        <DialogTitle className="font-bold text-slate-900 leading-tight">
                            Approve Termination?
                        </DialogTitle>
                        <DialogDescription className="text-[10px] text-slate-500 mt-1 max-w-[280px]">
                            You're approving termination for
                            <span className="font-bold text-slate-900 block mt-0.5 px-2 py-0.5 bg-slate-100 rounded truncate max-w-full">
                                {workplace?.student?.user?.name ||
                                    'this student'}
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 w-full bg-amber-50 border border-amber-100 rounded-lg p-2 flex gap-2 text-left">
                        <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-[9px] text-amber-800 font-medium leading-tight">
                            This action will finalize the workplace termination.
                            This cannot be easily undone.
                        </p>
                    </div>
                </div>

                <div className="px-5 py-2.5 bg-slate-50 border-t flex items-center gap-2">
                    <Button
                        variant="secondary"
                        outline
                        onClick={onCancel}
                        className="flex-1 h-8 border-slate-200 text-[10px] font-bold"
                    >
                        <X className="w-3 h-3 mr-1" />
                        Cancel
                    </Button>
                    <Button
                        variant="primaryNew"
                        loading={changeStatusResult.isLoading}
                        onClick={onConfirmClicked}
                        className="flex-1 h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold border-none shadow-sm"
                    >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Confirm
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
