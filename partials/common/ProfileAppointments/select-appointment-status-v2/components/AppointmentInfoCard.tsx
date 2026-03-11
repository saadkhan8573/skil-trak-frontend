import { Calendar, MonitorCheck } from 'lucide-react'

interface AppointmentInfoCardProps {
    appointment: any
}

export const AppointmentInfoCard = ({
    appointment,
}: AppointmentInfoCardProps) => {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    return (
        <div className="bg-linear-to-br from-[#0D5468]/5 to-[#0D5468]/10 rounded-lg p-3 mb-4 border border-[#0D5468]/20 shadow-sm">
            <div className="flex items-start gap-2">
                <div className="p-1.5 bg-white rounded-lg shadow-sm border border-[#0D5468]/30">
                    <MonitorCheck className="w-5 h-5 text-[#0D5468]" />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        {appointment?.appointmentBy?.name} &{' '}
                        {appointment?.appointmentFor?.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="w-3 h-3 text-[#0D5468]" />
                            <span>{formatDate(appointment?.createdAt)}</span>
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
