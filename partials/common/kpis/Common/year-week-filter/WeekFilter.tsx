import { ChevronDown } from 'lucide-react'
import moment, { Moment } from 'moment'
import { useEffect, useState } from 'react'

import { getMonthDates, getWeeksOfCurrentMonth } from './functions'
import { OutsideClickHandler, Typography } from '@components'

export const WeekFilter = ({
    handleDatesChange,
    showDefaultFilter = true,
}: {
    handleDatesChange: (startDate: Moment, endDate: Moment) => void
    showDefaultFilter?: boolean
}) => {
    const [monthDropdownOpen, setMonthDropdownOpen] = useState(false)
    const [yearDropdownOpen, setYearDropdownOpen] = useState(false)
    const [cMonthsDates, setCMonthsDates] = useState<any | null>(null)
    const [selectedMonth, setSelectedMonth] = useState<any>(null)
    const [selectedWeek, setSelectedWeek] = useState<any>(null)
    const [startDate, setStartDate] = useState<Moment | null>(null)
    const [endDate, setEndDate] = useState<Moment | null>(null)

    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]

    const currentYear = moment(selectedMonth).year()
    // const years = [2020, 2021, 2022, 2023, 2024, 2025]
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)

    useEffect(() => {
        const { startDate, endDate } = getMonthDates()
        setSelectedMonth(moment(new Date()))
        if (showDefaultFilter) {
            handleDatesChange(startDate, endDate)
            setStartDate(startDate)
            setEndDate(endDate)
        }
        setCMonthsDates(getWeeksOfCurrentMonth())
    }, [])

    const toggleWeekSelection = (weekIndex: number) => {
        const isSelected = weekIndex === selectedWeek
        setSelectedWeek(isSelected ? null : weekIndex)

        const { startDate, endDate } = getMonthDates(
            moment(cMonthsDates?.[weekIndex]?.startDate)
        )
        handleDatesChange(
            isSelected
                ? startDate
                : moment(cMonthsDates?.[weekIndex]?.startDate),
            isSelected ? endDate : moment(cMonthsDates?.[weekIndex]?.endDate)
        )
        setStartDate(
            isSelected
                ? startDate
                : moment(cMonthsDates?.[weekIndex]?.startDate)
        )
        setEndDate(
            isSelected ? endDate : moment(cMonthsDates?.[weekIndex]?.endDate)
        )
    }

    const handleMonthChange = (monthIndex: number) => {
        const newDate = moment(selectedMonth).month(monthIndex).date(1)
        const { startDate, endDate } = getMonthDates(newDate)
        handleDatesChange(startDate, endDate)
        setStartDate(startDate)
        setEndDate(endDate)
        setSelectedMonth(newDate)
        setCMonthsDates(getWeeksOfCurrentMonth(newDate))
        setSelectedWeek(null)
        setMonthDropdownOpen(false)
    }

    const handleYearChange = (year: number) => {
        const newDate = moment(selectedMonth).year(year).date(1)
        setSelectedMonth(newDate)
        const { startDate, endDate } = getMonthDates(newDate)
        handleDatesChange(startDate, endDate)
        setStartDate(startDate)
        setEndDate(endDate)
        setCMonthsDates(getWeeksOfCurrentMonth(newDate))
        setSelectedWeek(null)
        setYearDropdownOpen(false)
    }
    return (
        <div>
            <div className="flex  items-center justify-between my-4 ">
                <div>
                    <Typography variant="label">Select Filter</Typography>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <OutsideClickHandler
                                onOutsideClick={() => {
                                    setMonthDropdownOpen(false)
                                }}
                            >
                                <button
                                    onClick={() => {
                                        setMonthDropdownOpen(!monthDropdownOpen)
                                        setYearDropdownOpen(false)
                                    }}
                                    className="inline-flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none min-w-[160px]"
                                >
                                    {monthNames[moment(selectedMonth).month()]}
                                    <ChevronDown className="w-4 h-4 ml-2" />
                                </button>

                                {monthDropdownOpen && (
                                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                                        {monthNames.map((month, index) => (
                                            <button
                                                key={month}
                                                className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                                onClick={() =>
                                                    handleMonthChange(index)
                                                }
                                            >
                                                {month}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </OutsideClickHandler>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => {
                                    setYearDropdownOpen(!yearDropdownOpen)
                                    setMonthDropdownOpen(false)
                                }}
                                className="inline-flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none min-w-[120px]"
                            >
                                {moment(selectedMonth).format('YYYY')}
                                <ChevronDown className="w-4 h-4 ml-2" />
                            </button>

                            {yearDropdownOpen && (
                                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                                    {years.map((year) => (
                                        <button
                                            key={year}
                                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                            onClick={() =>
                                                handleYearChange(year)
                                            }
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-x-2">
                    <div
                        className={`bg-info text-white ${cMonthsDates?.length > 4 ? 'px-1.5' : 'px-3'
                            }  py-3 rounded`}
                    >
                        <Typography variant="label" color="text-white">
                            Select Weekly Filter
                        </Typography>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {cMonthsDates &&
                            cMonthsDates?.length > 0 &&
                            cMonthsDates?.map(
                                (
                                    week: { startDate: Date; endDate: Date },
                                    index: number
                                ) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            toggleWeekSelection(index)
                                        }
                                        className={`inline-flex flex-col items-start px-3 py-1.5 ${cMonthsDates?.length > 4
                                                ? 'text-[13px]'
                                                : 'text-sm'
                                            } font-medium border rounded-lg transition-colors
              ${selectedWeek === index
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span>Week {index + 1}</span>
                                        <span
                                            className={`${cMonthsDates?.length > 4
                                                    ? 'text-[11px]'
                                                    : 'text-xs'
                                                } mt-0.5 opacity-80`}
                                        >
                                            {moment(week?.startDate).format(
                                                'DD MMM'
                                            )}{' '}
                                            -{' '}
                                            {moment(week?.endDate).format(
                                                'DD MMM yyyy'
                                            )}
                                        </span>
                                    </button>
                                )
                            )}
                    </div>
                </div>
            </div>

            {/*  */}
            <div className="">
                <Typography variant="small"> Selected Filter </Typography>
                <div className="flex items-center gap-x-3">
                    <Typography variant="small">
                        Start Date:{' '}
                        {startDate
                            ? moment(startDate).format('DD MMM, YYYY')
                            : '---'}
                    </Typography>
                    <Typography variant="small">
                        End Date:{' '}
                        {endDate
                            ? moment(endDate).format('DD MMM, YYYY')
                            : '---'}
                    </Typography>
                </div>
            </div>
        </div>
    )
}
