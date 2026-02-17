import {
    Button,
    RadioGroup,
    Select,
    ShowErrorNotifications,
    TextArea,
    TextInput,
    useAuthorizedUserComponent,
} from '@components'
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
import { AlertCircle, CheckCircle2, Flag, X } from 'lucide-react'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'

export enum flagStudentPriorityEnum {
    Critical = 'critical',
    Medium = 'medium',
    High = 'high',
}

export enum flagStudentCategoryEnum {
    Scheduling = 'scheduling',
    Communication = 'communication',
    Documentation = 'documentation',
    Logistics = 'logistics',
    Compliance = 'compliance',
    Capacity = 'capacity',
}

interface FlagStudentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    studentId: number
    workplaceId?: number
}

export function FlagStudentDialog({
    open,
    onOpenChange,
    studentId,
    workplaceId,
}: FlagStudentDialogProps) {
    const { notification } = useNotification()
    const subadmin = useSubadminProfile()

    const [problematicStudent, problematicStudentResult] =
        SubAdminApi.Student.useProblamaticStudent()

    const hasPermission = useAuthorizedUserComponent({
        roles: [UserRoles.ADMIN],
        isHod: subadmin?.departmentMember?.isHod,
    })

    const validationSchema = Yup.object({
        comment: Yup.string().required('Please provide a reason'),
        isReported: Yup.string().required('Please select if you want to report this'),
        title: Yup.string().when('isReported', {
            is: 'yes',
            then: (schema) => schema.required('Title is required'),
            otherwise: (schema) => schema.notRequired(),
        }),
        priority: Yup.string().when('isReported', {
            is: 'yes',
            then: (schema) => schema.required('Priority is required'),
            otherwise: (schema) => schema.notRequired(),
        }),
        category: Yup.string().when('isReported', {
            is: 'yes',
            then: (schema) => schema.required('Category is required'),
            otherwise: (schema) => schema.notRequired(),
        }),
    })

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'all',
        defaultValues: {
            isReported: 'no',
        }
    })

    const isReported = methods.watch('isReported')

    const onSubmit = async (values: any) => {
        const body: any = {
            ...values,
            isReported: values.isReported === 'yes',
        }
        if (workplaceId) body.workplaceId = workplaceId

        const res: any = await problematicStudent({ studentId, body })

        if (res?.data) {
            notification?.[hasPermission ? 'success' : 'warning']({
                title: `Action Successful`,
                description: hasPermission
                    ? 'Student has been flagged.'
                    : 'Flag request sent to Admin for approval.',
            })
            onOpenChange(false)
            methods.reset()
        }
    }

    const priorityOptions = [
        { label: 'Critical', value: flagStudentPriorityEnum.Critical },
        { label: 'High', value: flagStudentPriorityEnum.High },
        { label: 'Medium', value: flagStudentPriorityEnum.Medium },
    ]

    const categoryOptions = [
        { label: 'Scheduling', value: flagStudentCategoryEnum.Scheduling },
        { label: 'Communication', value: flagStudentCategoryEnum.Communication },
        { label: 'Documentation', value: flagStudentCategoryEnum.Documentation },
        { label: 'Logistics', value: flagStudentCategoryEnum.Logistics },
        { label: 'Compliance', value: flagStudentCategoryEnum.Compliance },
        { label: 'Capacity', value: flagStudentCategoryEnum.Capacity },
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] space-0! gap-0! p-0 overflow-hidden border-none shadow-2xl">
                <ShowErrorNotifications result={problematicStudentResult} />

                <div className="px-5 py-1.5 border-b bg-white">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                                <Flag className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-slate-900">
                                    Flag Student
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500">
                                    Mark this student as problematic or needing attention.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col">
                        <div className="p-5 space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <TextArea
                                label={<span className="text-xs font-semibold text-slate-700">Reason for Flagging</span>}
                                required
                                name={'comment'}
                                placeholder={'Explain why this student is being flagged...'}
                                rows={3}
                                className="resize-none text-xs"
                            />

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-700">
                                    Report to Training Organization?
                                </label>
                                <RadioGroup
                                    name="isReported"
                                    options={[
                                        { value: 'yes', label: 'Yes' },
                                        { value: 'no', label: 'No' },
                                    ]}
                                    className="flex gap-4"
                                    showError={false}
                                />
                            </div>

                            {isReported === 'yes' && (
                                <div className="border-t border-slate-100 animate-in fade-in slide-in-from-top-1">
                                    <TextInput
                                        name="title"
                                        label={<span className="text-xs font-semibold text-slate-700">Issue Title</span>}
                                        placeholder="Brief title of the issue"
                                        className="h-9 text-xs"
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Select
                                            label={<span className="text-xs font-semibold text-slate-700">Priority</span>}
                                            name={'priority'}
                                            options={priorityOptions}
                                            onlyValue
                                            className="h-9 text-xs"
                                            menuPlacement='top'
                                        />
                                        <Select
                                            label={<span className="text-xs font-semibold text-slate-700">Category</span>}
                                            name={'category'}
                                            options={categoryOptions}
                                            onlyValue
                                            className="h-9 text-xs"
                                            menuPlacement='top'
                                        />
                                    </div>
                                </div>
                            )}
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
                                variant="error"
                                loading={problematicStudentResult.isLoading}
                                className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white text-xs"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                                {hasPermission ? 'Flag Student' : 'Send Request'}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}
