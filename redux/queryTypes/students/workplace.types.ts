import { WorkplaceAnswerEnum } from '@partials/common'
import { WorkplaceEmploymentDocument } from '@partials/student'
import {
    Course,
    Industry,
    RtoApprovalWorkplaceRequest,
    Student,
    StudentProvidedWpAppRequest,
    SubAdmin,
    UserStatus,
} from '@types'
import { WorkplaceCurrentStatus } from '@utils'
import { BaseResponse } from 'types/base.type'

export interface WorkplaceProgress {
    stage: string
    completed: boolean
    current: boolean
}

export interface WorkplaceQuestionType {
    id: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    question: string
    type: string
    answer: WorkplaceAnswerEnum | any
}

export interface AdminWorkplaceCount {
    studentProvided: number
    requested: number
    assigned: number
    unAssigned: number
    placementStarted: number
    completed: number
    blocked: number
    cancelled: number
}

export interface AdminNeedWorkplaceCount {
    UNDER_3_WEEKS: number
    BETWEEN_3WEEKS_2MONTHS: number
    BEYOND_2_MONTHS: number
}

export interface WorkplaceWorkIndustriesType {
    AgreementSigned: boolean
    AgreementSignedDate: Date
    distance: number
    accepted: boolean
    applied: boolean
    appliedDate: Date
    isAutomated: boolean
    appointmentBooked: boolean
    appointmentBookedDate: Date
    awaitingAgreementSigned: boolean
    awaitingAgreementSignedDate: Date
    awaitingWorkplaceResponse: boolean
    awaitingWorkplaceResponseDate: Date
    cancelled: boolean
    cancelledDate: Date
    caseOfficerAssigned: boolean
    caseOfficerAssignedDate: Date
    createdAt: Date
    id: number
    industryCheck: boolean
    industryCheckDate: Date
    industryResponse: string
    industryResponseDate: Date
    interview: boolean
    interviewDate: Date
    isActive: boolean
    isCompleted: boolean
    isCompletedDate: Date
    placementStarted: boolean
    placementStartedDate: Date
    terminated: boolean
    terminatedDate: Date
    updatedAt: Date
    industry: Industry
    workplaceRequest: IWorkplaceIndustries
    actionDate?: any
    actionedBy?: any
    action?: any
}

export interface EmploymentDocument extends BaseResponse {
    file: string
    id: string
    key: string
    workplaceDocumentType: WorkplaceEmploymentDocument
}

export interface Warning {
    id: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    comment: string
    type: string
}

export type RequestStatus = 'pending' | 'approved' | 'rejected'

export interface CancelledRequestType extends BaseResponse {
    id: number
    comment: string
    workplaceCurrentStatus: WorkplaceCurrentStatus
    status: RequestStatus
}

export interface IWorkplaceIndustries {
    warnings?: Warning[]
    approvalStatus?: string
    cancelledAt?: string
    byExistingAbn?: boolean
    studentProvidedWorkplace?: boolean
    assignedTo?: SubAdmin
    industryStatus?: UserStatus
    cancelledBy?: string
    createdAt?: Date
    currentStatus: WorkplaceCurrentStatus
    currentQualification?: string
    currentWork?: string
    haveDrivingLicense?: boolean
    haveTransport?: boolean
    isLogBookReleased?: boolean
    studentFeedBack?: any
    id?: number
    isActive?: boolean
    isCancelled?: boolean
    prefferableLocation?: string
    status?: string
    updatedAt?: Date
    cancelledRequests?: CancelledRequestType[]
    interviewDate?: Date
    appointmentDate?: Date
    industries?: WorkplaceWorkIndustriesType[]
    courses?: Course[]
    student?: Student
    questions?: WorkplaceQuestionType[]
    employmentDocument?: EmploymentDocument
    workplaceApprovaleRequest?: RtoApprovalWorkplaceRequest[]
    latestPendingApproval?: RtoApprovalWorkplaceRequest
    studentProvidedWorkplaceRequestApproval?: StudentProvidedWpAppRequest
}
