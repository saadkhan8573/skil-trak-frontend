import { Course } from '@redux/queryTypes'
import { BaseResponse } from './base.type'
import { Student } from './user.type'
import { AgentConfigurationTypes } from './agent-configuration'

export interface PlacementCall extends BaseResponse {
    agent: AgentConfigurationTypes
    id: number
    summary: string
    isAnswered: boolean | null
    callId: string | null
    placementType: string
    status: 'pending' | 'completed' | 'scheduled'
    scheduledAt: string
    callOutcome: string
    callType: 'outbound' | 'inbound'
    callDuration: number
    errorMessage: string
    student: Student
    course: Course
    priority?: 'low' | 'medium' | 'high'
    hasTicket?: boolean
    recordingUrl?: string
    placementCompany?: string
    isFlagged?: boolean
    callReason?: string
    agentAction?: string
    agentType?: 'AI (Maria)' | 'Human Agent'
    dataCompleteness?: 'Complete' | 'Partial'
    followUpRequired?: boolean
}
