import {
    Card,
    Button,
    Typography,
    LoadingAnimation,
    ShowErrorNotifications,
} from '@components'
import { ScheduleCard } from './components'
import { useEffect, useState } from 'react'

import { useSetScheduleMutation, useSetScheduledListQuery } from '@queries'
import { useRouter } from 'next/router'
import moment from 'moment'
export const SetScheduleContainer = () => {
    const router = useRouter()
    const initialSchedule = [
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
            id: -1,
            name: 'saturday',
            openingTime: '09:00',
            closingTime: '17:00',
            isActive: false,
        },
        {
            id: -1,
            name: 'sunday',
            openingTime: '09:00',
            closingTime: '17:00',
            isActive: false,
        },
    ]

    const [scheduleTime, setScheduleTime] = useState<any | null>(
        initialSchedule
    )
    const [availabilities, setAvailabilities] = useState<any | null>(
        initialSchedule
    )
    const [isUpdated, setIsUpdated] = useState<boolean>(false)

    const [saveSchedule, saveScheduleResult] = useSetScheduleMutation()
    const availability = useSetScheduledListQuery()

    const onScheduleChange = (schedule: any) => {
        const tempSchedule: any = [...scheduleTime]
        const dayIndex = tempSchedule.findIndex(
            (d: any) => d.name === schedule.name
        )

        tempSchedule[dayIndex].openingTime = moment(schedule.openingTime, [
            'h:mm A',
        ]).format('HH:mm')
        tempSchedule[dayIndex].closingTime = moment(schedule.closingTime, [
            'h:mm A',
        ]).format('HH:mm')
        tempSchedule[dayIndex].isActive = schedule.isActive

        setScheduleTime(tempSchedule)
    }

    useEffect(() => {
        if (availability.isSuccess) {
            if (availability.data?.length) {
                const tempAvailabilities: any = [...availabilities]

                availability.data.forEach((day: any) => {
                    const dayIndex = tempAvailabilities.findIndex(
                        (d: any) => d.name === day.name
                    )
                    tempAvailabilities[dayIndex].id = day.id
                    tempAvailabilities[dayIndex].openingTime = day.openingTime
                    tempAvailabilities[dayIndex].closingTime = day.closingTime
                    tempAvailabilities[dayIndex].isActive = day.isActive
                })

                setAvailabilities(tempAvailabilities)
                setScheduleTime(tempAvailabilities)
            }
            setIsUpdated(true)
        }
    }, [availability])

    useEffect(() => {
        if (saveScheduleResult.isSuccess) {
            router.push('/portals/sub-admin/tasks/appointments')
        }
    }, [saveScheduleResult])

    const onSubmit = async () => {
        await saveSchedule({ days: scheduleTime })
    }

    return (
        <Card>
            <ShowErrorNotifications result={saveScheduleResult} />
            {availability.isLoading ? (
                <LoadingAnimation />
            ) : availability?.isSuccess && isUpdated ? (
                <>
                    <Typography variant={'small'}>
                        Select Time {'&'} Days
                    </Typography>
                    <div className="my-2 flex flex-col gap-y-2">
                        {availabilities?.map((availability: any, index: number) => (
                            <ScheduleCard
                                key={`${availability.name}-${index}`}
                                setScheduleTime={setScheduleTime}
                                onScheduleChange={onScheduleChange}
                                availability={availability}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex flex-col gap-y-2">
                    {availabilities?.map((availability: any, index: number) => (
                        <ScheduleCard
                            key={`${availability.name}-${index}`}
                            setScheduleTime={setScheduleTime}
                            onScheduleChange={onScheduleChange}
                            availability={availability}
                        />
                    ))}
                </div>
            )}
            <div className="flex items-center gap-x-4 text-sm text-green-500">
                <Button
                    text={'Submit'}
                    onClick={() => onSubmit()}
                    loading={saveScheduleResult.isLoading}
                    disabled={saveScheduleResult.isLoading}
                />
                {saveScheduleResult.isSuccess ? <div> - Saved</div> : null}
            </div>
        </Card>
    )
}
