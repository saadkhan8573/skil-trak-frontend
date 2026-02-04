import { Badge, Button } from '@components'
import { AppointmentViewModal } from '@components/Appointment/AppointmentModal'
import { RescheduleAppointmentModal } from '@components/Appointment/UpcomingAppointmentCard/RescheduleAppointmentModal'
import { Appointment } from '@types'
import { Calendar, Clock, MapPin, User, Video } from 'lucide-react'
import moment from 'moment'
import { ReactNode, useState } from 'react'

export const ApprontmentCard = ({
    appointment,
}: {
    appointment: Appointment
}) => {
    const [modal, setModal] = useState<ReactNode | null>(null)

    const appointmentDetails = [
        {
            id: 'date',
            icon: Calendar,
            value: moment(appointment?.date).format('DD/MM/YYYY'),
        },
        {
            id: 'time',
            icon: Clock,
            value: `${moment(appointment?.startTime, 'HH:mm').format(
                'HH:mm'
            )} - ${moment(appointment?.endTime, 'HH:mm').format('HH:mm')}`,
        },
        {
            id: 'location',
            icon: appointment.type?.videoAppointment ? Video : MapPin,
            value: appointment?.address,
        },
        {
            id: 'attendees',
            icon: User,
            value: '2 Attendees',
        },
    ]

    const onCancelClicked = () => setModal(null)

    const onAppointmentClicked = () => {
        setModal(
            <AppointmentViewModal
                id={appointment?.id}
                onCancel={onCancelClicked}
                upcomming
            />
        )
    }

    const onRescheduleClicked = () => {
        setModal(
            <RescheduleAppointmentModal
                onCancel={onCancelClicked}
                appointment={appointment}
            />
        )
    }

    return (
        <>
            {modal}
            <div className="group relative overflow-hidden bg-linear-to-br from-white to-slate-50/50 rounded-xl border border-slate-200 p-3 hover:shadow-xl hover:border-[#044866]/30 transition-all">
                {appointment.type?.videoAppointment && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#F7A619]/10 to-transparent rounded-full blur-2xl"></div>
                )}

                <div className="relative space-y-2.5">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 mb-3">
                                    <h5 className="text-slate-900">
                                        {appointment?.appointmentFor?.name}
                                    </h5>
                                    <Badge
                                        variant="primaryNew"
                                        text={appointment?.type?.title}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={onAppointmentClicked}
                                        outline
                                        variant="primaryNew"
                                    >
                                        View Details
                                    </Button>
                                    <Button
                                        outline
                                        variant="primaryNew"
                                        onClick={onRescheduleClicked}
                                    >
                                        Reschedule
                                    </Button>
                                </div>
                            </div>

                            {/*  */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {appointmentDetails?.map((detail) => (
                                    <div
                                        key={detail.id}
                                        className="flex items-center gap-3 bg-slate-50 rounded-lg p-3"
                                    >
                                        <detail.icon
                                            className={`w-4 h-4 text-primaryNew shrink-0`}
                                        />
                                        <span className="text-[13px] text-slate-700">
                                            {detail.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="`bg-gradient-to-br` from-slate-50 to-white rounded-xl p-4 border border-slate-200/60 flex items-center gap-x-3">
                        <p className="text-sm text-slate-600">Attendees:</p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-[#044866] transition-colors">
                                {appointment?.appointmentFor?.name}{' '}
                                {appointment?.appointmentFor?.role && (
                                    <span className="text-slate-400">
                                        ({appointment?.appointmentFor?.role})
                                    </span>
                                )}
                            </span>
                            <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-[#044866] transition-colors">
                                {appointment?.appointmentBy?.name}{' '}
                                {appointment?.appointmentBy?.role && (
                                    <span className="text-slate-400">
                                        ({appointment?.appointmentBy?.role})
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
