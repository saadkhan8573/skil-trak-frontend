import { Badge, ShowErrorNotifications } from '@components'
import { useNotification } from '@hooks'
import { SelectAppointmentStatus } from '@partials/common/ProfileAppointments/components'
import { SelectAppointmentStatusVII } from '@partials/common/ProfileAppointments/select-appointment-status-v2/SelectAppointmentStatusVII'
import { CommonApi } from '@queries'
import { Appointment } from '@types'
import {
    Calendar,
    CheckCircle,
    Clock,
    User,
    Users,
    XCircle,
} from 'lucide-react'
import moment from 'moment'
import React, { ReactElement, ReactNode, useEffect, useState } from 'react'

export const CompletedAppointmentCard = ({
    appointment,
}: {
    appointment: Appointment
}) => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const { notification } = useNotification()
    const [updateStatus, updateStatusResult] =
        CommonApi.Appointments.updateSuccessFullStatus()

    const onSubmit = async (values: { note: string; status: boolean }) => {
        if (!values?.note) {
            notification.warning({
                title: 'Note Required!',
                description: 'Please add a note,',
            })
            return
        }
        const res: any = await updateStatus({
            id: appointment?.id,
            ...values,
        })

        if (res?.data) {
            notification.success({
                title: 'Appointment Status Changed',
                description: 'Appointment Status Changed Successfully',
            })
        }
    }
    const onClose = () => {
        setModal(null)
    }
    useEffect(() => {
        if (appointment.isSuccessfull === null) {
            setModal(
                <SelectAppointmentStatusVII
                    onClose={onClose}
                    appointment={appointment}
                />
            )
        }
    }, [appointment])

    return (
        <>
            {modal && modal}
            <ShowErrorNotifications result={updateStatusResult} />
            <div className="`bg-linear-to-br` from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/60 p-3">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h5 className="text-slate-700 mb-3 flex items-center gap-2 capitalize">
                            {appointment?.type?.title}
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                <Calendar className="w-4 h-4" />
                                {moment(appointment?.date).format('DD/MM/YYYY')}
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                <Clock className="w-4 h-4" />
                                {moment(appointment?.startTime, 'HH:mm').format(
                                    'HH:mm'
                                )}{' '}
                                -{' '}
                                {moment(appointment?.endTime, 'HH:mm').format(
                                    'HH:mm'
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200/50">
                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                                <User className="w-4 h-4 text-[#044866]" />
                                <span className="font-medium text-[12px]">
                                    By:
                                </span>
                                <span className="text-[12px]">
                                    {appointment?.appointmentBy?.name}{' '}
                                    {appointment?.appointmentBy?.role && (
                                        <span className="text-slate-400">
                                            ({appointment?.appointmentBy?.role})
                                        </span>
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                                <Users className="w-4 h-4 text-[#044866]" />
                                <span className="font-medium text-[12px]">
                                    For:
                                </span>
                                <span className="text-[12px]">
                                    {appointment?.appointmentFor?.name}{' '}
                                    {appointment?.appointmentFor?.role && (
                                        <span className="text-slate-400">
                                            ({appointment?.appointmentFor?.role}
                                            )
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <Badge
                            className="bg-emerald-100 text-emerald-700 border border-emerald-200"
                            text="✓ Completed"
                        />
                        {appointment?.isSuccessfull === true ? (
                            <Badge
                                variant="success"
                                text="Successful"
                                Icon={CheckCircle}
                                size="xs"
                            />
                        ) : appointment?.isSuccessfull === false ? (
                            <Badge
                                variant="error"
                                text="Not Successful"
                                Icon={XCircle}
                                size="xs"
                            />
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    )
}
