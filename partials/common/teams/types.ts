import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    ClipboardCheck,
    CreditCard,
    FileCheck,
    FileQuestion,
    FileStack,
    FileText,
    Headphones,
    HelpCircle,
    Layout,
    Link,
    Locate,
    Mail,
    MapPin,
    MessageSquare,
    Settings,
    ShieldCheck,
    Timer,
    UserCheck,
} from 'lucide-react'

/**
 * Enumeration of ticket types categorised by team.
 */
export enum TicketType {
    // ─────────────────────────────────────────────
    // STUDENT SERVICES TEAM
    // ─────────────────────────────────────────────

    // Approval & Placement
    STU_SERV_STUDENT_APPROVAL_PENDING = 'STU_SERV_STUDENT_APPROVAL_PENDING',
    STU_SERV_PLACEMENT_REQUEST_STUCK_REQUEST_GENERATED = 'STU_SERV_PLACEMENT_REQUEST_STUCK_REQUEST_GENERATED',
    STU_SERV_STUDENT_REJECTED_WORKPLACE = 'STU_SERV_STUDENT_REJECTED_WORKPLACE',
    STU_SERV_RTO_REJECTED_WORKPLACE = 'STU_SERV_RTO_REJECTED_WORKPLACE',

    // Appointments & Scheduling
    STU_SERV_APPOINTMENT_BOOKING_OVERDUE = 'STU_SERV_APPOINTMENT_BOOKING_OVERDUE',
    STU_SERV_APPOINTMENT_NOT_BOOKED = 'STU_SERV_APPOINTMENT_NOT_BOOKED',
    STU_SERV_SCHEDULE_NOT_ADDED = 'STU_SERV_SCHEDULE_NOT_ADDED',

    // eSign Documents
    STU_SERV_ESIGN_PENDING_STUDENT_DOCUMENT = 'STU_SERV_ESIGN_PENDING_STUDENT_DOCUMENT',
    STU_SERV_ESIGN_MULTIPLE_TEMPLATES_DETECTED = 'STU_SERV_ESIGN_MULTIPLE_TEMPLATES_DETECTED',
    STU_SERV_ESIGN_PENDING_PLACEMENT_AGREEMENT = 'STU_SERV_ESIGN_PENDING_PLACEMENT_AGREEMENT',
    STU_SERV_ESIGN_PENDING_FACILITY_CHECKLIST = 'STU_SERV_ESIGN_PENDING_FACILITY_CHECKLIST',

    // ─────────────────────────────────────────────
    // INDUSTRY SOURCING TEAM
    // ─────────────────────────────────────────────

    // Placement & Eligibility
    IND_SRC_PLACEMENT_REQUEST_STUCK_AWAITING_RESPONSE = 'IND_SRC_PLACEMENT_REQUEST_STUCK_AWAITING_RESPONSE',
    IND_SRC_PLACEMENT_REQUEST_STUCK_INDUSTRY_ELIGIBILITY = 'IND_SRC_PLACEMENT_REQUEST_STUCK_INDUSTRY_ELIGIBILITY',
    IND_SRC_NO_NEARBY_WORKPLACE_FOUND = 'IND_SRC_NO_NEARBY_WORKPLACE_FOUND',

    // Industry & Appointments
    IND_SRC_INDUSTRY_NO_APPOINTMENT_AVAILABILITY = 'IND_SRC_INDUSTRY_NO_APPOINTMENT_AVAILABILITY',

    // eSign Documents
    IND_SRC_ESIGN_PENDING_DOCUMENT = 'IND_SRC_ESIGN_PENDING_DOCUMENT',
}

export type TicketTypeCategory =
    | 'STUDENT_SERVICES'
    | 'INDUSTRY_SOURCING'
    | 'ALL'

export const getTicketTypeLabel = (type: TicketType): string => {
    return type
        .replace(/^(STU_SERV_|IND_SRC_)/, '')
        .split('_')
        .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ')
}

export const getTicketTypeDescription = (type: TicketType): string => {
    // Add logic if descriptions are needed, for now just a mapping or empty
    return ''
}

export type TicketTypeInfo = {
    key: TicketType
    label: string
    desc: string
    color: string
}

export const TICKET_TYPE_GROUPS: Record<TicketTypeCategory, TicketType[]> = {
    STUDENT_SERVICES: [
        TicketType.STU_SERV_STUDENT_APPROVAL_PENDING,
        TicketType.STU_SERV_PLACEMENT_REQUEST_STUCK_REQUEST_GENERATED,
        TicketType.STU_SERV_STUDENT_REJECTED_WORKPLACE,
        TicketType.STU_SERV_RTO_REJECTED_WORKPLACE,
        TicketType.STU_SERV_APPOINTMENT_BOOKING_OVERDUE,
        TicketType.STU_SERV_APPOINTMENT_NOT_BOOKED,
        TicketType.STU_SERV_SCHEDULE_NOT_ADDED,
        TicketType.STU_SERV_ESIGN_PENDING_STUDENT_DOCUMENT,
        TicketType.STU_SERV_ESIGN_MULTIPLE_TEMPLATES_DETECTED,
        TicketType.STU_SERV_ESIGN_PENDING_PLACEMENT_AGREEMENT,
        TicketType.STU_SERV_ESIGN_PENDING_FACILITY_CHECKLIST,
    ],
    INDUSTRY_SOURCING: [
        TicketType.IND_SRC_PLACEMENT_REQUEST_STUCK_AWAITING_RESPONSE,
        TicketType.IND_SRC_PLACEMENT_REQUEST_STUCK_INDUSTRY_ELIGIBILITY,
        TicketType.IND_SRC_NO_NEARBY_WORKPLACE_FOUND,
        TicketType.IND_SRC_INDUSTRY_NO_APPOINTMENT_AVAILABILITY,
        TicketType.IND_SRC_ESIGN_PENDING_DOCUMENT,
    ],
    ALL: Object.values(TicketType),
}

export const TICKETS_CONFIG: Record<
    TicketType,
    { icon: any; color: string; desc: string }
> = {
    // Student Services
    [TicketType.STU_SERV_STUDENT_APPROVAL_PENDING]: {
        icon: UserCheck,
        color: 'indigo',
        desc: 'Student awaiting initial approval',
    },
    [TicketType.STU_SERV_PLACEMENT_REQUEST_STUCK_REQUEST_GENERATED]: {
        icon: Timer,
        color: 'amber',
        desc: 'Request generated but not progressing',
    },
    [TicketType.STU_SERV_STUDENT_REJECTED_WORKPLACE]: {
        icon: AlertTriangle,
        color: 'rose',
        desc: 'Student rejected assigned workplace',
    },
    [TicketType.STU_SERV_RTO_REJECTED_WORKPLACE]: {
        icon: ShieldCheck,
        color: 'slate',
        desc: 'RTO rejected the workplace',
    },
    [TicketType.STU_SERV_APPOINTMENT_BOOKING_OVERDUE]: {
        icon: Calendar,
        color: 'orange',
        desc: 'Booking deadline has passed',
    },
    [TicketType.STU_SERV_APPOINTMENT_NOT_BOOKED]: {
        icon: ClipboardCheck,
        color: 'blue',
        desc: 'Appointment still needs booking',
    },
    [TicketType.STU_SERV_SCHEDULE_NOT_ADDED]: {
        icon: Layout,
        color: 'purple',
        desc: 'Missing schedule information',
    },
    [TicketType.STU_SERV_ESIGN_PENDING_STUDENT_DOCUMENT]: {
        icon: FileText,
        color: 'emerald',
        desc: 'Awaiting student signature',
    },
    [TicketType.STU_SERV_ESIGN_MULTIPLE_TEMPLATES_DETECTED]: {
        icon: FileStack,
        color: 'indigo',
        desc: 'Conflict with multiple templates',
    },
    [TicketType.STU_SERV_ESIGN_PENDING_PLACEMENT_AGREEMENT]: {
        icon: FileCheck,
        color: 'blue',
        desc: 'Pending agreement signature',
    },
    [TicketType.STU_SERV_ESIGN_PENDING_FACILITY_CHECKLIST]: {
        icon: ClipboardCheck,
        color: 'slate',
        desc: 'Awaiting facility checklist',
    },

    // Industry Sourcing
    [TicketType.IND_SRC_PLACEMENT_REQUEST_STUCK_AWAITING_RESPONSE]: {
        icon: Mail,
        color: 'blue',
        desc: 'Waiting for industry response',
    },
    [TicketType.IND_SRC_PLACEMENT_REQUEST_STUCK_INDUSTRY_ELIGIBILITY]: {
        icon: ShieldCheck,
        color: 'amber',
        desc: 'Checking industry eligibility',
    },
    [TicketType.IND_SRC_NO_NEARBY_WORKPLACE_FOUND]: {
        icon: MapPin,
        color: 'rose',
        desc: 'No workplaces in radius',
    },
    [TicketType.IND_SRC_INDUSTRY_NO_APPOINTMENT_AVAILABILITY]: {
        icon: Calendar,
        color: 'orange',
        desc: 'Industry has no slots',
    },
    [TicketType.IND_SRC_ESIGN_PENDING_DOCUMENT]: {
        icon: FileText,
        color: 'emerald',
        desc: 'Pending industry document',
    },
}

export enum TeamMemberRole {
    MEMBER = 'member',
    LEAD = 'lead',
}

export interface BulkUpdateMemberItem {
    memberId: number
    canReceiveTickets: boolean
    ticketTypes: TicketType[]
    role?: TeamMemberRole
    assignedRtoOnly?: boolean
    assignedStudentOnly?: boolean
}

export interface BulkUpdateMembersRequest {
    data: BulkUpdateMemberItem[]
}
