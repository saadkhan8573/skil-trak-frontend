import * as Yup from 'yup'
import { useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'
import { Button, ShowErrorNotifications, TextArea } from '@components'
import { XCircle, Send, Clock, X } from 'lucide-react'

// queries
import { useNotification } from '@hooks'
import { SubAdminApi } from '@queries'

interface onSubmitType {
    note: string
}

interface CancelWorkplaceRequestModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    workplaceId: number
}

export const CancelWorkplaceRequestModal = ({
    open,
    onOpenChange,
    workplaceId,
}: CancelWorkplaceRequestModalProps) => {
    const { notification } = useNotification()

    const [cancelWorkplace, cancelWorkplaceResult] =
        SubAdminApi.Workplace.useCancelRequestWP()

    useEffect(() => {
        if (cancelWorkplaceResult.isSuccess) {
            notification.success({
                title: 'Request Submitted',
                description:
                    'Your cancellation request has been sent to the Admin for approval.',
                position: 'bottomleft',
            })
            onOpenChange(false)
        }
    }, [cancelWorkplaceResult])

    const validationSchema = Yup.object({
        note: Yup.string().required(
            'Keep it professional. Please provide a clear reason for the cancellation request.'
        ),
    })

    const methods = useForm<onSubmitType>({
        resolver: yupResolver(validationSchema),
        mode: 'all',
    })

    const onSubmit = (values: onSubmitType) => {
        cancelWorkplace({
            id: Number(workplaceId),
            comment: values?.note,
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none shadow-2xl">
                <ShowErrorNotifications result={cancelWorkplaceResult} />

                <div className="px-5 py-3.5 border-b bg-white">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                                <XCircle className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-slate-900">
                                    Request Cancellation
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500">
                                    Submit a request to Admin for approval.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col">
                        <div className="px-5 space-y-3">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-2.5">
                                <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-blue-800 leading-relaxed">
                                    As a SubAdmin, your request requires Admin approval before the workplace is removed.
                                </p>
                            </div>

                            <TextArea
                                label={
                                    <span className="text-xs font-semibold text-slate-700">
                                        Reason for Cancellation
                                    </span>
                                }
                                required
                                name={'note'}
                                placeholder={'e.g., Student found alternative workplace...'}
                                rows={4}
                                className="resize-none text-xs"
                            />
                        </div>

                        <div className="px-5 py-3 bg-slate-50 border-t flex items-center gap-3">
                            <Button
                                variant="secondary"
                                outline
                                onClick={() => onOpenChange(false)}
                                className="flex-1 h-10 border-slate-200 text-xs"
                            >
                                <X className="w-3.5 h-3.5 mr-2" />
                                Dismiss
                            </Button>
                            <Button
                                submit
                                variant="primaryNew"
                                loading={cancelWorkplaceResult.isLoading}
                                className="flex-1 h-10 bg-[#044866] hover:bg-[#0D5468] text-white text-xs"
                            >
                                <Send className="w-3.5 h-3.5 mr-2" />
                                Send Request
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}
