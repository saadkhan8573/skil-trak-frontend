import { useEffect, useState } from 'react'
// Layouts
// Types
import {
    Button,
    Card,
    OutsideClickHandler,
    Select,
    StatusOptions,
    Typography,
    workplaceProgressOptions,
} from '@components'
import { CalendarStyles } from '@components/Calendar/style'
import Calendar from 'react-calendar'

import { CommonApi } from '@queries'
import { OptionType } from '@types'
import { WorkplaceCurrentStatus, queryToUrl, removeEmptyValues } from '@utils'
import moment from 'moment'
import { RiTimerLine } from 'react-icons/ri'


export const AllStudentsReport = () => {
    const weekEnd = new Date()
    weekEnd.setDate(weekEnd.getDate() - 6)
    const [startDate, setStartDate] = useState<any>(weekEnd)
    const [endDate, setEndDate] = useState<any>(new Date())
    const [showCalendars, setShowCalendars] = useState<boolean>(false)
    const [dateRange, setDateRange] = useState<any>({
        startDate: '',
        endDate: '',
    })
    const [formValues, setFormValues] = useState<{
        rtoId: number | null
        courseId: number | null
        currentStatus: WorkplaceCurrentStatus
    }>({
        rtoId: null,
        courseId: null,
        currentStatus: '' as WorkplaceCurrentStatus,
    })

    useEffect(() => {
        const date = new Date()
        setDateRange({
            startDate: weekEnd.toLocaleDateString(),
            endDate: date.toLocaleDateString(),
        })
    }, [])

    const getRtos = CommonApi.Filter.useRtos()
    const getCourses = CommonApi.Filter.useCourses()

    const rtoOptions = getRtos?.data?.map((rto: any) => ({
        value: rto?.id,
        label: rto?.user?.name,
    }))

    const coursesOptions = getCourses?.data?.map((course: any) => ({
        value: course?.id,
        label: course?.title,
    }))

    const handleFormChange = (e: OptionType[], name: string) => {
        setFormValues({
            ...formValues,
            [name]: e?.map(({ value }: OptionType) => value)?.join('.'),
        })
    }

    return (
        <Card>
            <div className="grid grid-cols-3 gap-x-3">
                <Select
                    label={'Rto'}
                    name={'rtoId'}
                    options={rtoOptions}
                    placeholder={'Select Search By Rto...'}
                    onChange={(e: any) => {
                        handleFormChange(e, 'rtoId')
                    }}
                    loading={getRtos.isLoading}
                    disabled={getRtos.isLoading}
                    multi
                />

                <Select
                    label={'Courses'}
                    name={'courseId'}
                    options={coursesOptions}
                    placeholder={'Select Courses...'}
                    onChange={(e: any) => {
                        handleFormChange(e, 'courseId')
                    }}
                    loading={getCourses.isLoading}
                    disabled={getCourses.isLoading}
                    multi
                />
                <div>
                    <Typography variant={'label'}>Enter Range</Typography>
                    <OutsideClickHandler
                        onOutsideClick={() => setShowCalendars(false)}
                    >
                        <div className="relative mt-auto">
                            <div
                                onClick={() => setShowCalendars(!showCalendars)}
                                className="flex cursor-pointer items-center gap-x-2 bg-gray-100 px-4 py-2 rounded"
                            >
                                <RiTimerLine className="text-gray-400 " />
                                <button>
                                    {dateRange
                                        ? `${dateRange?.startDate} - ${dateRange?.endDate}`
                                        : null}
                                </button>
                            </div>
                            {showCalendars && (
                                <div className="absolute top-10 right-0 min-w-[600px] calendars-container z-20">
                                    <Card>
                                        <div className="flex justify-between w-full">
                                            <CalendarStyles>
                                                <Calendar
                                                    onChange={(value) => {
                                                        if (value instanceof Date) {
                                                            setStartDate(value)
                                                            setDateRange({
                                                                ...dateRange,
                                                                startDate:
                                                                    value.toLocaleDateString(),
                                                            })
                                                        }
                                                    }}
                                                    value={startDate}
                                                />
                                            </CalendarStyles>
                                            <CalendarStyles>
                                                <Calendar
                                                    onChange={(value) => {
                                                        if (value instanceof Date) {
                                                            const monthEnd =
                                                                new Date(value)
                                                            monthEnd.setDate(
                                                                monthEnd.getDate() +
                                                                30
                                                            )
                                                            setEndDate(value)
                                                            setDateRange({
                                                                ...dateRange,
                                                                endDate:
                                                                    value.toLocaleDateString(),
                                                            })
                                                        }
                                                    }}
                                                    value={endDate}
                                                />
                                            </CalendarStyles>
                                        </div>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </OutsideClickHandler>
                </div>

                <Select
                    label={'Workplace Progress'}
                    name={'currentStatus'}
                    options={workplaceProgressOptions}
                    placeholder={'Select Progress...'}
                    onChange={(e: any) => {
                        handleFormChange(e, 'currentStatus')
                    }}
                    multi
                />
                <Select
                    label={'User Status'}
                    name={'status'}
                    options={StatusOptions}
                    placeholder={'Select Sectors...'}
                    multi
                    onChange={(e: OptionType[]) => {
                        handleFormChange(e, 'status')
                    }}
                />

                <div className="flex justify-end items-center">
                    <a
                        href={`${process.env.NEXT_PUBLIC_END_POINT
                            }/admin/students/all/download/csv?${queryToUrl(
                                removeEmptyValues({
                                    ...formValues,
                                    startDate:
                                        moment(startDate).format('YYYY-MM-DD'),
                                    endDate: moment(endDate)
                                        .add(1, 'days')
                                        .format('YYYY-MM-DD'),
                                })
                            )}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {' '}
                        <Button text={'Download'} variant={'dark'} />
                    </a>
                </div>
            </div>
        </Card>
    )
}
