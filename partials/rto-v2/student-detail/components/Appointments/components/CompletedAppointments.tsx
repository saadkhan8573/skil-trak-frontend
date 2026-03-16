import { useState } from 'react'
import { Badge, NoData } from '@components'
import { CommonApi, RtoV2Api } from '@queries'
import { Appointment } from '@types'
import { CompletedAppointmentCard } from '../cards'
import { AppointmentCardSkeleton } from '../../../skeletonLoader'
import { SelectAppointmentStatusVII } from '@partials/common/ProfileAppointments/select-appointment-status-v2/SelectAppointmentStatusVII'

export const CompletedAppointments = ({
    studentUserId,
}: {
    studentUserId: number
}) => {
    const [isReviewed, setIsReviewed] = useState(false)

    const appointments = CommonApi.Appointments.useBookedAppointments(
        {
            userId: studentUserId,
            status: 'past',
        },
        {
            skip: !studentUserId,
            refetchOnMountOrArgChange: 300,
        }
    )

    const { data: appointmentDetail, isFetching: isFetchingDetail } =
        RtoV2Api.Students.useGetStudentAppointmentDetail(
            { userId: studentUserId },
            {
                skip: !studentUserId,
            }
        )

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl p-4 hover:shadow-2xl transition-all space-y-2">
            <h4 className="text-slate-900 flex items-center gap-2">
                <span>Completed Appointments</span>
                <Badge
                    variant="success"
                    text={`${appointments?.data?.data?.length || 0}`}
                />
            </h4>

            <div className="space-y-2.5">
                {appointments?.isError ? (
                    <NoData text="There is Some technical issue" isError />
                ) : null}
                {appointments?.isLoading ? (
                    <div className="space-y-2.5">
                        {[1, 2].map((i) => (
                            <AppointmentCardSkeleton key={i} />
                        ))}
                    </div>
                ) : appointments?.data?.data &&
                  appointments?.data?.data?.length > 0 &&
                  appointments?.isSuccess ? (
                    appointments?.data?.data?.map(
                        (appointment: Appointment) => (
                            <CompletedAppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                            />
                        )
                    )
                ) : (
                    appointments?.isSuccess && (
                        <NoData text="There is no upcoming appointments" />
                    )
                )}
            </div>

            {appointmentDetail && !isReviewed && (
                <SelectAppointmentStatusVII
                    isOpen={!isReviewed}
                    onClose={() => setIsReviewed(true)}
                    appointment={appointmentDetail}
                />
            )}
        </div>
    )
}
