import { Card, OutsideClickHandler } from '@components'
import { CalendarStyles } from '@components/Calendar/style'
import { useState } from 'react'
import Calendar from 'react-calendar'
import { AiTwotoneFilter } from 'react-icons/ai'
import { RiTimerLine } from 'react-icons/ri'


type Props = {
    startDate: Date
    setStartDate: (startDate: Date) => void
    endDate: Date
    setEndDate: (endDate: Date) => void
}

export const FilterInvoices = ({
    startDate,
    setStartDate,
    endDate,
    setEndDate,
}: Props) => {
    const [dateRange, setDateRange] = useState<any>('')
    const [showCalendars, setShowCalendars] = useState<any>(false)
    const [selectedFilter, setSelectedFilter] = useState<any>('Fortnightly')

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
        if (selectedFilter === 'Monthly') {
            setShowCalendars(false)
            const monthStart = new Date(date)
            const monthEnd = new Date(date)
            monthEnd.setDate(monthEnd.getDate() + 30)
            setEndDate(monthEnd)
            setDateRange(
                `${monthStart.toLocaleDateString()} - ${monthEnd.toLocaleDateString()}`
            )
        }
        if (selectedFilter === 'Fortnightly') {
            setShowCalendars(false)
            const weekStart = new Date(date)
            const weekEnd = new Date(date)
            weekEnd.setDate(weekEnd.getDate() + 13)
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
                )
            case 'Fortnightly':
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
            // case 'Annually':
            //     return (
            //         <Card>
            //             <AnnualDropdown
            //                 setShowCalendars={setShowCalendars}
            //                 year={year}
            //                 setYear={setYear}
            //             />
            //         </Card>
            //     )
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
                                        ? `${month?.label} - ${year?.value}`
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
                        {/* <button onClick={handleShowFilter}>{selectedFilter}</button> */}
                        <div className="bg-gray-100 rounded p-1">
                            <AiTwotoneFilter
                                size={20}
                                className="text-gray-400 cursor-pointer"
                                onClick={handleShowFilter}
                            />
                        </div>
                        {showFilter && (
                            <div className="absolute z-20 bg-white shadow-xl top-10 right-0 rounded-lg">
                                <ul className="">
                                    <li
                                        className="w-full border-b px-6 flex items-center gap-x-2 text-sm py-2  hover:bg-gray-200 cursor-pointer"
                                        onClick={() => {
                                            handleFilterSelect('Range')
                                            setShowFilter(false)
                                        }}
                                    >
                                        Range
                                    </li>
                                    <li
                                        className="w-full border-b px-6 flex items-center gap-x-2 text-sm py-2  hover:bg-gray-200 cursor-pointer"
                                        onClick={() => {
                                            handleFilterSelect('Monthly')
                                            setShowFilter(false)
                                        }}
                                    >
                                        Monthly
                                    </li>
                                    <li
                                        className="w-full border-b px-6 flex items-center gap-x-2 text-sm py-2  hover:bg-gray-200 cursor-pointer"
                                        onClick={() => {
                                            handleFilterSelect('Fortnightly')
                                            setShowFilter(false)
                                        }}
                                    >
                                        Fortnightly
                                    </li>
                                    {/* <li
                                        className="w-full border-b px-6 flex items-center gap-x-2 text-sm py-2  hover:bg-gray-200 cursor-pointer"
                                        onClick={() => {
                                            handleFilterSelect('Annually')
                                            setShowFilter(false)
                                        }}
                                    >
                                        Annually
                                    </li> */}
                                </ul>
                            </div>
                        )}
                    </div>
                </OutsideClickHandler>
            </div>
        </>
    )
}
