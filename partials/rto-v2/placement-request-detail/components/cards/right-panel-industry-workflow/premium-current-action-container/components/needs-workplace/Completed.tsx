import { Award } from 'lucide-react'
import { StatusWrapper } from '../StatusWrapper'

export const Completed = () => (
    <StatusWrapper>
        <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-xl flex gap-3">
            <Award className="h-6 w-6 text-emerald-600" />
            <div>
                <p className="font-semibold text-lg">Placement Completed</p>
                <p className="text-sm">All requirements successfully met.</p>
            </div>
        </div>
    </StatusWrapper>
)
