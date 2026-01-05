import { User } from 'lucide-react'
import { StatusWrapper } from '../StatusWrapper'

export const WaitingForStudent = () => (
    <StatusWrapper>
        <div className="p-4 bg-blue-50 border rounded-xl">
            <div className="flex gap-3">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                    <p className="font-medium">Awaiting Student Approval</p>
                </div>
            </div>
        </div>
    </StatusWrapper>
)
