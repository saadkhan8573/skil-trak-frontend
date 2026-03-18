import { Button, ShowErrorNotifications, TextArea } from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { yupResolver } from '@hookform/resolvers/yup'
import { AlertTriangle, Clock, Send, X } from 'lucide-react'
import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'

// queries
import { useNotification } from '@hooks'
import { SubAdminApi } from '@queries'

interface onSubmitType {
    note: string
}

interface TerminateWorkplaceRequestModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    workplaceId: number
    onSuccess?: (note: string) => void
}

export const TerminateWorkplaceRequestModal = ({
    open,
    onOpenChange,
    workplaceId,
    onSuccess,
}: TerminateWorkplaceRequestModalProps) => {
    const { notification } = useNotification()
    const [submittedNote, setSubmittedNote] = React.useState('')

    const [terminateWorkplace, terminateWorkplaceResult] =
        SubAdminApi.Workplace.useTerminateRequestWP()

    useEffect(() => {
        if (terminateWorkplaceResult.isSuccess) {
            notification.success({
                title: 'Termination Request Submitted',
                description:
                    'Your termination request has been sent to the Admin for approval.',
                position: 'bottomleft',
            })
            onOpenChange(false)
            if (onSuccess && submittedNote) {
                onSuccess(submittedNote)
            }
        }
    }, [
        terminateWorkplaceResult,
        submittedNote,
        onSuccess,
        onOpenChange,
        notification,
    ])

    const validationSchema = Yup.object({
        note: Yup.string().required(
            'Keep it professional. Please provide a clear reason for the termination request.'
        ),
    })

    const methods = useForm<onSubmitType>({
        resolver: yupResolver(validationSchema),
        mode: 'all',
    })

    const onSubmit = (values: onSubmitType) => {
        terminateWorkplace({
            id: Number(workplaceId),
            comment: values?.note,
        })
        setSubmittedNote(values?.note)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none shadow-2xl">
                <ShowErrorNotifications result={terminateWorkplaceResult} />

                <div className="px-5 py-3.5 border-b bg-white">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-slate-900">
                                    Request Termination
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500">
                                    Submit a workplace termination request to
                                    Admin.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <FormProvider {...methods}>
                    <form
                        onSubmit={methods.handleSubmit(onSubmit)}
                        className="flex flex-col"
                    >
                        <div className="px-5 space-y-3">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-2.5">
                                <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-blue-800 leading-relaxed">
                                    As a SubAdmin, your request requires Admin
                                    approval before the workplace is terminated.
                                </p>
                            </div>

                            <TextArea
                                label={
                                    <span className="text-xs font-semibold text-slate-700">
                                        Reason for Termination
                                    </span>
                                }
                                required
                                name={'note'}
                                placeholder={
                                    'e.g., Serious compliance issues or student misconduct...'
                                }
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
                                loading={terminateWorkplaceResult.isLoading}
                                className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white text-xs"
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
