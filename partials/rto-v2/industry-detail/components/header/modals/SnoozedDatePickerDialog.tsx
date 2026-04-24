import { Button, ShowErrorNotifications, TextInput } from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotification } from '@hooks'
import { RtoV2Api } from '@queries'
import { Calendar } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'

interface SnoozedDatePickerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    industryId: number
}

export function SnoozedDatePickerDialog({
    open,
    industryId,
    onOpenChange,
}: SnoozedDatePickerDialogProps) {
    const [snooze, snoozeResult] = RtoV2Api.Industries.snoozeIndustry()

    const { notification } = useNotification()

    const schema = Yup.object().shape({
        startDate: Yup.date()
            .transform((curr, orig) => (orig === '' ? null : curr))
            .nullable()
            .required('Start Date is required')
            .typeError('Invalid Start Date'),
        endDate: Yup.date()
            .transform((curr, orig) => (orig === '' ? null : curr))
            .nullable()
            .required('End Date is required')
            .typeError('Invalid End Date')
            .min(
                Yup.ref('startDate'),
                'End date should be greater than start date'
            ),
    })

    const methods = useForm({
        resolver: yupResolver(schema),
    })

    const onSubmit = async (data: any) => {
        const result: any = await snooze({
            id: industryId,
            ...data,
        })

        if (result?.data) {
            notification.success({
                title: 'Industry Snoozed',
                description: 'Industry Snoozed Successfully',
            })
            onOpenChange(false)
            methods.reset()
        }
    }

    return (
        <>
            <ShowErrorNotifications result={snoozeResult} />
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-0 [&>button]:text-white">
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)}>
                            <DialogHeader className="bg-linear-to-r from-[#044866] to-[#0D5468] p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-white font-bold">
                                            Snoozed Date Picker
                                        </DialogTitle>
                                        <DialogDescription className="text-white/80 text-xs">
                                            Select the start and end dates for
                                            snoozing
                                        </DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="p-6">
                                <TextInput
                                    name="startDate"
                                    label={'Start Date'}
                                    type="date"
                                    className="w-full px-4 py-3 bg-linear-to-br from-[#F8FAFB] to-[#E8F4F8] border border-[#E2E8F0] rounded-xl text-sm text-[#1A2332] placeholder-[#94A3B8] hover:border-[#044866]/30 focus:outline-none focus:ring-2 focus:ring-[#044866]/20 focus:border-[#044866] transition-all"
                                />

                                <TextInput
                                    name="endDate"
                                    label="End Date"
                                    type="date"
                                    className="w-full px-4 py-3 bg-linear-to-br from-[#F8FAFB] to-[#E8F4F8] border border-[#E2E8F0] rounded-xl text-sm text-[#1A2332] placeholder-[#94A3B8] hover:border-[#044866]/30 focus:outline-none focus:ring-2 focus:ring-[#044866]/20 focus:border-[#044866] transition-all"
                                />

                                <div className="flex gap-3">
                                    <Button
                                        submit
                                        loading={snoozeResult.isLoading}
                                        disabled={snoozeResult.isLoading}
                                        className="flex-1 px-4 py-3 bg-linear-to-br from-[#10B981] to-[#059669] hover:shadow-lg text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 h-auto"
                                    >
                                        <Calendar className="w-4 h-4" />
                                        Set Dates
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                </DialogContent>
            </Dialog>
        </>
    )
}
