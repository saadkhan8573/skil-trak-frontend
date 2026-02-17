import { useState, useMemo, useEffect } from 'react'
import {
    X,
    Calendar,
    Clock,
    CheckCircle2,
    User2,
    ArrowRight,
    Sparkles,
} from 'lucide-react'
import { useRouter } from 'next/router'
import { Button, ShowErrorNotifications } from '@components'
import { useNotification } from '@hooks'
import moment from 'moment'

interface TimeSlot {
    time: string
    available: boolean
    id: number
}

interface AvailableDay {
    date: string
    dayName: string
    dayNumber: number
    month: string
    slots: TimeSlot[]
    dates?: any
}

interface ApiSlot {
    id: number
    isActive: boolean
    day: string | null
    startTime: string
    endTime: string
}

interface AvailabilityData {
    id: number
    type: string
    isActive: boolean
    startDate?: string | null
    endDate?: string | null
    slots: ApiSlot[]
    dates: any
}

interface AppointmentBookingModalProps {
    isOpen: boolean
    onClose: any
    availability: AvailabilityData
    supervisorName?: string
    bookAppointment?: any
    resultBookAppointment?: any
}

const generateAvailabilityDays = (
    availability: AvailabilityData
): AvailableDay[] => {
    if (!availability?.slots?.length) return []

    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ]
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const availableDays: AvailableDay[] = []

    /* =======================
       MONTHLY (NEW STRUCTURE)
       ======================= */
    if (availability.type === 'monthly' && availability?.dates?.length) {
        availability?.dates?.forEach((dateItem: any) => {
            if (!dateItem.isActive) return

            // FIX: Create the date object
            const currentDate = new Date(dateItem.date)
            const dayOfWeek = currentDate.getDay()

            // FIX: Manually format YYYY-MM-DD instead of using .toISOString()
            const year = currentDate.getFullYear()
            const month = (currentDate.getMonth() + 1)
                .toString()
                .padStart(2, '0')
            const day = currentDate.getDate().toString().padStart(2, '0')
            const formattedDate = `${year}-${month}-${day}`

            const timeSlots: TimeSlot[] = []

            availability.slots.forEach((slot) => {
                if (!slot.isActive) return

                const [startHour] = slot.startTime.split(':').map(Number)
                const [endHour] = slot.endTime.split(':').map(Number)

                for (let hour = startHour; hour <= endHour; hour++) {
                    const period = hour >= 12 ? 'PM' : 'AM'
                    const displayHour =
                        hour > 12 ? hour - 12 : hour === 0 ? 12 : hour

                    timeSlots.push({
                        time: `${displayHour
                            .toString()
                            .padStart(2, '0')}:00 ${period}`,
                        available: true,
                        id: slot.id,
                    })
                }
            })

            if (timeSlots.length) {
                availableDays.push({
                    date: formattedDate,
                    dayName: dayNames[dayOfWeek],
                    dayNumber: currentDate.getDate(),
                    month: monthNames[currentDate.getMonth()],
                    slots: timeSlots,
                })
            }
        })

        return availableDays
    }

    /* =======================
       WEEKLY (UNCHANGED)
       ======================= */
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

    const dayMap: Record<string, number> = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
    }

    for (let day = today.getDate(); day <= daysInMonth; day++) {
        const currentDate = new Date(currentYear, currentMonth, day)
        const year = currentDate.getFullYear()
        const monthStr = (currentDate.getMonth() + 1)
            .toString()
            .padStart(2, '0')
        const dayStr = currentDate.getDate().toString().padStart(2, '0')
        const formattedDate = `${year}-${monthStr}-${dayStr}`
        const dayOfWeek = currentDate.getDay()

        const dayName = Object.keys(dayMap).find(
            (key) => dayMap[key] === dayOfWeek
        )

        const daySlots = availability.slots.filter(
            (slot) => slot.isActive && slot.day?.toLowerCase() === dayName
        )

        if (!daySlots.length) continue

        const timeSlots: TimeSlot[] = []

        daySlots.forEach((slot) => {
            const [startHour] = slot.startTime.split(':').map(Number)
            const [endHour] = slot.endTime.split(':').map(Number)

            for (let hour = startHour; hour <= endHour; hour++) {
                const period = hour >= 12 ? 'PM' : 'AM'
                const displayHour =
                    hour > 12 ? hour - 12 : hour === 0 ? 12 : hour

                timeSlots.push({
                    time: `${displayHour
                        .toString()
                        .padStart(2, '0')}:00 ${period}`,
                    available: true,
                    id: slot.id,
                })
            }
        })

        if (timeSlots?.length) {
            availableDays.push({
                date: formattedDate,
                dayName: dayNames[dayOfWeek],
                dayNumber: day,
                month: monthNames[currentMonth],
                slots: timeSlots,
            })
        }
    }

    return availableDays
}

export const AppointmentBookingModal = ({
    isOpen,
    onClose,
    availability,
    supervisorName = 'Dr. Sarah Johnson',
    bookAppointment,
    resultBookAppointment,
}: AppointmentBookingModalProps) => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [selectedSlotId, setSelectedSlotId] = useState<any>(null)
    const [isBooked, setIsBooked] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const { notification } = useNotification()
    const router = useRouter()
    const wprId = router.query.wprId
    const indId = router.query.id

    useEffect(() => {
        if (resultBookAppointment && resultBookAppointment.isSuccess) {
            notification.success({
                title: 'Appointment booked',
                description: 'Your appointment has been booked successfully',
            })
            router.push('/')
        }
    }, [resultBookAppointment?.isSuccess])
    // const [bookAppointresult]
    const availableDays = useMemo(
        () => generateAvailabilityDays(availability),
        [availability]
    )

    if (!isOpen) return null

    const handleBooking = () => {
        const payload = {
            time: selectedTime,
            date: selectedDay?.date,
            indId: indId,
            wprId: wprId,

            // id: selectedSlotId,
        }
        if (selectedDate && selectedTime) {
            setIsAnimating(true)
            if (resultBookAppointment && resultBookAppointment.isSuccess) {
                setIsBooked(true)
                setIsAnimating(false)
            }
            if (bookAppointment) {
                bookAppointment(payload)
            }
        }
    }

    const selectedDay = availableDays.find((day) => day.date === selectedDate)

    console.log('selectedDay.slots', availableDays)
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
    return (
        <>
            {resultBookAppointment && (
                <ShowErrorNotifications result={resultBookAppointment} />
            )}
            <div
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center transition-all duration-300 p-3 sm:p-4"
                style={{
                    backgroundColor: 'rgba(4, 72, 102, 0.6)',
                    backdropFilter: 'blur(8px)',
                }}
                onClick={onClose}
            >
                <div
                    className="bg-white w-full overflow-hidden transition-all duration-500 transform sm:max-w-120 md:max-w-180 lg:max-w-220"
                    style={{
                        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        borderRadius: '20px',
                        maxHeight: '92vh',
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <style>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(100%);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @media (min-width: 640px) {
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(20px) scale(0.98);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .slot-card {
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .slot-card:active:not(:disabled) {
            transform: scale(0.95);
          }
          
          .day-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .day-card:active:not(:disabled) {
            transform: scale(0.97);
          }

          @media (min-width: 640px) {
            .slot-card:hover:not(:disabled) {
              transform: translateY(-2px);
            }
            
            .day-card:hover:not(:disabled) {
              transform: translateY(-4px);
            }
          }
        `}</style>

                    <div
                        className="relative px-4 sm:px-6 pt-4 sm:pt-5 pb-4 overflow-hidden"
                        style={{
                            background:
                                'linear-gradient(135deg, #044866 0%, #0D5468 100%)',
                        }}
                    >
                        <div
                            className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 rounded-full opacity-10 blur-3xl"
                            style={{
                                backgroundColor: '#F7A619',
                                transform: 'translate(30%, -30%)',
                            }}
                        />
                        <div
                            className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 rounded-full opacity-10 blur-2xl"
                            style={{
                                backgroundColor: '#F7A619',
                                transform: 'translate(-30%, 30%)',
                            }}
                        />

                        <div className="relative z-10">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-2.5 sm:gap-3 flex-1">
                                    <div
                                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shrink-0"
                                        style={{
                                            background:
                                                'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                                            backdropFilter: 'blur(10px)',
                                        }}
                                    >
                                        <User2 className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-lg sm:text-2xl text-white mb-1">
                                            Book Appointment
                                        </h2>
                                        {/* <p className="text-xs sm:text-sm text-white text-opacity-90 truncate">
                                        with {supervisorName}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1.5 sm:mt-2">
                                        <div
                                            className="px-2 sm:px-2.5 py-0.5 rounded-full text-xs text-white"
                                            style={{
                                                backgroundColor:
                                                    'rgba(247, 166, 25, 0.3)',
                                                fontSize: '10px',
                                            }}
                                        >
                                            Industry Supervisor
                                        </div>
                                    </div> */}
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-95 sm:hover:rotate-90 shrink-0 ml-2"
                                    style={{
                                        backgroundColor:
                                            'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(10px)',
                                    }}
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        className="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto"
                        style={{ maxHeight: 'calc(92vh - 200px)' }}
                    >
                        {!isBooked ? (
                            <div className="space-y-4 sm:space-y-5">
                                <div>
                                    <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                                            style={{
                                                backgroundColor: '#044866',
                                            }}
                                        >
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm sm:text-base text-gray-900">
                                                Select Date
                                            </h3>
                                            <p className="text-xs text-gray-500 hidden sm:block">
                                                Choose your preferred day
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                                        {availableDays.map((day, index) => {
                                            const isSelected =
                                                selectedDate === day.date
                                            const availableCount =
                                                day.slots.filter(
                                                    (s) => s.available
                                                ).length

                                            return (
                                                <button
                                                    title={
                                                        isDisabledUI
                                                            ? 'Selected time is in the past'
                                                            : `${availableCount} slots available`
                                                    }
                                                    key={day.date}
                                                    onClick={() => {
                                                        setSelectedDate(
                                                            day.date
                                                        )
                                                        setSelectedTime(null)
                                                    }}
                                                    disabled={isDisabledUI}
                                                    className={`${isDisabledUI ? 'cursor-not-allowed' : ''} day-card group relative p-3 sm:p-4 rounded-lg sm:rounded-xl text-center touch-manipulation`}
                                                    style={{
                                                        backgroundColor:
                                                            isSelected
                                                                ? '#044866'
                                                                : '#fff',
                                                        border: `2px solid ${
                                                            isSelected
                                                                ? '#044866'
                                                                : '#E5E7EB'
                                                        }`,
                                                        boxShadow: isSelected
                                                            ? '0 6px 12px -3px rgba(4, 72, 102, 0.3)'
                                                            : '0 1px 6px -1px rgba(0, 0, 0, 0.1)',
                                                        animationDelay: `${
                                                            index * 0.05
                                                        }s`,
                                                        animation:
                                                            'fadeIn 0.4s ease-out forwards',
                                                    }}
                                                >
                                                    <div className="mb-1.5 sm:mb-2">
                                                        <div
                                                            className={`text-xs uppercase tracking-wide mb-1 sm:mb-1.5 ${
                                                                isSelected
                                                                    ? 'text-white text-opacity-70'
                                                                    : 'text-gray-500'
                                                            }`}
                                                            style={{
                                                                fontSize:
                                                                    '10px',
                                                            }}
                                                        >
                                                            {day.month}
                                                        </div>
                                                        <div
                                                            className={`text-2xl sm:text-3xl mb-0.5 leading-none ${
                                                                isSelected
                                                                    ? 'text-white'
                                                                    : 'text-gray-900'
                                                            }`}
                                                        >
                                                            {day.dayNumber}
                                                        </div>
                                                        <div
                                                            className={`text-xs ${
                                                                isSelected
                                                                    ? 'text-white text-opacity-90'
                                                                    : 'text-gray-600'
                                                            }`}
                                                        >
                                                            {day.dayName}
                                                        </div>
                                                    </div>

                                                    <div
                                                        className="inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                isSelected
                                                                    ? '#F7A619'
                                                                    : '#F3F4F6',
                                                            color: isSelected
                                                                ? '#fff'
                                                                : '#6B7280',
                                                            fontSize: '10px',
                                                        }}
                                                    >
                                                        <div
                                                            className="w-1 h-1 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    isSelected
                                                                        ? '#fff'
                                                                        : '#10B981',
                                                            }}
                                                        />
                                                        {availableCount} slots
                                                    </div>

                                                    {isSelected && (
                                                        <div
                                                            className="absolute inset-0 rounded-lg sm:rounded-xl opacity-20"
                                                            style={{
                                                                background:
                                                                    'linear-gradient(135deg, #F7A619 0%, transparent 100%)',
                                                                pointerEvents:
                                                                    'none',
                                                            }}
                                                        />
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

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

                                <div
                                    style={{
                                        opacity: selectedDate ? 1 : 0.4,
                                        pointerEvents: selectedDate
                                            ? 'auto'
                                            : 'none',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                                            style={{
                                                backgroundColor: selectedDate
                                                    ? '#F7A619'
                                                    : '#D1D5DB',
                                            }}
                                        >
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm sm:text-base text-gray-900">
                                                Select Time
                                            </h3>
                                            <p className="text-xs text-gray-500 truncate">
                                                {selectedDay
                                                    ? `${selectedDay.dayName}, ${selectedDay.month} ${selectedDay.dayNumber}`
                                                    : 'Choose a date first'}
                                            </p>
                                        </div>
                                    </div>

                                    {selectedDay && (
                                        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                                            {selectedDay.slots.map(
                                                (slot, index) => {
                                                    const isSelected =
                                                        selectedTime ===
                                                        slot.time

                                                    return (
                                                        <button
                                                            key={index}
                                                            onClick={() => {
                                                                slot.available &&
                                                                    setSelectedTime(
                                                                        slot.time
                                                                    )
                                                                setSelectedSlotId(
                                                                    slot.id
                                                                )
                                                            }}
                                                            disabled={
                                                                !slot.available
                                                            }
                                                            className="slot-card relative p-3 rounded-lg text-center touch-manipulation"
                                                            style={{
                                                                backgroundColor:
                                                                    !slot.available
                                                                        ? '#F9FAFB'
                                                                        : isSelected
                                                                          ? '#F7A619'
                                                                          : '#fff',
                                                                border: `2px solid ${
                                                                    !slot.available
                                                                        ? '#E5E7EB'
                                                                        : isSelected
                                                                          ? '#F7A619'
                                                                          : '#E5E7EB'
                                                                }`,
                                                                boxShadow:
                                                                    isSelected
                                                                        ? '0 6px 12px -3px rgba(247, 166, 25, 0.4)'
                                                                        : !slot.available
                                                                          ? 'none'
                                                                          : '0 1px 6px -1px rgba(0, 0, 0, 0.1)',
                                                                cursor: !slot.available
                                                                    ? 'not-allowed'
                                                                    : 'pointer',
                                                                animationDelay: `${
                                                                    index * 0.03
                                                                }s`,
                                                                animation:
                                                                    'fadeIn 0.3s ease-out forwards',
                                                                minHeight:
                                                                    '48px',
                                                            }}
                                                        >
                                                            <div
                                                                className={`text-xs ${
                                                                    !slot.available
                                                                        ? 'text-gray-400'
                                                                        : isSelected
                                                                          ? 'text-white'
                                                                          : 'text-gray-900'
                                                                }`}
                                                            >
                                                                {slot.time}
                                                            </div>
                                                            {!slot.available && (
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <div className="w-full h-0.5 bg-gray-300 transform -rotate-12" />
                                                                </div>
                                                            )}
                                                            {isSelected && (
                                                                <div className="absolute -top-1 -right-1">
                                                                    <CheckCircle2
                                                                        className="w-4 h-4 text-white bg-green-500 rounded-full"
                                                                        fill="currentColor"
                                                                    />
                                                                </div>
                                                            )}
                                                        </button>
                                                    )
                                                }
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="py-8 sm:py-12 text-center">
                                <div
                                    className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full flex items-center justify-center mb-4 sm:mb-5 relative"
                                    style={{ backgroundColor: '#E8F3F7' }}
                                >
                                    <div
                                        className="absolute inset-0 rounded-full"
                                        style={{
                                            background:
                                                'linear-gradient(135deg, #044866 0%, #0D5468 100%)',
                                            animation:
                                                'pulse 2s ease-in-out infinite',
                                        }}
                                    />
                                    <CheckCircle2
                                        className="w-8 h-8 sm:w-10 sm:h-10 text-white relative z-10"
                                        style={{
                                            animation: 'fadeIn 0.5s ease-out',
                                            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))',
                                        }}
                                    />
                                </div>

                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Sparkles
                                        className="w-4 h-4"
                                        style={{ color: '#F7A619' }}
                                    />
                                    <h3
                                        className="text-lg sm:text-xl"
                                        style={{ color: '#044866' }}
                                    >
                                        Success!
                                    </h3>
                                    <Sparkles
                                        className="w-4 h-4"
                                        style={{ color: '#F7A619' }}
                                    />
                                </div>

                                <p className="text-xs sm:text-sm text-gray-600 mb-5 sm:mb-6 max-w-md mx-auto px-4">
                                    Your appointment has been confirmed. You'll
                                    receive a confirmation email shortly.
                                </p>

                                <div
                                    className="max-w-md mx-auto p-5 sm:p-6 rounded-xl"
                                    style={{
                                        background:
                                            'linear-gradient(135deg, #E8F3F7 0%, #FEF3E7 100%)',
                                    }}
                                >
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <Calendar
                                            className="w-4 h-4"
                                            style={{ color: '#044866' }}
                                        />
                                        <p className="text-xs text-gray-600">
                                            Appointment Details
                                        </p>
                                    </div>

                                    <p
                                        className="text-base sm:text-lg mb-1.5"
                                        style={{ color: '#044866' }}
                                    >
                                        {selectedDay?.dayName},{' '}
                                        {selectedDay?.month}{' '}
                                        {selectedDay?.dayNumber}, 2025
                                    </p>
                                    <p
                                        className="text-xl sm:text-2xl mb-3"
                                        style={{ color: '#F7A619' }}
                                    >
                                        {selectedTime}
                                    </p>

                                    <div className="pt-3 border-t border-gray-300">
                                        <p className="text-xs text-gray-600">
                                            with
                                        </p>
                                        <p className="text-sm text-gray-900">
                                            {supervisorName}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {!isBooked && (
                        <div
                            className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 border-t"
                            style={{
                                borderColor: '#E5E7EB',
                                background:
                                    'linear-gradient(to top, #F9FAFB 0%, #fff 100%)',
                                boxShadow:
                                    '0 -3px 5px -1px rgba(0, 0, 0, 0.05)',
                            }}
                        >
                            <div className="flex-1 min-w-0">
                                {selectedDate && selectedTime ? (
                                    <div className="flex items-center gap-2 sm:gap-2.5">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                            style={{
                                                backgroundColor: '#E8F3F7',
                                            }}
                                        >
                                            <CheckCircle2
                                                className="w-4 h-4"
                                                style={{ color: '#044866' }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500 hidden sm:block">
                                                Ready to confirm
                                            </p>
                                            <p
                                                className="text-xs sm:text-sm truncate"
                                                style={{ color: '#044866' }}
                                            >
                                                {selectedDay?.dayName},{' '}
                                                {selectedDay?.month}{' '}
                                                {selectedDay?.dayNumber}
                                                <span className="mx-1.5">
                                                    •
                                                </span>
                                                <span
                                                    style={{ color: '#F7A619' }}
                                                >
                                                    {selectedTime}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 sm:gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                            <Sparkles className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm text-gray-600">
                                                Select date & time
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Button
                                loading={
                                    resultBookAppointment &&
                                    resultBookAppointment.isLoading
                                }
                                onClick={handleBooking}
                                disabled={
                                    !selectedDate ||
                                    !selectedTime ||
                                    isAnimating ||
                                    (resultBookAppointment &&
                                        resultBookAppointment.isLoading)
                                }
                                // className="flex items-center justify-center gap-1.5 relative z-10"
                                Icon={ArrowRight}
                                text="Confirm Booking"
                                variant="primaryNew"
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
