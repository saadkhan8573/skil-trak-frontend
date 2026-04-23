import { useWorldwideStudentDataRestriction } from '@components'
import { UserRoles } from '@constants'
import { useAppSelector } from '@redux'
import { User } from '@types'
import { Calendar, MonitorCheck } from 'lucide-react'
import moment from 'moment'

interface AppointmentInfoCardProps {
    appointment: any
}

export const AppointmentInfoCard = ({
    appointment,
}: AppointmentInfoCardProps) => {
    const rtoUserId = useAppSelector((state) => state.rto.rtoDetail?.user?.id)
    const { hasPermission } = useWorldwideStudentDataRestriction({
        userId: rtoUserId,
    })

    const appointmentUserName = (appointmentUser: User) =>
        !hasPermission && appointmentUser?.role === UserRoles.STUDENT
            ? 'Student'
            : appointmentUser?.name

    return (
        <div className="bg-linear-to-br from-[#0D5468]/5 to-[#0D5468]/10 rounded-lg p-3 mb-4 border border-[#0D5468]/20 shadow-sm">
            <div className="flex items-start gap-2">
                <div className="p-1.5 bg-white rounded-lg shadow-sm border border-[#0D5468]/30">
                    <MonitorCheck className="w-5 h-5 text-[#0D5468]" />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        {appointmentUserName(appointment?.appointmentBy)} &{' '}
                        {appointmentUserName(appointment?.appointmentFor)}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="w-3 h-3 text-[#0D5468]" />
                            <span>{moment(appointment?.createdAt).format('dddd, MMMM DD, YYYY')}</span>
                        </div>
                        <span className="bg-[#0D5468] text-white text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
                            {appointment?.type?.title || '___'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
