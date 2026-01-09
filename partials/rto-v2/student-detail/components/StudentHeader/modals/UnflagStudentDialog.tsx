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
import { CheckCircle2, FlagOff, X } from 'lucide-react'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'

interface UnflagStudentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    studentId: number
}

export function UnflagStudentDialog({
    open,
    onOpenChange,
    studentId,
}: UnflagStudentDialogProps) {
    const { notification } = useNotification()
    const subadmin = useSubadminProfile()

    const [problematicStudent, problematicStudentResult] =
        SubAdminApi.Student.useProblamaticStudent()

    const hasPermission = useAuthorizedUserComponent({
        roles: [UserRoles.ADMIN],
        isHod: subadmin?.departmentMember?.isHod,
    })

    const validationSchema = Yup.object({
        comment: Yup.string().required('Please provide a note for removing the flag'),
    })

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'all',
    })

    const onSubmit = async (values: any) => {
        const res: any = await problematicStudent({
            studentId,
            body: { comment: values.comment },
        })

        if (res?.data) {
            notification?.[hasPermission ? 'success' : 'warning']({
                title: `Action Successful`,
                description: hasPermission
                    ? 'Flag has been removed for this student.'
                    : 'Unflag request sent to Admin for approval.',
            })
            onOpenChange(false)
            methods.reset()
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none shadow-2xl">
                <ShowErrorNotifications result={problematicStudentResult} />

                <div className="px-5 py-3.5 border-b bg-white">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                                <FlagOff className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-slate-900">
                                    Remove Flag
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500">
                                    Switch off student flag status.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col">
                        <div className="p-5 space-y-3">
                            <TextArea
                                label={<span className="text-xs font-semibold text-slate-700">Reason / Update Note</span>}
                                required
                                name={'comment'}
                                placeholder={'Explain why the flag is being removed...'}
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
                                loading={problematicStudentResult.isLoading}
                                className="flex-1 h-10 bg-[#044866] hover:bg-[#0D5468] text-white text-xs"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                                {hasPermission ? 'Remove Flag' : 'Send Request'}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}
