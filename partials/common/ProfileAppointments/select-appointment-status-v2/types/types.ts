export type AppointmentStatus = 'successful' | 'not-successful'

export type UnsuccessfulReason = 'missed' | 'rejected' | 'other'

export interface DaySchedule {
    day: string
    available: boolean
    startTime: string
    endTime: string
}

export interface AppointmentStatusFormValues {
    status?: AppointmentStatus
    addHours?: string
    startingDate?: string
    unsuccessfulReason?: UnsuccessfulReason
    rejectionReason?: string
    otherReason?: string
    weekSchedule: DaySchedule[]
}
