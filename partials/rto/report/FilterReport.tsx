import { Card, OutsideClickHandler } from '@components'
import { CalendarStyles } from '@components/Calendar/style'
import { useState } from 'react'
import Calendar from 'react-calendar'
import { AiTwotoneFilter } from 'react-icons/ai'
import { RiTimerLine } from 'react-icons/ri'

import { AnnualDropdown } from './AnnualDropdown'

type Props = {
    startDate: Date
    setStartDate: (startDate: Date) => void
    endDate: Date
    setEndDate: (endDate: Date) => void
}

export const FilterReport = ({
    startDate,
    setStartDate,
    endDate,
    setEndDate,
}: Props) => {
    const [dateRange, setDateRange] = useState<any>('')
    const [showCalendars, setShowCalendars] = useState<any>(false)
    const [selectedFilter, setSelectedFilter] = useState<any>('Monthly')

    const [showFilter, setShowFilter] = useState<any>(false)
    // months
    const [year, setYear] = useState<any>({
        label: new Date().getFullYear().toString(),
        value: new Date().getFullYear(),
    })
    const months = [
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
    const [month, setMonth] = useState<any>({
        label: months[new Date().getMonth()],
        value: new Date().getMonth().toString(),
    })

    const handleShowFilter = () => {
        setShowFilter(!showFilter)
    }

    const handleStartDateChange = (date: any) => {
        setStartDate(date)
        // if (selectedFilter === 'Monthly') {
        //     setShowCalendars(false)
        //     setDateRange(
        //         date.toLocaleDateString('en-US', {
        //             month: 'long',
        //             year: 'numeric',
        //         })
        //     )
        // }
        if (selectedFilter === 'Monthly') {
            setShowCalendars(false)
            const montStart = new Date(date)
            const monthEnd = new Date(date)
            monthEnd.setDate(monthEnd.getDate() + 30)
            setEndDate(monthEnd)
            setDateRange(
                `${montStart.toLocaleDateString()} - ${monthEnd.toLocaleDateString()}`
            )
        }
        if (selectedFilter === 'Weekly') {
            setShowCalendars(false)
            const weekStart = new Date(date)
            const weekEnd = new Date(date)
            weekEnd.setDate(weekEnd.getDate() + 6)
            setEndDate(weekEnd)
            setDateRange(
                `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`
            )
        }
    }

    const handleEndDateChange = (date: any) => {
        setEndDate(date)
        if (selectedFilter === 'Range') {
            setShowCalendars(false)
            setDateRange(
                `${startDate.toLocaleDateString()} - ${date.toLocaleDateString()}`
            )
        }
    }

    const handleFilterSelect = (filter: any) => {
        setSelectedFilter(filter)
        setDateRange('')
    }

    const getCalendarByFilter = () => {
        switch (selectedFilter) {
            case 'Monthly':
                return (
                    <Card>
                        <CalendarStyles>
                            <Calendar
                                onChange={handleStartDateChange}
                                value={startDate}
                                onClickDay={(value, event) => {
                                    handleStartDateChange(value)
                                }}
                            />
                        </CalendarStyles>
                    </Card>
                    // <MonthlyDropdown
                    //     setShowCalendars={setShowCalendars}
                    //     month={month}
                    //     year={year}
                    //     setMonth={setMonth}
                    //     setYear={setYear}
                    // />
                )
            case 'Weekly':
                return (
                    <Card>
                        <CalendarStyles>
                            <Calendar
                                onChange={handleStartDateChange}
                                value={startDate}
                                onClickDay={(value, event) => {
                                    handleStartDateChange(value)
                                }}
                            />
                        </CalendarStyles>
                    </Card>
                )
            case 'Annually':
                return (
                    <Card>
                        <AnnualDropdown
                            setShowCalendars={setShowCalendars}
                            year={year}
                            setYear={setYear}
                        />
                    </Card>
                )
            default:
                return (
                    <Card>
                        <div className="flex justify-between w-full">
                            <CalendarStyles>
                                <Calendar
                                    onChange={handleStartDateChange}
                                    value={startDate}
                                />
                            </CalendarStyles>
                            <CalendarStyles>
                                <Calendar
                                    onChange={handleEndDateChange}
                                    value={endDate}
                                />
                            </CalendarStyles>
                        </div>
                    </Card>
                )
        }
    }
    return (
        <>
            <div className="flex items-center gap-x-4 ">
                <OutsideClickHandler
                    onOutsideClick={() => setShowCalendars(false)}
                >
                    <div className="relative">
                        <div
                            onClick={() => setShowCalendars(!showCalendars)}
                            className="flex cursor-pointer items-center gap-x-2 bg-gray-100 px-4 py-1 rounded"
                        >
                            <RiTimerLine className="text-gray-400 " />
                            <button>
                                {dateRange
                                    ? dateRange
                                    : selectedFilter === 'Monthly'
                                        ? `${startDate
                                            .toISOString()
                                            .slice(0, 10)} to ${endDate
                                                .toISOString()
                                                .slice(0, 10)}`
                                        : selectedFilter === 'Annually'
                                            ? `${year?.value}`
                                            : selectedFilter}
                            </button>
                        </div>
                        {showCalendars && (
                            <div className="absolute top-10 right-0 min-w-[500px] calendars-container z-20">
                                {getCalendarByFilter()}
                            </div>
                        )}
                    </div>
                </OutsideClickHandler>

                <OutsideClickHandler
                    onOutsideClick={() => setShowFilter(false)}
                >
                    <div className="relative">
                        <div className="bg-gray-100 rounded p-1">
                            <AiTwotoneFilter
                                size={20}
                                className="text-gray-400 cursor-pointer"
                                onClick={handleShowFilter}
                            />
                        </div>
                        {showFilter && (
                            <div className="absolute z-20 bg-white shadow-xl rounded-lg mt-4">
                                <ul className="">
                                    <li
                                        className="w-full border-b px-6 flex items-center gap-x-2 text-sm py-2  hover:bg-gray-200 cursor-pointer"
                                        onClick={() => {
                                            handleFilterSelect('Range')
                                            setShowCalendars(!showCalendars)
                                            setShowFilter(false)
                                        }}
                                    >
                                        Range
                                    </li>

                                    <li
                                        className="w-full border-b px-6 flex items-center gap-x-2 text-sm py-2  hover:bg-gray-200 cursor-pointer"
                                        onClick={() => {
                                            handleFilterSelect('Weekly')
                                            setShowCalendars(!showCalendars)
                                            setShowFilter(false)
                                        }}
                                    >
                                        Weekly
                                    </li>
                                    <li
                                        className="w-full border-b px-6 flex items-center gap-x-2 text-sm py-2  hover:bg-gray-200 cursor-pointer"
                                        onClick={() => {
                                            handleFilterSelect('Monthly')
                                            setShowCalendars(!showCalendars)
                                            setShowFilter(false)
                                        }}
                                    >
                                        Monthly
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </OutsideClickHandler>
            </div>
        </>
    )
}
