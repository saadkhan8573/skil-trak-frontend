import { User } from 'lucide-react'
import { StatusWrapper } from '../StatusWrapper'

export const StudentAdded = () => (
    <StatusWrapper>
        <div className="p-4 bg-slate-50 border rounded-xl">
            <div className="flex gap-3">
                <User className="h-5 w-5 text-slate-600" />
                <div>
                    <p className="font-medium">Student Profile Created</p>
                    <p className="text-sm text-slate-600">
                        Select workplace type to begin placement.
                    </p>
                </div>
            </div>
        </div>
    </StatusWrapper>
)
