export type CallStatus = 'pending' | 'completed'

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
        label: 'Pending',
        color: '#044866',
        bgColor: '#E6F2F7',
        borderColor: '#B3D9E8',
        description: 'Call in open state',
    },
    completed: {
        label: 'Completed Placements',
        color: '#0D5468',
        bgColor: '#E8F4F6',
        borderColor: '#B8DDE4',
        description: 'Placement completed',
    },
}
