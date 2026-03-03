import { WorkplaceCurrentStatus } from '@utils'
import { CheckCircle, X, XCircle } from 'lucide-react'

export interface PlacementHistoryItem {
    id: string
    workplace: string
    location: string
    status: string
    createdDate: string
    lastActionDate: string
    assignedTo: string
    description: string
    progress: number
    nextAction: string
    dueDate?: string
    cancellationComment?: string
    industry?: any
    raw?: any
}

export const statusConfigs: Record<
    string,
    {
        icon: any
        label: string
        color: string
    }
> = {
    cancelled: {
        icon: XCircle,
        label: 'Cancelled',
        color: 'red',
    },
    completed: {
        icon: CheckCircle,
        label: 'Completed',
        color: 'emerald',
    },
    [WorkplaceCurrentStatus.RejectedByStudent]: {
        icon: X,
        label: 'Rejected by Student',
        color: 'orange',
    },
    [WorkplaceCurrentStatus.RejectedByIndustry]: {
        icon: X,
        label: 'Rejected by Industry',
        color: 'purple',
    },
    [WorkplaceCurrentStatus.RejectedByRto]: {
        icon: X,
        label: 'Rejected by RTO',
        color: 'red',
    },
    [WorkplaceCurrentStatus.Rejected]: {
        icon: X,
        label: 'Rejected',
        color: 'orange',
    },
}
