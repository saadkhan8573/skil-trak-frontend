import { Clock } from 'lucide-react'
import { StatusWrapper } from '../StatusWrapper'

export const WaitingForRTO = () => (
    <StatusWrapper>
        <div className="p-4 bg-amber-50 border rounded-xl">
            <div className="flex gap-3">
                <Clock className="h-5 w-5 text-amber-600" />
                <div>
                    <p className="font-medium">Awaiting RTO Approval</p>
                    <p className="text-sm text-amber-700">
                        Request pending review.
                    </p>
                </div>
            </div>
        </div>
    </StatusWrapper>
)
