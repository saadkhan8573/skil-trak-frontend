import { Button, ShowErrorNotifications, TextArea } from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { UserRoles } from '@constants'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotification, useSubadminProfile } from '@hooks'
import { SubAdminApi } from '@queries'
import { useAuthorizedUserComponent } from '@components'
import { AlertCircle, CheckCircle2, Moon, X } from 'lucide-react'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'

interface NotContactableStudentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    studentId: number
}

export function NotContactableStudentDialog({
    open,
    onOpenChange,
    studentId,
}: NotContactableStudentDialogProps) {
    const { notification } = useNotification()
    const subadmin = useSubadminProfile()

    const [notContactable, notContactableResult] =
        SubAdminApi.Student.useNotContactable()

    const hasPermission = useAuthorizedUserComponent({
        roles: [UserRoles.ADMIN],
        isHod: subadmin?.departmentMember?.isHod,
    })

    const validationSchema = Yup.object({
        comment: Yup.string().required('Please provide a reason'),
    })

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'all',
    })

    const onSubmit = async (values: any) => {
        const res: any = await notContactable({
            id: studentId,
            ...values,
        })

        if (res?.data) {
            notification?.[hasPermission ? 'success' : 'warning']({
                title: `Action Successful`,
                description: hasPermission
                    ? 'Student marked as non-contactable.'
                    : 'Request sent to Admin for approval.',
            })
            onOpenChange(false)
            methods.reset()
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none shadow-2xl">
                <ShowErrorNotifications result={notContactableResult} />

                <div className="px-5 py-3.5 border-b bg-white">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                                <Moon className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-slate-900">
                                    Non-Contactable
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500">
                                    Mark this student as non-contactable.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col">
                        <div className="p-5 space-y-3">
                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2.5">
                                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-amber-800 leading-relaxed">
                                    {hasPermission
                                        ? "This will immediately snooze the student's profile from active placement lists."
                                        : "Your request will be sent to the Admin for approval."}
                                </p>
                            </div>

                            <TextArea
                                label={<span className="text-xs font-semibold text-slate-700">Reason / Note</span>}
                                required
                                name={'comment'}
                                placeholder={'Provide a reason for this status...'}
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
                                Cancel
                            </Button>
                            <Button
                                submit
                                variant="primaryNew"
                                loading={notContactableResult.isLoading}
                                className="flex-1 h-10 bg-[#044866] hover:bg-[#0D5468] text-white text-xs"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                                {hasPermission ? 'Confirm' : 'Send Request'}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}
