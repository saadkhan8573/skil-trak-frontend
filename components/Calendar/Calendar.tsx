import { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
// import 'react-calendar/dist/Calendar.css'

import { CalendarStyles } from './style'

export const SidebarCalendar = ({
    enabledDays,
    selectedDate,
    setSelectedDate,
}: {
    enabledDays?: number[]
    selectedDate?: Date | null
    setSelectedDate?: (date: Date) => void
}) => {
    const [isDateChange, setIsDateChange] = useState(false)
    const [date, setDate] = useState(new Date())
    const todayDate = new Date(Date.now() - 3600 * 1000 * 24)

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        if (setSelectedDate && isDateChange) {
            setSelectedDate(date)
        }
    }, [date, isDateChange])

    useEffect(() => {
        if (!mounted) {
            setMounted(true)
        }
    }, [])

    return mounted ? (
        <CalendarStyles>
            <Calendar
                {...(enabledDays
                    ? {
                        tileDisabled: ({ date }) =>
                            !enabledDays?.includes(date.getDay()) ||
                            date < todayDate,
                    }
                    : {})}
                onChange={(value) => {
                    if (value instanceof Date) {
                        setDate(value)
                        setIsDateChange(true)
                    }
                }}
                value={selectedDate || date}
            />
        </CalendarStyles>
    ) : null
}
