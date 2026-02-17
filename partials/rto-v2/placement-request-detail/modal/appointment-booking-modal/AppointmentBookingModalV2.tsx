import React, { useEffect, useMemo, useState } from 'react'
import {
    AvailabilityData,
    generateAvailabilityDays,
} from './generateAvailabilityDays'
import { useNotification } from '@hooks'
import { useRouter } from 'next/router'
import moment from 'moment'
import { GlobalStyles } from './apptModalStyles'
import { ShowErrorNotifications } from '@components'
import { ModalHeader } from './ModalHeader'
import { DateSection } from './DateSection'
import { ArrowRight } from 'lucide-react'
import { TimeSection } from './TimeSection'
import { SuccessState } from './SuccessState'
import { BookingFooter } from './BookingFooter'
import { RtoV2Api } from '@queries'

interface AppointmentBookingModalProps {
    availability: AvailabilityData
    supervisorName?: string
    // bookAppointment: any
    // resultBookAppointment: any
    wprId: number
    indId: number
    onClose?: () => void
}

export const AppointmentBookingModalV2 = ({
    availability,
    supervisorName = 'Dr. Sarah Johnson',
    // bookAppointment,
    // resultBookAppointment,
    wprId,
    indId,
    onClose,
}: AppointmentBookingModalProps) => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [selectedSlotId, setSelectedSlotId] = useState<any>(null)
    const [isBooked, setIsBooked] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const { notification } = useNotification()
    const router = useRouter()
    const [bookAppointment, resultBookAppointment] =
        RtoV2Api.Students.useBookAppointmentExternally()
    const availableDays = useMemo(
        () => generateAvailabilityDays(availability),
        [availability]
    )

    const selectedDay = availableDays.find((day) => day.date === selectedDate)

    const isPastAppointment =
        selectedDate && selectedTime
            ? moment(
                  `${selectedDate} ${selectedTime}`,
                  'YYYY-MM-DD hh:mm A'
              ).isBefore(moment())
            : false

    const isPastSchedule = availableDays.every((day) =>
        moment(day.date).endOf('day').isBefore(moment())
    )

    const isDisabledUI = isPastSchedule || isPastAppointment

    useEffect(() => {
        if (resultBookAppointment?.isSuccess) {
            notification.success({
                title: 'Appointment booked',
                description: 'Your appointment has been booked successfully',
            })
            setIsBooked(true)
            setIsAnimating(false)
            if (onClose) {
                onClose()
            } else {
                setTimeout(() => {
                    router.push('/')
                }, 2000)
            }
        }
    }, [resultBookAppointment])

    const handleDateSelect = (date: string) => {
        setSelectedDate(date)
        setSelectedTime(null)
    }

    const handleTimeSelect = (time: string, slotId: number) => {
        setSelectedTime(time)
        setSelectedSlotId(slotId)
    }

    const handleBooking = () => {
        const payload = {
            time: selectedTime,
            date: selectedDay?.date,
            indId: indId,
            wprId: wprId,
        }

        if (selectedDate && selectedTime) {
            setIsAnimating(true)
            if (bookAppointment) {
                bookAppointment(payload)
            }
        }
    }

    return (
        <>
            <ShowErrorNotifications result={resultBookAppointment} />
            <GlobalStyles />

            <div
                className="bg-white w-full overflow-hidden transition-all duration-500 transform"
                style={{
                    borderRadius: '20px',
                    maxHeight: '92vh',
                }}
            >
                <ModalHeader
                    supervisorName={supervisorName}
                    onClose={onClose}
                />

                <div
                    className="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto"
                    style={{ maxHeight: 'calc(92vh - 200px)' }}
                >
                    {!isBooked ? (
                        <div className="space-y-4 sm:space-y-5">
                            <DateSection
                                availableDays={availableDays}
                                selectedDate={selectedDate}
                                onDateSelect={handleDateSelect}
                                isDisabled={isDisabledUI}
                            />

                            {selectedDate && (
                                <div className="flex items-center gap-2.5">
                                    <div className="flex-1 h-px bg-gray-200" />
                                    <ArrowRight
                                        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                                        style={{ color: '#F7A619' }}
                                    />
                                    <div className="flex-1 h-px bg-gray-200" />
                                </div>
                            )}

                            <TimeSection
                                selectedDay={selectedDay}
                                selectedTime={selectedTime}
                                onTimeSelect={handleTimeSelect}
                                isEnabled={!!selectedDate}
                            />
                        </div>
                    ) : (
                        <SuccessState
                            selectedDay={selectedDay}
                            selectedTime={selectedTime}
                            supervisorName={supervisorName}
                        />
                    )}
                </div>

                {!isBooked && (
                    <BookingFooter
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        selectedDay={selectedDay}
                        isLoading={resultBookAppointment?.isLoading}
                        onBooking={handleBooking}
                    />
                )}
            </div>
        </>
    )
}
