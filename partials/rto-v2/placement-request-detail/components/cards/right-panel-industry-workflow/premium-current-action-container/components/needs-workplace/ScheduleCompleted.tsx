import { CheckSquare } from 'lucide-react'
import { StatusWrapper } from '../StatusWrapper'

export const ScheduleCompleted = () => (
    <StatusWrapper>
        <div className="p-4 bg-emerald-50 border rounded-xl flex gap-3">
            <CheckSquare className="h-5 w-5 text-emerald-600" />
            <p className="font-medium">Schedule Completed</p>
        </div>
    </StatusWrapper>
)
