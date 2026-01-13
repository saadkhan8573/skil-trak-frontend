export type Team = 'student-services' | 'industry-sourcing' | 'qa' | 'rto'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | null | undefined

export type TicketStatus =
    | 'open'
    | 'inProgress'
    | 'pending'
    | 'resolved'
    | 'assigned'
export type EscalationType = 'auto' | 'manual'

export type Phase =
    | 'onboarding'
    | 'industry-matching'
    | 'approval'
    | 'appointment'
    | 'agreement'
    | 'placement'
    | 'completion'

export interface User {
    id: number
    name: string
    email: string
}

export interface AssignedTo {
    id: number
    user: User
}

export interface SupportTeam {
    id: number
    tags: string[] // e.g., ["sourcing team", "student services"]
}

export interface Ticket {
    id: number
    studentName: string // from ticket.user.name
    studentId: number // from ticket.user.id
    team?: Team // optional, you may map from supportTeam.tags
    status: TicketStatus
    title: string
    description: string
    createdAt: string
    severity?: Priority
    origin: 'STUDENT' | 'INDUSTRY'
    updatedAt?: string
    resolvedAt?: string
    escalationType?: EscalationType
    hoursStuck?: number
    assignedTo: AssignedTo // nested object
    resolution?: string
    supportTeam: any // from supportTeam.tags
    user?: any
    industryType?: string
    notes?: TicketNote[]
}

export interface TicketNote {
    id: string
    content: string
    createdBy: string
    createdAt: string
}

export interface TicketActivity {
    id: string
    ticketId: string
    type: 'status_change' | 'comment' | 'assignment' | 'escalation'
    message: string
    user: string
    timestamp: string
}
