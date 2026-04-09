import { BaseResponse } from './base.type'
import { Course } from './sector.type'
import { Student, User } from './user.type'

export interface TicketTypes extends BaseResponse {
    id: number
    message: string
    subject: string
    status: string
    priority: string
    createdBy: User
    assignedTo: User
    closedBy: null
    student: Student
    course: Course
    replies: number
    closedAt: Date
    responses: TicketMessage[]
}

export interface TicketMessage extends BaseResponse {
    id: number
    ticketNumber: number
    message: string
    read: boolean
    pin: boolean
    action: string
}

export interface TicketHistory {
    updatedAt: string
    updatedBy: string
    assignedTo?: string
    previouslyAssigned?: string
}
