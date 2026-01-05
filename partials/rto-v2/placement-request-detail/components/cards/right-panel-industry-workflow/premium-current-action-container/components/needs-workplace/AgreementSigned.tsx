import { Button } from '@components'
import { CalendarCheck } from 'lucide-react'
import { StatusWrapper } from '../StatusWrapper'

export const AgreementSigned = ({ setShowScheduleDialog }: any) => (
    <StatusWrapper>
        <div className="p-4 bg-emerald-50 border rounded-xl">
            <p className="font-medium">Agreement Signed</p>
            <p className="text-sm">Confirm schedule to proceed.</p>
        </div>

        <Button onClick={() => setShowScheduleDialog(true)}>
            <CalendarCheck className="mr-2 h-4 w-4" />
            Confirm Schedule
        </Button>
    </StatusWrapper>
)
