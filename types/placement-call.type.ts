import { BaseResponse } from './base.type'
import { Student } from './user.type'

export interface PlacementCall extends BaseResponse {
    id: number
    summary: string
    isAnswered: boolean | null
    callId: string | null
    placementType: string
    status: 'pending' | 'completed' | 'scheduled'
    scheduledAt: string
    callOutcome: string | null
    callType: 'outbound' | 'inbound'
    callDuration: number
    errorMessage: string | null
    student: Student
    priority?: 'low' | 'medium' | 'high'
    hasTicket?: boolean
    recordingUrl?: string
    placementCompany?: string
}
