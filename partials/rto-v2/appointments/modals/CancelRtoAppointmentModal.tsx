import { ActionModal, ShowErrorNotifications } from '@components'
import { useAlert, useNotification } from '@hooks'
import { CommonApi } from '@queries'
import { isLessThan24HoursDifference } from '@utils'
import { FaBan } from 'react-icons/fa'
export const CancelRtoAppointmentModal = ({
    appointment,
    onCancel,
}: {
    appointment: any
    onCancel: () => void
}) => {
    const { alert } = useAlert()
    const { notification } = useNotification()
    const [changeStatus, changeStatusResult] =
        CommonApi.Appointments.cancellAppointment()

    const onConfirmClicked = async () => {
        if (!isLessThan24HoursDifference(appointment?.date)) {
            const res: any = await changeStatus(appointment?.id)
            if (res?.data) {
                notification.error({
                    title: `Cancel Appointment`,
                    description: `Appointment canceled for "${appointment?.appointmentFor?.name} Successfully"`,
                })
                onCancel()
            }
        } else {
            notification.error({
                title: 'Appointment Cant be cancel',
                description: 'Appointment Cant cancel before 1 day',
            })
        }
    }

    return (
        <>
            <ShowErrorNotifications result={changeStatusResult} />
            <ActionModal
                Icon={FaBan}
                variant="error"
                title="Are you sure!"
                description={`You want to cancel appointment <em>"${appointment?.appointmentFor?.name}"</em>?`}
                onConfirm={onConfirmClicked}
                onCancel={onCancel}
                input
                inputKey={appointment?.email}
                actionObject={appointment}
                loading={changeStatusResult.isLoading}
            />
        </>
    )
}
