import { Calendar, Plus } from 'lucide-react'
import { Button, Permissions } from '@components'
import { PermissionType } from '@types'

interface AppointmentsHeaderProps {
    onNewAppointment: () => void
}

export function AppointmentsHeader({
    onNewAppointment,
}: AppointmentsHeaderProps) {
    return (
        <div className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center shadow-xl">
                    <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                    <h3 className="text-white font-semibold">Appointments</h3>
                    <p className="text-white/80 text-[10px]">
                        Manage meetings, interviews & site visits
                    </p>
                </div>
            </div>
            <Permissions
                permission={PermissionType.CAN_PERFORM_INDUSTRY_ACTIONS}
            >
                <Button
                    onClick={onNewAppointment}
                    variant="info"
                    outline
                    className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 text-xs font-medium hover:scale-105 active:scale-95"
                >
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Add Appointment
                </Button>
            </Permissions>
        </div>
    )
}
