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

export const needsWorkplaceStagesEnum = {
    STUDENT_ADDED: 'Student Added',
    REQUEST_GENERATED: 'Industry Sourcing',
    WAITING_FOR_STUDENT: 'Waiting for Student',
    WAITING_FOR_RTO: 'Waiting for RTO',
    WAITING_FOR_INDUSTRY: 'Waiting for Industry',
    APPOINTMENT: 'Appointment',
    AGREEMENT_PENDING: 'Agreement Pending',
    AGREEMENT_SIGNED: 'Agreement Signed',
    PLACEMENT_STARTED: 'Placement Started',
    SCHEDULE_COMPLETED: 'Schedule Completed',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    Industry_Eligibility_Pending: 'Industry Eligibility Pending',
} as const

export const needsWorkplaceStages = [
    {
        id: 1,
        name: needsWorkplaceStagesEnum.STUDENT_ADDED,
        icon: User,
        color: '#6b7280',
    },
    {
        id: 2,
        name: needsWorkplaceStagesEnum.REQUEST_GENERATED,
        icon: FileText,
        color: '#044866',
    },
    {
        id: 3,
        name: needsWorkplaceStagesEnum.WAITING_FOR_STUDENT,
        icon: User,
        color: '#044866',
    },
    {
        id: 4,
        name: needsWorkplaceStagesEnum.WAITING_FOR_RTO,
        icon: Clock,
        color: '#044866',
    },
    {
        id: 5,
        name: needsWorkplaceStagesEnum.WAITING_FOR_INDUSTRY,
        icon: Building2,
        color: '#044866',
    },
    {
        id: 6,
        name: needsWorkplaceStagesEnum.APPOINTMENT,
        icon: CalendarCheck,
        color: '#0D5468',
    },
    {
        id: 7,
        name: needsWorkplaceStagesEnum.AGREEMENT_PENDING,
        icon: FileText,
        color: '#0D5468',
    },
    {
        id: 8,
        name: needsWorkplaceStagesEnum.AGREEMENT_SIGNED,
        icon: FileCheck,
        color: '#0D5468',
    },
    {
        id: 9,
        name: needsWorkplaceStagesEnum.PLACEMENT_STARTED,
        icon: Play,
        color: '#10b981',
    },
    {
        id: 10,
        name: needsWorkplaceStagesEnum.SCHEDULE_COMPLETED,
        icon: CheckSquare,
        color: '#10b981',
    },
    {
        id: 11,
        name: needsWorkplaceStagesEnum.COMPLETED,
        icon: CheckCircle2,
        color: '#059669',
    },
    {
        id: 12,
        name: needsWorkplaceStagesEnum.CANCELLED,
        icon: User,
        color: '#f01e2c',
    },
]

export const providedWorkplaceStagesEnum = {
    STUDENT_ADDED: 'Student Added',
    PROVIDED_WORKPLACE_REQUEST: 'Provided Workplace Request',
    INDUSTRY_ELIGIBILITY_PENDING: 'Industry Eligibility Pending',
    WAITING_FOR_INDUSTRY: 'Waiting for Industry',
    AGREEMENT_AND_ELIGIBILITY_PENDING: 'Agreement and Eligibility Pending',
    AGREEMENT_AND_ELIGIBILITY_SIGNED: 'Agreement and Eligibility Signed',
    PLACEMENT_STARTED: 'Placement Started',
    SCHEDULE_COMPLETED: 'Schedule Completed',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
} as const

// Workflow for students with provided workplace
export const providedWorkplaceStages = [
    {
        id: 1,
        name: providedWorkplaceStagesEnum.STUDENT_ADDED,
        icon: User,
        color: '#6b7280',
    },
    {
        id: 2,
        name: providedWorkplaceStagesEnum.PROVIDED_WORKPLACE_REQUEST,
        icon: Briefcase,
        color: '#044866',
    },
    {
        id: 3,
        name: providedWorkplaceStagesEnum.INDUSTRY_ELIGIBILITY_PENDING,
        icon: Shield,
        color: '#044866',
    },
    {
        id: 4,
        name: providedWorkplaceStagesEnum.WAITING_FOR_INDUSTRY,
        icon: Building2,
        color: '#044866',
    },
    {
        id: 5,
        name: providedWorkplaceStagesEnum.AGREEMENT_AND_ELIGIBILITY_PENDING,
        icon: FileText,
        color: '#0D5468',
    },
    {
        id: 6,
        name: providedWorkplaceStagesEnum.AGREEMENT_AND_ELIGIBILITY_SIGNED,
        icon: FileCheck,
        color: '#0D5468',
    },
    {
        id: 7,
        name: providedWorkplaceStagesEnum.PLACEMENT_STARTED,
        icon: Play,
        color: '#10b981',
    },
    {
        id: 8,
        name: providedWorkplaceStagesEnum.SCHEDULE_COMPLETED,
        icon: CheckSquare,
        color: '#10b981',
    },
    {
        id: 9,
        name: providedWorkplaceStagesEnum.COMPLETED,
        icon: CheckCircle2,
        color: '#059669',
    },
    {
        id: 10,
        name: providedWorkplaceStagesEnum.CANCELLED,
        icon: User,
        color: '#f01e2c',
    },
]

export type ProvidedWorkplaceStageEnum =
    keyof typeof providedWorkplaceStagesEnum
