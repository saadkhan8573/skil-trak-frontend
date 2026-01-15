import { useEffect, useState, useCallback } from 'react'
import {
    Button,
    Card,
    LoadingAnimation,
    ShowErrorNotifications,
    TextInput,
    Typography,
} from '@components'
import { useNotification } from '@hooks'
import { ScheduleCard } from '@partials/student/Schedule'
import { StudentApi } from '@queries'
import { Course, Industry, User } from '@types'
import moment from 'moment'
import { useRouter } from 'next/router'

type ScheduleDay = {
    id: number
    name: string
    openingTime: string
    closingTime: string
    isActive: boolean
}

export const AddScheduleContainer = ({
    user,
    course,
    workplace,
    onAddStudentCourse,
}: {
    user?: User
    course: Course
    workplace: Industry
    onAddStudentCourse?: () => void
}) => {
    const router = useRouter()
    const { notification } = useNotification()

    // State initialization
    const [selectedHours, setSelectedHours] = useState<number | null>(null)
    const [startDate, setStartDate] = useState<string | null>(null)
    const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false)

    const initialSchedule: ScheduleDay[] = [
        {
            id: -1,
            name: 'monday',
            openingTime: '09:00',
            closingTime: '17:00',
            isActive: false,
        },
        {
            id: -2,
            name: 'tuesday',
            openingTime: '09:00',
            closingTime: '17:00',
            isActive: false,
        },
        {
            id: -3,
            name: 'wednesday',
            openingTime: '09:00',
            closingTime: '17:00',
            isActive: false,
        },
        {
            id: -4,
            name: 'thursday',
            openingTime: '09:00',
            closingTime: '17:00',
            isActive: false,
        },
        {
            id: -5,
            name: 'friday',
            openingTime: '09:00',
            closingTime: '17:00',
            isActive: false,
        },
        {
            id: -6,
            name: 'saturday',
            openingTime: '09:00',
            closingTime: '17:00',
            isActive: false,
        },
        {
            id: -7,
            name: 'sunday',
            openingTime: '09:00',
            closingTime: '17:00',
            isActive: false,
        },
    ]

    const [scheduleTime, setScheduleTime] =
        useState<ScheduleDay[]>(initialSchedule)

    // API hooks
    const [createSchedule, createScheduleResult] =
        StudentApi.Schedule.useCreateStudentSchedule()
    const [editSchedule, editScheduleResult] =
        StudentApi.Schedule.useEditStudentSchedule()

    const schedules = StudentApi.Schedule.useGetStudentSchedule(
        {
            courseId: Number(course?.id),
            userId: user?.id,
            workplace: Number(workplace?.id),
        },
        {
            skip: !course || !user || !workplace,
            refetchOnMountOrArgChange: 30,
        }
    )

    const timeSlots = StudentApi.Schedule.scheduleTimeSlots(
        {
            scheduleId: schedules?.data?.schedule?.id,
            search: schedules?.data?.schedule?.startDate
                ? `startDate:${moment(
                    schedules?.data?.schedule?.startDate
                ).format('YYYY-MM-DD')},` +
                `endDate:${moment(schedules?.data?.schedule?.startDate)
                    .add(8, 'days')
                    .format('YYYY-MM-DD')}`
                : '',
        },
        {
            skip: !schedules?.isSuccess || !schedules?.data?.schedule?.id,
            refetchOnMountOrArgChange: 150,
        }
    )

    // Initialize hours from course once on mount
    useEffect(() => {
        if (course?.hours && selectedHours === null) {
            const displayHours: number = course?.extraHours?.length
                ? Math.floor(Number(course.extraHours[0]?.hours))
                : course?.hours
            setSelectedHours(displayHours)
        }
    }, [course])

    // Reset mutation state on mount
    useEffect(() => {
        if (createScheduleResult.isSuccess) createScheduleResult.reset()
        if (editScheduleResult.isSuccess) editScheduleResult.reset()
    }, [])

    // Handle successful schedule creation
    useEffect(() => {
        if (createScheduleResult.isSuccess || editScheduleResult.isSuccess) {
            if (onAddStudentCourse) {
                onAddStudentCourse()
            } else {
                router.push({
                    pathname: `/portals/student/assessments/schedule`,
                    query: {
                        course: router.query?.course,
                        workplace: router.query?.workplace,
                    },
                })
            }
        }
    }, [createScheduleResult.isSuccess, editScheduleResult.isSuccess])

    // Load existing schedule data when available
    useEffect(() => {
        // Only run this effect if we have data and haven't loaded it yet
        if (
            schedules?.data?.schedule &&
            timeSlots?.data?.length > 0 &&
            !isDataLoaded &&
            !timeSlots.isLoading &&
            !schedules.isLoading
        ) {
            try {
                // Create a map to efficiently look up days
                const daysMap = new Map()
                timeSlots?.data?.forEach((slot: any) => {
                    if (!daysMap?.has(slot?.day)) {
                        daysMap?.set(slot.day, slot)
                    }
                })

                // Create a new schedule array by mapping over initial schedule
                const updatedSchedule = initialSchedule?.map((day) => {
                    const existingDay = daysMap?.get(day?.name)
                    if (existingDay) {
                        return {
                            ...day,
                            id: existingDay?.id,
                            openingTime:
                                existingDay?.openingTime?.substring(0, 5) ||
                                day.openingTime,
                            closingTime:
                                existingDay?.closingTime?.substring(0, 5) ||
                                day.closingTime,
                            isActive: true,
                        }
                    }
                    return day
                })

                setScheduleTime(updatedSchedule)

                // Set start date if available
                if (schedules?.data?.schedule?.startDate) {
                    const formattedDate = moment(
                        schedules?.data?.schedule?.startDate
                    ).format('YYYY-MM-DD')
                    setStartDate(formattedDate)
                }

                // Mark data as loaded to prevent reprocessing
                setIsDataLoaded(true)

                // Set hours if available
                if (
                    schedules?.data?.schedule?.hours &&
                    selectedHours === null
                ) {
                    setSelectedHours(schedules?.data?.schedule?.hours)
                }
            } catch (error) {
                console.error('Error processing schedule data:', error)
            }
        }
    }, [
        schedules?.data,
        timeSlots?.data,
        isDataLoaded,
        timeSlots?.isLoading,
        schedules?.isLoading,
    ])

    // Stable callback to avoid recreating on each render
    const onScheduleChange = useCallback(
        (updatedDay: {
            name: string
            openingTime: string
            closingTime: string
            isActive: boolean
        }) => {
            setScheduleTime((currentSchedule) =>
                currentSchedule.map((day) =>
                    day?.name === updatedDay?.name
                        ? {
                            ...day,
                            openingTime: updatedDay?.openingTime,
                            closingTime: updatedDay?.closingTime,
                            isActive: updatedDay?.isActive,
                        }
                        : day
                )
            )
        },
        []
    )

    // Form submission
    const onSubmit = () => {
        // Validate form fields
        if (!startDate) {
            return notification.warning({
                title: 'Start Date',
                description: 'Start Date is Required!',
            })
        }

        if (!selectedHours) {
            return notification.warning({
                title: 'Hours',
                description: 'Hours is Required!',
            })
        }

        if (!course?.id) {
            return notification.warning({
                title: 'Course',
                description: 'Course is Required!',
            })
        }

        const activeDays = scheduleTime?.filter((day) => day.isActive)
        if (activeDays?.length === 0) {
            return notification.warning({
                title: 'Schedule',
                description: 'At least one day in the schedule is Required!',
            })
        }

        // Prepare data for submission
        const scheduleData = {
            startDate,
            workplace: workplace?.id,
            days: activeDays?.map((day) => ({
                name: day?.name,
                openingTime: day?.openingTime,
                closingTime: day?.closingTime,
            })),
            course: course?.id,
            hours: selectedHours,
            stdUser: user?.id,
        }

        // Submit form - update or create
        if (schedules?.data?.schedule?.id) {
            editSchedule({
                id: schedules.data.schedule.id,
                ...scheduleData,
            })
        } else {
            createSchedule(scheduleData)
        }
    }

    return (
        <>
            <ShowErrorNotifications result={editScheduleResult} />
            <ShowErrorNotifications result={createScheduleResult} />
            <Card>
                <Typography variant="title">Manage Schedule</Typography>
                <div className="flex justify-between items-center">
                    <div className="flex gap-x-2">
                        <div className="w-64">
                            <Typography variant="small">Course</Typography>
                            <div className="flex flex-col border rounded py-2 px-1">
                                <Typography variant="small">
                                    {course?.code}
                                </Typography>
                                <Typography variant="label" semibold>
                                    {course?.title}
                                </Typography>
                            </div>
                        </div>
                        <div className="w-64">
                            <Typography variant="small">Workplace</Typography>
                            <div className="flex flex-col border rounded py-2 px-1">
                                <Typography variant="small">
                                    {workplace?.user?.email}
                                </Typography>
                                <Typography variant="label" semibold>
                                    {workplace?.user?.name}
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-x-2">
                        <TextInput
                            name="hours"
                            label="Add Hours"
                            placeholder="Add Hours"
                            value={selectedHours || ''}
                            onChange={(e: any) => {
                                const value = e.target.value
                                    ? Number(e.target.value)
                                    : null
                                setSelectedHours(value)
                            }}
                            type="number"
                        />
                        <TextInput
                            name="startingDate"
                            label="Starting Date"
                            placeholder="Start Date"
                            type="date"
                            value={startDate || ''}
                            onChange={(e: any) => setStartDate(e.target.value)}
                        />
                    </div>
                </div>

                {(timeSlots?.isLoading || schedules?.isLoading) &&
                    !isDataLoaded ? (
                    <LoadingAnimation />
                ) : (
                    <>
                        <Typography variant="small">
                            Select Time &amp; Days
                        </Typography>
                        <div className="flex flex-col gap-y-3">
                            {scheduleTime?.map((day) => (
                                <ScheduleCard
                                    key={day?.name}
                                    time={day}
                                    onScheduleChange={onScheduleChange}
                                />
                            ))}
                        </div>
                    </>
                )}

                <div className="flex items-center gap-x-4 text-sm text-green-500 mt-5">
                    <Button
                        text={schedules?.data?.schedule ? 'Update' : 'Submit'}
                        {...(schedules?.data?.schedule
                            ? { outline: true }
                            : {})}
                        onClick={onSubmit}
                        loading={
                            createScheduleResult.isLoading ||
                            editScheduleResult.isLoading
                        }
                        disabled={
                            createScheduleResult.isLoading ||
                            editScheduleResult.isLoading
                        }
                    />
                    {(createScheduleResult.isSuccess ||
                        editScheduleResult.isSuccess) && <div> - Saved</div>}
                </div>
            </Card>
        </>
    )
}
