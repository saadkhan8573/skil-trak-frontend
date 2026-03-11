import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { FormProvider } from 'react-hook-form'
import { Button, GlobalModal, ShowErrorNotifications } from '@components'
import { useAppointmentStatusForm } from './hooks/useAppointmentStatusForm'
import { CommonApi } from '@queries'
import { useNotification } from '@hooks'
import { ScheduleAppointmentSuccessAlert } from './ScheduleAppointmentSuccessAlert'
import { AppointmentHeader } from './components/AppointmentHeader'
import { AppointmentInfoCard } from './components/AppointmentInfoCard'
import { StatusOptionsSection } from './components/StatusOptionsSection'
import { ActionButtons } from './components/ActionButtons'
import { AppointmentStatusFormValues } from './types/types'
import { buildPayload } from './utils/appointmentUtils'

interface SelectAppointmentStatusModalProps {
    onClose: () => void
    appointment: any
}

export const SelectAppointmentStatusVII = ({
    onClose,
    appointment,
}: SelectAppointmentStatusModalProps) => {
    const [showSuccessAlert, setShowSuccessAlert] = useState(false)
    const { form, status, unsuccessfulReason } = useAppointmentStatusForm()
    const { notification } = useNotification()

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
        appointment?.appointmentBy?.role === 'industry'
            ? appointment?.appointmentBy
            : appointment?.appointmentFor

    const student =
        appointment?.appointmentBy?.role === 'student'
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
        <>
            <ShowErrorNotifications result={addScheduleOnAppResult} />
            <GlobalModal>
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
                            <div className="bg-white rounded-xl shadow-2xl min-w-2xl w-full animate-in zoom-in-95 duration-300">
                                <AppointmentHeader onClose={onClose} />

                                <div className="p-4 overflow-auto min-h-64 max-h-130">
                                    <AppointmentInfoCard
                                        appointment={appointment}
                                    />

                                    <StatusOptionsSection
                                        status={status}
                                        unsuccessfulReason={unsuccessfulReason}
                                        appointment={appointment}
                                        industry={industry}
                                    />

                                    <ActionButtons
                                        onClose={onClose}
                                        isValid={isValid}
                                        isLoading={
                                            addScheduleOnAppResult.isLoading
                                        }
                                    />
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                )}
            </GlobalModal>
        </>
    )
}
