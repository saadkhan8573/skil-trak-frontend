import { Shield } from 'lucide-react'
import { StatusWrapper } from '../StatusWrapper'

export const IndustryEligibilityPending = () => (
    <StatusWrapper>
        <div className="p-4 bg-amber-50 border rounded-xl flex gap-3">
            <Shield className="h-5 w-5 text-amber-600" />
            <p className="font-medium">HOD Review Required</p>
        </div>
    </StatusWrapper>
)
