import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { FormProvider } from 'react-hook-form'
import { ShowErrorNotifications } from '@components'
import { useAppointmentStatusForm } from './hooks/useAppointmentStatusForm'
import { CommonApi } from '@queries'
import { ScheduleAppointmentSuccessAlert } from './ScheduleAppointmentSuccessAlert'
import { AppointmentInfoCard } from './components/AppointmentInfoCard'
import { StatusOptionsSection } from './components/StatusOptionsSection'
import { ActionButtons } from './components/ActionButtons'
import { AppointmentStatusFormValues } from './types/types'
import { buildPayload } from './utils/appointmentUtils'
import { UserRoles } from '@constants'
import { useEffect, useState } from 'react'

interface SelectAppointmentStatusModalProps {
    isOpen: boolean
    onClose: () => void
    appointment: any
}

export const SelectAppointmentStatusVII = ({
    isOpen,
    onClose,
    appointment,
}: SelectAppointmentStatusModalProps) => {
    const [showSuccessAlert, setShowSuccessAlert] = useState(false)
    const { form, status, unsuccessfulReason } = useAppointmentStatusForm()

    const {
        handleSubmit,
        formState: { isValid },
    } = form

    const [addScheduleOnApp, addScheduleOnAppResult] =
        CommonApi.Appointments.useAddScheduleOnAppointmentStatus()

    // Handle API response
    useEffect(() => {
        if (!addScheduleOnAppResult.isSuccess) return

        if (status === 'successful') {
            setShowSuccessAlert(true)
        } else {
            onClose()
        }
    }, [addScheduleOnAppResult.isSuccess, status, onClose])

    // Extract industry and student from appointment
    const industry =
        appointment?.appointmentBy?.role === UserRoles.INDUSTRY
            ? appointment?.appointmentBy
            : appointment?.appointmentFor

    const student =
        appointment?.appointmentBy?.role === UserRoles.STUDENT
            ? appointment?.appointmentBy
            : appointment?.appointmentFor

    const handleSave = (formData: AppointmentStatusFormValues) => {
        const payload = buildPayload(
            formData,
            status,
            appointment,
            industry,
            student
        )
        addScheduleOnApp(payload)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl! p-0 overflow-hidden border-none shadow-2xl">
                <ShowErrorNotifications result={addScheduleOnAppResult} />
                {addScheduleOnAppResult.isSuccess && showSuccessAlert ? (
                    <ScheduleAppointmentSuccessAlert
                        showSuccessAlert={showSuccessAlert}
                        setShowSuccessAlert={setShowSuccessAlert}
                        handleSuccessAlertClose={onClose}
                    />
                ) : (
                    <FormProvider {...form}>
                        <form
                            onSubmit={handleSubmit(handleSave)}
                            className="w-full"
                        >
                            <div className="bg-white">
                                <DialogHeader className="bg-[#0D5468] text-white px-6 py-4 relative">
                                    <DialogTitle className="text-white text-xl font-bold tracking-tight">
                                        Appointment Status Review
                                    </DialogTitle>
                                </DialogHeader>

                                <div className="p-6 overflow-y-auto max-h-[85vh]">
                                    <AppointmentInfoCard
                                        appointment={appointment}
                                    />

                                    <div className="mt-6">
                                        <StatusOptionsSection
                                            status={status}
                                            unsuccessfulReason={
                                                unsuccessfulReason
                                            }
                                            appointment={appointment}
                                            industry={industry}
                                        />
                                    </div>

                                    <div className="mt-8 border-t pt-6">
                                        <ActionButtons
                                            onClose={onClose}
                                            isValid={isValid}
                                            isLoading={
                                                addScheduleOnAppResult.isLoading
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                )}
            </DialogContent>
        </Dialog>
    )
}
