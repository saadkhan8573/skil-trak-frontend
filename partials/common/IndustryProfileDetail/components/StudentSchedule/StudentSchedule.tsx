import { useState } from 'react'
import { getStartOfWeek } from './utilsFunc'
import { employees } from './components/data'
import { ScheduleGrid, ScheduleHeader } from './components'

export const StudentSchedule = () => {
    // get dates from ui
    const date = new Date()
    const month = date.getMonth() + 1
    const getYear = date.getFullYear()
    const firstOfMonth = new Date(getYear, month, 1)
    const [startDate, setStartDate] = useState(firstOfMonth)

    const [activeMonthIndex, setActiveMonthIndex] = useState<number>(
        startDate.getMonth()
    )
    const [year, setYear] = useState<number>(startDate.getFullYear())

    const [view, setView] = useState('week')

    const schedules = [
        {
            employeeId: '1',
            date: '2024-04-22',
            status: 'working',
            time: '8:00 AM - 2:00PM',
        },
        {
            employeeId: '1',
            date: '2024-04-24',
            status: 'working',
            time: '8:00 AM - 2:00PM',
        },
        {
            employeeId: '2',
            date: '2024-04-22',
            status: 'working',
            time: '8:00 AM - 2:00PM',
        },
        {
            employeeId: '2',
            date: '2024-04-24',
            status: 'working',
            time: '8:00 AM - 2:00PM',
        },
        // Add more schedule entries...
    ]

    const handlePrev = () => {
        const newDate = new Date(startDate)
        if (view === 'week') {
            newDate.setDate(newDate.getDate() - 7)
        } else {
            newDate.setMonth(newDate.getMonth() - 1)
        }
        setStartDate(newDate)
    }

    const handleNext = () => {
        const newDate = new Date(startDate)
        if (view === 'week') {
            newDate.setDate(newDate.getDate() + 7)
        } else {
            newDate.setMonth(newDate.getMonth() + 1)
        }
        setStartDate(newDate)
    }
    const handleMonthChange = (month: number) => {
        const newDate = new Date()
        newDate.setMonth(month)
        setStartDate(newDate)
    }
    const adjustedStartDate = getStartOfWeek(startDate)
    const endDate = new Date(adjustedStartDate)
    endDate.setDate(adjustedStartDate.getDate() + 6)

    const getDateDisplay = () => {
        const formatDateComponent = (num: number) =>
            num < 10 ? `0${num}` : num

        const formatDate = (date: Date) =>
            `${date.getFullYear()}-${formatDateComponent(
                date.getMonth() + 1
            )}-${formatDateComponent(date.getDate())}`

        if (view === 'month') {
            // Get the last day of the current month
            const lastDay = new Date(year, activeMonthIndex + 1, 0).getDate()
            return `${year}-${formatDateComponent(
                activeMonthIndex + 1
            )}-${formatDateComponent(1)} - ${year}-${formatDateComponent(
                activeMonthIndex + 1
            )}-${formatDateComponent(lastDay)}`
        } else {
            // Week view with custom format
            return `${formatDate(adjustedStartDate)} - ${formatDate(endDate)}`
        }
    }

    return (
        <div className="flex flex-col bg-gray-100">
            <ScheduleHeader
                startDate={startDate}
                onPrevWeek={handlePrev}
                onNextWeek={handleNext}
                onMonth={handleMonthChange}
                view={view}
                setView={setView}
                setActiveMonthIndex={setActiveMonthIndex}
                setYear={setYear}
                year={year}
                activeMonthIndex={activeMonthIndex}
            />
            <ScheduleGrid
                employees={employees}
                schedules={schedules}
                startDate={startDate}
                view={view}
                getDateDisplay={getDateDisplay}
            />
        </div>
    )
}
