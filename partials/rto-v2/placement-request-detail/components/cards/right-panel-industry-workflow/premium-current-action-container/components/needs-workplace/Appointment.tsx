import { Button } from '@components'
import { CalendarCheck } from 'lucide-react'
import { StatusWrapper } from '../StatusWrapper'

export const Appointment = ({
    appointmentDate,
    setShowAppointmentDialog,
    requestStatusChange,
}: any) => (
    <StatusWrapper>
        <div className="p-4 bg-indigo-50 border rounded-xl">
            <p className="font-medium">Appointment Stage</p>
            {appointmentDate && (
                <p className="text-sm">Scheduled: {appointmentDate}</p>
            )}
        </div>

        {appointmentDate && (
            <Button onClick={() => requestStatusChange('Agreement Pending')}>
                <CalendarCheck className="mr-2 h-4 w-4" />
                Mark Successful
            </Button>
        )}
    </StatusWrapper>
)
