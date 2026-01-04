import { Badge } from '@components'
import { Appointment } from '@types'
import { Calendar, CheckCircle, Clock, User, Users, XCircle } from 'lucide-react'
import moment from 'moment'
import React from 'react'

export const CompletedAppointmentCard = ({
    appointment,
}: {
    appointment: Appointment
}) => {
    return (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/60 p-3">
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
                            <span className="font-medium text-[12px]">By:</span>
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
                            <span className="font-medium text-[12px]">For:</span>
                            <span className="text-[12px]">
                                {appointment?.appointmentFor?.name}{' '}
                                {appointment?.appointmentFor?.role && (
                                    <span className="text-slate-400">
                                        ({appointment?.appointmentFor?.role})
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
                    {appointment?.isSuccessfull ? (
                        <Badge
                            variant="success"
                            text="Successful"
                            Icon={CheckCircle}
                            size="xs"
                        />
                    ) : (
                        <Badge
                            variant="error"
                            text="Unsuccessful"
                            Icon={XCircle}
                            size="xs"
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
