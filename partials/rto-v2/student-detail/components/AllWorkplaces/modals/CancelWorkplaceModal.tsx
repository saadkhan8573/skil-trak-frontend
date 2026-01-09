import { Button, ShowErrorNotifications, TextArea } from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { AlertTriangle, CheckCircle2, X } from 'lucide-react'

// queries
import { SubAdminApi } from '@queries'
import { useNotification } from '@hooks'

interface onSubmitType {
    note: string
}

interface CancelWorkplaceModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    workplaceId: number
}

export const CancelWorkplaceModal = ({
    open,
    onOpenChange,
    workplaceId,
}: CancelWorkplaceModalProps) => {
    const { notification } = useNotification()

    const [cancelWorkplace, cancelWorkplaceResult] =
        SubAdminApi.Workplace.useCancelWorkplaceStatusMutation()

    useEffect(() => {
        if (cancelWorkplaceResult.isSuccess) {
            notification.success({
                title: 'Workplace Cancelled',
                description: 'Workplace has been cancelled successfully.',
            })
            onOpenChange(false)
        }
    }, [cancelWorkplaceResult])

    const validationSchema = Yup.object({
        note: Yup.string().required('Please provide a reason for cancellation'),
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
                            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-slate-900">
                                    Cancel Workplace
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500">
                                    This action will cancel the workplace request.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col">
                        <div className="px-5 space-y-3">
                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                                <p className="text-[11px] text-amber-800 leading-relaxed">
                                    <span className="font-bold">Important:</span> This is a permanent action. Ensure you have communicated this with the student.
                                </p>
                            </div>

                            <TextArea
                                label={<span className="text-xs font-semibold text-slate-700">Cancellation Note</span>}
                                name={'note'}
                                placeholder={'Provide a reason...'}
                                showError={true}
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
                                Keep workplace
                            </Button>
                            <Button
                                submit
                                variant="error"
                                loading={cancelWorkplaceResult.isLoading}
                                className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white text-xs"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                                Confirm
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}
