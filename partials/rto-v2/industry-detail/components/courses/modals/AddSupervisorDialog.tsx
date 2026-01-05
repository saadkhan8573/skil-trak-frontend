import {
    Button,
    Select,
    ShowErrorNotifications,
    TextArea,
    TextInput,
} from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'

import { useNotification } from '@hooks'
import { IndustryApi } from '@queries'
import { useAppSelector } from '@redux/hooks'
import { Course } from '@types'
import { Award, Briefcase, Sparkles, UserCheck } from 'lucide-react'
import { SupervisorQualification } from '@partials/common'

interface AddSupervisorDialogProps {
    open: boolean
    course?: Course
    sectorId: number | null
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function AddSupervisorDialog({
    open,
    course,
    sectorId,
    onOpenChange,
    onSuccess,
}: AddSupervisorDialogProps) {
    const { notification } = useNotification()

    const industryDetail = useAppSelector(
        (state) => state.industry.industryDetail
    )

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required!'),
        position: Yup.string().required('Role is required!'),
        experience: Yup.number().required('Experience is required!'),
        level: Yup.number().required('Qualification is required!'),
        title: Yup.string().required('Title is required!'),
        email: Yup.string()
            .email('Invalid email')
            .required('Email is required!'),
        phone: Yup.string().required('Phone is required!'),
    })

    const methods = useForm({
        mode: 'all',
        defaultValues: {
            name: '',
            title: '',
            role: '',
            experience: '',
            description: '',
            phone: '',
            email: '',
        },
        resolver: yupResolver(validationSchema),
    })

    const [addSupervisor, addSupervisorResult] =
        IndustryApi.Supervisor.addSupervisor()

    const handleSubmit = async (values: any) => {
        console.log({
            sectorId,
            industryDetail
        })
        if (!sectorId || !industryDetail?.id) return

        const res: any = await addSupervisor({
            ...values,
            experience: parseInt(values.experience) || 0,
            industry: industryDetail?.id,
            sector: sectorId,
        })

        if (res?.data) {
            notification.success({
                title: 'Supervisor Added',
                description: 'Supervisor Added Successfully',
            })
            methods.reset()
            onSuccess && onSuccess()
            onOpenChange(false)
        }
    }

    const isLoading = addSupervisorResult.isLoading

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <ShowErrorNotifications result={addSupervisorResult} />
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center relative">
                            <UserCheck className="w-6 h-6 text-white" />
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#F7A619] rounded-full flex items-center justify-center">
                                <Sparkles className="w-3 h-3 text-white" />
                            </div>
                        </div>
                        <div>
                            <DialogTitle className="text-lg">
                                Add Supervisor Details
                            </DialogTitle>
                            {course && (
                                <DialogDescription className="text-xs">
                                    {course?.code} - {course?.title}
                                </DialogDescription>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                {/* Success Banner */}
                <div className="bg-gradient-to-r from-[#10B981]/10 to-[#059669]/10 border border-[#10B981]/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-lg flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-[#10B981] mb-1">
                                🎉 Facility Checklist Approved!
                            </h4>
                            <p className="text-xs text-[#059669]">
                                Great job! The facility checklist has been
                                approved. Now let's add a supervisor to complete
                                the course setup and turn it green.
                            </p>
                        </div>
                    </div>
                </div>

                <FormProvider {...methods}>
                    <form
                        onSubmit={methods.handleSubmit(handleSubmit)}
                        className="space-y-4"
                    >
                        {/* Personal Information */}
                        <div className="bg-[#F8FAFB] rounded-lg p-4 border border-[#E2E8F0] space-y-3">
                            <h4 className="text-sm font-bold text-[#1A2332] flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-[#044866]" />
                                Personal Information
                            </h4>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                    <TextInput
                                        name="name"
                                        label="Full Name"
                                        placeholder="e.g., Sarah Johnson"
                                        className="text-xs h-9"
                                        validationIcons
                                        required
                                    />
                                </div>

                                <div>
                                    <TextInput
                                        name="position"
                                        label="Role/Position"
                                        placeholder="e.g., Senior Manager"
                                        className="text-xs h-9"
                                        validationIcons
                                        required
                                    />
                                </div>

                                <div>
                                    <TextInput
                                        name="experience"
                                        label="Years of Experience"
                                        type="number"
                                        placeholder="e.g., 12"
                                        min="0"
                                        className="text-xs h-9"
                                        validationIcons
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Qualifications */}
                        <div className="bg-[#F8FAFB] rounded-lg p-4 border border-[#E2E8F0] space-y-3">
                            <h4 className="text-sm font-bold text-[#1A2332] flex items-center gap-2">
                                <Award className="w-4 h-4 text-[#044866]" />
                                Qualifications
                            </h4>

                            <div>
                                <div className="relative z-30">
                                    <Select
                                        name="level"
                                        label={'Qualification'}
                                        options={SupervisorQualification}
                                        onlyValue
                                    // onChange={(e: number) => {
                                    //     setSelectedQualification(e)
                                    // }}
                                    // value={SupervisorQualification?.find(
                                    //     (l: OptionType) =>
                                    //         l.value === selectedQualification
                                    // )}
                                    // menuPlacement="top"
                                    />
                                </div>

                                <div>
                                    <TextInput
                                        name="title"
                                        label="Title"
                                        placeholder="e.g., Registered Nurse, Bachelor of Nursing"
                                        className="text-xs h-9"
                                        validationIcons
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-[#F8FAFB] rounded-lg p-4 border border-[#E2E8F0] space-y-3">
                            <h4 className="text-sm font-bold text-[#1A2332] flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-[#044866]" />
                                Contact Information
                            </h4>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <TextInput
                                        name="email"
                                        label="Email Address"
                                        type="email"
                                        placeholder="supervisor@company.com.au"
                                        className="text-xs h-9"
                                        validationIcons
                                        required
                                    />
                                </div>

                                <div>
                                    <TextInput
                                        name="phone"
                                        label="Phone Number"
                                        type="tel"
                                        placeholder="+61 2 9876 5432"
                                        className="text-xs h-9"
                                        validationIcons
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-2">
                            <Button
                                variant="secondary"
                                onClick={() => onOpenChange(false)}
                                className="flex-1 h-10"
                            >
                                Skip for Now
                            </Button>
                            <Button
                                submit
                                loading={isLoading}
                                disabled={isLoading}
                                className="flex-1 bg-gradient-to-r from-[#044866] to-[#0D5468] hover:from-[#0D5468] hover:to-[#044866] text-white gap-2 h-10"
                            >
                                <UserCheck className="w-4 h-4" />
                                Add Supervisor & Complete Setup
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}
