export type CallStatus = 'pending' | 'completed' | 'scheduled'

export interface Call {
    id: string
    student: any
    agentName: string
    status: CallStatus
    createdAt: string
    callDuration: string
    phoneNumber: string
    industry?: any
    placementCompany?: string
    notes: string
    tags: string[]
    priority: 'low' | 'medium' | 'high'
    recordingUrl?: string
    isCompleted?: boolean
    hasTicket?: boolean
}

export interface StatusConfig {
    label: string
    color: string
    bgColor: string
    borderColor: string
    description: string
}

export const statusConfigs: Record<CallStatus, StatusConfig> = {
    pending: {
        label: 'Skiltrak Action Required',
        color: '#B45309',
        bgColor: '#FFFBEB',
        borderColor: '#FDE68A',
        description: 'Call in open state',
    },
    completed: {
        label: 'Completed Placements',
        color: '#15803D',
        bgColor: '#F0FDF4',
        borderColor: '#BBF7D0',
        description: 'Placement completed',
    },
    scheduled: {
        label: 'Scheduled',
        color: '#1D4ED8',
        bgColor: '#EFF6FF',
        borderColor: '#BFDBFE',
        description: 'Call is scheduled',
    },
}
