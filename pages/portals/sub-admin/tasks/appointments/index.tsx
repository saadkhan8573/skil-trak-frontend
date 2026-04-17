import { useRouter } from 'next/router'

import { ReactElement, useCallback, useEffect, useState } from 'react'

import { SubAdminLayout } from '@layouts'
import { Appointment, NextPageWithLayout, PermissionType } from '@types'

import {
    BigCalendar,
    Button,
    CalendarEvent,
    Card,
    PageTitle,
    withPermission,
} from '@components'

import { useContextBar } from '@hooks'
import { PastAppointments, UpcomingAppointments } from '@partials/common'
import { CommonCB } from '@partials/rto/contextBar'
import { CommonApi } from '@queries'
import moment from 'moment'

type Props = {}

const Appointments: NextPageWithLayout = (props: Props) => {
    const router = useRouter()
    const contextBar = useContextBar()

    const [selectedDates, setSelectedDates] = useState<{
        start: Date | null
        end: Date | null
    }>({
        start: null,
        end: null,
    })

    useEffect(() => {
        contextBar.setContent(<CommonCB />)
        contextBar.show(false)
        return () => {
            contextBar.setContent(null)
            contextBar.hide()
        }
    }, [])

    const [mount, setMount] = useState(false)
    useEffect(() => {
        if (!mount) {
            setMount(true)
        }
    }, [])

    const onSelectedDate = useCallback((dates: any) => {
        setSelectedDates(dates)
    }, [])

    // query
    const futureAppointments = CommonApi.Appointments.useBookedAppointments(
        {
            status: undefined,
            search: `startDate:${moment(selectedDates?.start).format(
                'YYYY-MM-DD'
            )},endDate:${moment(selectedDates?.end).format('YYYY-MM-DD')}`,
        },
        {
            skip: !selectedDates?.start || !selectedDates?.end,
        }
    )
    const events = futureAppointments?.data?.map((appointment: Appointment) => {
        const startTime = new Date(appointment?.date)
        const endTime = new Date(appointment?.date)
        const startHours = Number(
            moment(appointment?.startTime, 'hh:mm:ss').format('HH')
        )
        const startMinutes = Number(
            moment(appointment?.startTime, 'hh:mm:ss').format('mm')
        )
        const endHours = Number(
            moment(appointment?.endTime, 'hh:mm:ss').format('HH')
        )
        const endMinutes = Number(
            moment(appointment?.endTime, 'hh:mm:ss').format('mm')
        )
        startTime.setHours(startHours, startMinutes)
        endTime.setHours(endHours, endMinutes)

        const appointmentUser =
            appointment['appointmentFor'] || appointment['appointmentBy']

        const getPriority = () => {
            if (appointmentUser) {
                switch (appointmentUser['role']) {
                    case 'student':
                        return 'high'
                    case 'rto':
                        return 'medium'
                    case 'industry':
                        return 'low'
                    default:
                        return 'high'
                }
            }

            return 'high'
        }

        return {
            allDay: false,
            start: startTime,
            end: endTime,
            title: appointment?.type?.title,
            priority: getPriority(),
            subTitle:
                appointment.appointmentFor?.name ||
                appointment.appointmentBy?.name,
            appointment,
        }
    })

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <PageTitle title="Appointments" backTitle="Tasks" />

                <div className="flex items-center gap-x-2">
                    <Button
                        variant={'info'}
                        text={'Book Appointments'}
                        onClick={() => {
                            router.push(
                                '/portals/sub-admin/tasks/appointments/create-appointment'
                            )
                        }}
                    />
                    <Button
                        variant={'dark'}
                        text={'Set Schedule'}
                        onClick={() => {
                            router.push(
                                '/portals/sub-admin/tasks/appointments/set-schedule'
                            )
                        }}
                    />
                    <Button
                        variant={'action'}
                        text={'Set Unavailability'}
                        onClick={() => {
                            router.push(
                                '/portals/sub-admin/tasks/appointments/set-unavailability'
                            )
                        }}
                    />
                </div>
            </div>

            <div className="mb-4">
                <Card>
                    {mount && (
                        <BigCalendar
                            events={events as CalendarEvent[]}
                            loading={
                                futureAppointments.isLoading ||
                                futureAppointments.isFetching
                            }
                            onSelectedDate={onSelectedDate}
                        />
                    )}
                </Card>
            </div>

            <UpcomingAppointments />
            <PastAppointments />
        </div>
    )
}
Appointments.getLayout = (page: ReactElement) => {
    return <SubAdminLayout>{page}</SubAdminLayout>
}

export default withPermission(Appointments, {
    permissions: [PermissionType.MANAGE_APPOINTMENTS],
})
