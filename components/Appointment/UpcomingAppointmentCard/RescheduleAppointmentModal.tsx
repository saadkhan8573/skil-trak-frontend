import { Button } from '@components/buttons'
import { TimeSlots } from '@components/sections'
import { Typography } from '@components/Typography'
import React, { useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { CommonApi } from '@queries'
import { ShowErrorNotifications } from '@components/ShowErrorNotifications'
import { useNotification } from '@hooks'
import moment from 'moment-timezone'
import {
    Appointment,
    SelectedTimeType,
    SubadminAvailabilitiesList,
} from '@types'
import { Portal } from '@components/Portal'

export const RescheduleAppointmentModal = ({
    onCancel,
    appointment,
}: {
    onCancel: () => void
    appointment: Appointment
}) => {
    const { notification } = useNotification()

    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedTime, setSelectedTime] = useState<SelectedTimeType | null>(
        null
    )

    const [slots, setSlots] = useState(true)

    useEffect(() => {
        if (appointment?.date) {
            setSelectedDate(new Date(appointment?.date))
        }
    }, [appointment])

    useEffect(() => {
        setSelectedTime(null)
    }, [selectedDate])

    const [rescheduleAppointment, rescheduleAppointmentResult] =
        CommonApi.Appointments.rescheduleAppointment()

    useEffect(() => {
        if (rescheduleAppointmentResult.isSuccess) {
            notification.success({
                title: 'Appointment Rescheduled',
                description: 'Appointment Rescheduled Successfully',
            })
            onCancel()
        }
    }, [rescheduleAppointmentResult])

    const timeSlots =
        CommonApi.Appointments.getRescheduleAppointmentsAvailableSlots(
            {
                id: Number(appointment?.type?.id),
                date: selectedDate?.toISOString(),
                forUser: appointment?.appointmentFor?.id,
                byUser: appointment?.appointmentBy?.id,
            },
            {
                skip:
                    !selectedDate ||
                    !appointment?.type?.id ||
                    !appointment?.appointmentFor?.id ||
                    !appointment?.appointmentBy?.id ||
                    !slots,
            }
        )

    const onSubmit = () => {
        rescheduleAppointment({
            id: appointment?.id,
            body: {
                ...selectedTime,
                date: moment(selectedDate)
                    .tz('Australia/Melbourne')
                    .format('YYYY-MM-DD') as any,
            },
        })
    }

    return (
        <>
            <ShowErrorNotifications result={rescheduleAppointmentResult} />
            <Portal>
                <div className="bg-[#00000050] w-full h-screen flex items-center justify-center fixed top-0 left-0 z-1001">
                    <div className="relative bg-white rounded-2xl flex flex-col items-center gap-y-6 shadow-xl min-w-[450px] px-16 py-4">
                        <FaTimes
                            onClick={onCancel}
                            className="absolute top-3 right-3 text-lg text-gray-500 cursor-pointer"
                        />

                        <div className="h-[480px] overflow-auto custom-scrollbar">
                            <div className="mr-auto">
                                <div className="mb-2">
                                    <Typography variant={'subtitle'} left>
                                        Reschedule Appointment
                                    </Typography>
                                </div>

                                <Typography variant={'label'}>
                                    Appointment Time
                                </Typography>
                                <div className="">
                                    <Typography
                                        variant={'label'}
                                        color={'text-gray-600'}
                                    >
                                        {moment(appointment?.date).format(
                                            'dddd, Do MMMM, YYYY'
                                        )}
                                    </Typography>
                                    <div className="flex gap-x-2 items-center">
                                        <p className="text-xl font-bold text-gray-800">
                                            {moment(
                                                appointment?.startTime,
                                                'hh:mm:ss'
                                            ).format('hh:mm a')}{' '}
                                            -{' '}
                                            {moment(
                                                appointment?.endTime,
                                                'hh:mm:ss'
                                            ).format('hh:mm a')}
                                        </p>
                                        <Typography
                                            variant={'muted'}
                                            color={'text-gray-800'}
                                        >
                                            ~{appointment?.totalMinutes} Minutes
                                        </Typography>
                                    </div>
                                </div>

                                <Typography variant={'muted'}>
                                    Appointment Between
                                </Typography>
                                <div className="flex items-center flex-wrap gap-x-1">
                                    <Typography variant={'subtitle'}>
                                        {appointment?.appointmentFor?.name} (
                                        {appointment?.appointmentFor?.role})
                                    </Typography>
                                    <Typography variant={'muted'}>
                                        And
                                    </Typography>
                                    <Typography variant={'subtitle'}>
                                        {appointment?.appointmentBy?.name} (
                                        {appointment?.appointmentBy?.role})
                                    </Typography>
                                </div>
                            </div>
                            <TimeSlots
                                setSelectedDate={setSelectedDate}
                                selectedDate={selectedDate}
                                setSelectedTime={setSelectedTime}
                                selectedTime={selectedTime}
                                appointmentAvailability={
                                    [{}] as SubadminAvailabilitiesList[]
                                }
                                userAvailabilities={timeSlots?.data}
                                loading={
                                    timeSlots?.isLoading ||
                                    timeSlots?.isFetching
                                }
                            />
                        </div>
                        <div className="ml-auto">
                            <Button
                                text={'Submit'}
                                onClick={onSubmit}
                                loading={rescheduleAppointmentResult.isLoading}
                                disabled={
                                    rescheduleAppointmentResult.isLoading ||
                                    !selectedDate ||
                                    !selectedTime
                                }
                            />
                        </div>
                    </div>
                </div>
            </Portal>
        </>
    )
}
