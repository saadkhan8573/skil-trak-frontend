import {
    Briefcase,
    Building2,
    CalendarCheck,
    CheckCircle2,
    CheckSquare,
    Clock,
    FileCheck,
    FileText,
    Play,
    Shield,
    User,
} from 'lucide-react'
export const workplaceStatus = {
    ADMIN: 'admin',
    USER: 'user',
    GUEST: 'guest',
} as const

export const needsWorkplaceStages = [
    { id: 1, name: 'Student Added', icon: User, color: '#6b7280' },
    { id: 2, name: 'Request Generated', icon: FileText, color: '#044866' },
    { id: 3, name: 'Waiting for Student', icon: User, color: '#044866' },
    { id: 4, name: 'Waiting for RTO', icon: Clock, color: '#044866' },
    {
        id: 5,
        name: 'Waiting for Industry',
        icon: Building2,
        color: '#044866',
    },
    { id: 6, name: 'Appointment', icon: CalendarCheck, color: '#0D5468' },
    { id: 7, name: 'Agreement Pending', icon: FileText, color: '#0D5468' },
    { id: 8, name: 'Agreement Signed', icon: FileCheck, color: '#0D5468' },
    { id: 9, name: 'Placement Started', icon: Play, color: '#10b981' },
    {
        id: 10,
        name: 'Schedule Completed',
        icon: CheckSquare,
        color: '#10b981',
    },
    { id: 11, name: 'Completed', icon: CheckCircle2, color: '#059669' },
]

export const needsWorkplaceStagesEnum = {
    STUDENT_ADDED: 'Student Added',
    REQUEST_GENERATED: 'Request Generated',
    WAITING_FOR_STUDENT: 'Waiting for Student',
    WAITING_FOR_RTO: 'Waiting for RTO',
    WAITING_FOR_INDUSTRY: 'Waiting for Industry',
    APPOINTMENT: 'Appointment',
    AGREEMENT_PENDING: 'Agreement Pending',
    AGREEMENT_SIGNED: 'Agreement Signed',
    PLACEMENT_STARTED: 'Placement Started',
    SCHEDULE_COMPLETED: 'Schedule Completed',
    COMPLETED: 'Completed',
} as const

// Workflow for students with provided workplace
export const providedWorkplaceStages = [
    { id: 1, name: 'Student Added', icon: User, color: '#6b7280' },
    {
        id: 2,
        name: 'Provided Workplace Request',
        icon: Briefcase,
        color: '#044866',
    },
    {
        id: 3,
        name: 'Industry Eligibility Pending',
        icon: Shield,
        color: '#044866',
    },
    {
        id: 4,
        name: 'Waiting for Industry',
        icon: Building2,
        color: '#044866',
    },
    {
        id: 5,
        name: 'Agreement and Eligibility Pending',
        icon: FileText,
        color: '#0D5468',
    },
    {
        id: 6,
        name: 'Agreement and Eligibility Signed',
        icon: FileCheck,
        color: '#0D5468',
    },
    { id: 7, name: 'Placement Started', icon: Play, color: '#10b981' },
    {
        id: 8,
        name: 'Schedule Completed',
        icon: CheckSquare,
        color: '#10b981',
    },
    { id: 9, name: 'Completed', icon: CheckCircle2, color: '#059669' },
]

export const providedWorkplaceStagesEnum = {
    STUDENT_ADDED: providedWorkplaceStages[0]?.name,
    PROVIDED_WORKPLACE_REQUEST: providedWorkplaceStages[1]?.name,
    INDUSTRY_ELIGIBILITY_PENDING: providedWorkplaceStages[2]?.name,
    WAITING_FOR_INDUSTRY: providedWorkplaceStages[3]?.name,
    AGREEMENT_AND_ELIGIBILITY_PENDING: providedWorkplaceStages[4]?.name,
    AGREEMENT_AND_ELIGIBILITY_SIGNED: providedWorkplaceStages[5]?.name,
    PLACEMENT_STARTED: providedWorkplaceStages[6]?.name,
    SCHEDULE_COMPLETED: providedWorkplaceStages[7]?.name,
    COMPLETED: providedWorkplaceStages[8]?.name,
} as const

export type ProvidedWorkplaceStageEnum =
    keyof typeof providedWorkplaceStagesEnum
