import { LoadingAnimation, Permissions } from '@components'
import { Button } from '@components'
import { CommonApi } from '@queries'
import { CalendarIcon, Plus } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { AppointmentCard } from '../card'
import { ScheduleAppointmentModal } from '../modals'
import { PermissionType } from '@types'

export const UpcomingAppointments = () => {
    const [scheduleOpen, setScheduleOpen] = useState(false)
    const { data, isLoading, isError } =
        CommonApi.Appointments.useBookedAppointments({
            // userId,
            status: 'future',
        })
    return (
        <div>
            {isLoading ? (
                <LoadingAnimation />
            ) : data && data?.length > 0 && data ? (
                <>
                    {data?.map((appointment: any) => (
                        <div key={appointment.id}>
                            <AppointmentCard appointment={appointment} />
                        </div>
                    ))}
                </>
            ) : (
                !isError && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="relative mb-4">
                            <div className="absolute inset-0 bg-linear-to-br from-primary to-accent rounded-2xl blur-xl opacity-20"></div>
                            <div className="relative h-20 w-20 rounded-2xl bg-linear-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                                <CalendarIcon className="h-10 w-10 text-primary/40" />
                            </div>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">
                            No Appointments Found
                        </h3>
                        {/* <p className="text-sm text-muted-foreground max-w-sm mb-4">
                        {searchQuery
                            ? "Try adjusting your search or filters"
                            : "Schedule your first appointment to get started"}
                    </p> */}
                        <Permissions
                            permission={[
                                PermissionType.BOOK_STUDENT_APPOINTMENTS,
                            ]}
                        >
                            <Button
                                variant={'primaryNew'}
                                onClick={() => setScheduleOpen(true)}
                            >
                                <Plus className="h-4 w-4" />
                                Schedule Appointment
                            </Button>
                        </Permissions>
                    </div>
                )
            )}
            <ScheduleAppointmentModal
                scheduleOpen={scheduleOpen}
                setScheduleOpen={setScheduleOpen}
            />
        </div>
    )
}
