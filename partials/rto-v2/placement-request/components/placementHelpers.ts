import {
    Send,
    UserCheck,
    MessageSquare,
    Clock,
    Calendar,
    FileSignature,
    FileCheck,
    Play,
    CheckCircle2,
    XCircle,
    CheckCircle,
} from 'lucide-react'

export type PlacementStatus =
    | 'applied'
    | 'caseOfficerAssigned'
    | 'interview'
    | 'awaitingStudentResponse'
    | 'awaitingRtoResponse'
    | 'awaitingWorkplaceResponse'
    | 'appointmentBooked'
    | 'awaitingAgreementSigned'
    | 'agreement_signed'
    | 'placementStarted'
    | 'industryEligibility'
    | 'completed'
    | 'cancelled'

export type PlacementType = 'needs_workplace' | 'provided_workplace'

export interface PlacementRequest {
    id: string
    student: {
        name: string
        email: string
        phone: string
        avatar?: string
    }
    course: string
    batch: string
    rtoName?: string
    type: PlacementType
    status: any
    workplace?: string
    industry?: string
    location?: string
    requestDate: string
    lastUpdated: string
    aiMatchScore?: number
    coordinator?: string
    notes?: string
}

export const statusConfig: any = {
    applied: {
        label: 'Request Sent',
        icon: Send,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200 ',
    },
    caseOfficerAssigned: {
        label: 'Assigned',
        icon: UserCheck,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200 ',
    },
    interview: {
        label: 'Interview',
        icon: MessageSquare,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200',
    },
    industryEligibility: {
        label: 'Industry Eligibility',
        icon: CheckCircle,
        color: 'text-teal-600',
        bgColor: 'bg-teal-50',
        borderColor: 'border-teal-200',
    },
    awaitingStudentResponse: {
        label: 'Waiting For Student',
        icon: Clock,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
    },
    awaitingRtoResponse: {
        label: 'Waiting For RTO',
        icon: Clock,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
    },
    awaitingWorkplaceResponse: {
        label: 'Waiting For Industry',
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200 ',
    },
    appointmentBooked: {
        label: 'Appointment',
        icon: Calendar,
        color: 'text-cyan-600',
        bgColor: 'bg-cyan-50 ',
        borderColor: 'border-cyan-200',
    },
    awaitingAgreementSigned: {
        label: 'Agreement & Eligibility (Pending)',
        icon: FileSignature,
        color: 'text-rose-600',
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-200',
    },
    AgreementSigned: {
        label: 'Agreement & Eligibility (Signed)',
        icon: FileCheck,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50 ',
        borderColor: 'border-emerald-200 ',
    },
    placementStarted: {
        label: 'Placement Started',
        icon: Play,
        color: 'text-green-600',
        bgColor: 'bg-green-50 ',
        borderColor: 'border-green-200 ',
    },
    completed: {
        label: 'Schedule Completed',
        icon: CheckCircle2,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-success/20',
    },
    cancelled: {
        label: 'Cancelled',
        icon: XCircle,
        color: 'text-destructive',
        bgColor: 'bg-destructive/10',
        borderColor: 'border-destructive/20',
    },
}

export const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
}

export const getStatusCounts = (requests: PlacementRequest[]) => {
    return {
        all: requests.length,
        request_sent: requests.filter((r) => r.status === 'applied').length,
        assigned: requests.filter((r) => r.status === 'caseOfficerAssigned')
            .length,
        interview: requests.filter((r) => r.status === 'interview').length,
        waiting_student: requests.filter(
            (r) => r.status === 'caseOfficerAssigned'
        ).length,
        waiting_rto: requests.filter((r) => r.status === 'awaitingRtoResponse')
            .length,
        waiting_industry: requests.filter(
            (r) => r.status === 'awaitingWorkplaceResponse'
        ).length,
        appointment: requests.filter((r) => r.status === 'appointmentBooked')
            .length,
        agreement_pending: requests.filter(
            (r) => r.status === 'awaitingAgreementSigned'
        ).length,
        agreement_signed: requests.filter(
            (r) => r.status === 'agreement_signed'
        ).length,
        placement_started: requests.filter(
            (r) => r.status === 'placementStarted'
        ).length,
        schedule_completed: requests.filter((r) => r.status === 'completed')
            .length,
        cancelled: requests.filter((r) => r.status === 'cancelled').length,
    }
}

export const filterRequests = (
    requests: PlacementRequest[],
    activeTab: PlacementType,
    searchQuery: string,
    statusFilter: PlacementStatus | 'all'
): PlacementRequest[] => {
    return requests.filter((req) => {
        const matchesTab = req.type === activeTab
        const matchesSearch =
            searchQuery === '' ||
            req.student.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            req.workplace?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.course.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus =
            statusFilter === 'all' || req.status === statusFilter

        return matchesTab && matchesSearch && matchesStatus
    })
}
