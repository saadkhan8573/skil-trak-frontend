import { InvoiceTypeEnum } from '@partials/admin/invoices'
import { ReportingType } from '@partials/admin/rto/enum'
import { IndustryPlacementStatus } from '@partials/common'
import { Branch } from '@partials/common/StudentProfileDetail/components/Workplace/components/IndustryDetail/components/onViewMapIndustriesInRadius/contactHistoryTab/IndustryCommunications'
import { IWorkplaceIndustries } from '@redux/queryTypes'
import {
    AssessmentToolsType,
    Course,
    IndustrySectorCapacity,
    MealTypes,
    Packages,
    PlacementCall,
    Supervisor,
    WorkplaceType,
} from '@types'
import { BaseResponse } from './base.type'

export enum WorkplaceTokenPlan {
    BASIC = 'basic',
    PREMIUM = 'premium',
    STANDARD = 'standard',
}

export enum StudentStatusEnum {
    ACTIVE = 'active',
    TERMINATED = 'terminated',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    EXPIRED = 'expired',
    QUALIFICATION_ISSUED = 'qualification issued',
}

export enum UserStatus {
    Pending = 'pending',
    Approved = 'approved',
    Rejected = 'rejected',
    Archived = 'archived',
    Blocked = 'blocked',
}

export interface StatusChangeHistoryTypes {
    current: UserStatus
    previous: string
    updateAt: Date
    updateBy: string
}

export interface User extends BaseResponse {
    id: number
    email: string
    name: string
    role: string
    socketId: string | undefined
    status: UserStatus
    password: string
    avatar: string | undefined
    appointmentFor: any
    statusChangeHistory: StatusChangeHistoryTypes[]
    after_hours_access: boolean
    signers: any
    schedules: any
    isEmailVerified: boolean
    student: Student
}

export interface UserCount {
    pending: number | string
    approved: number | string
    rejected: number | string
    blocked: number | string
    archived: number | string
    pendingCourseApprovals: number
    snoozed: any
    completed: number
    unAssigned: number
    placementStarted: number
    schedule: number
    reported: number
    nonPartnerIndustries: number
    partnerIndustries: number
}

export interface SubadminCount extends UserCount {
    admin_approved: number
    rto_approved: number
}

export enum IndustryStatus {
    DEFAULT = 'default',
    FAVOURITE = 'favourite',
    DO_NOT_DISTURB = 'doNotDisturb',
    BLOCKED = 'blocked',
}
export enum RtoStatus {
    DEFAULT = 'default',
    FAVOURITE = 'favourite',
    DO_NOT_DISTURB = 'doNotDisturb',
    FOLLOW_UP = 'followUp',
    SNOOZED = 'snoozed',
}

export interface RtoStatsCount {
    currentStudent: number | string
    pendingResult: number | string
    pendingStudent: number | string
    workplaceRequest: number | string
    pendingDocuments: number | string
}

export interface InvoiceSetting extends BaseResponse {
    id: number
    type: InvoiceTypeEnum
    startDate: Date
    invoiceAction: InvoiceAction
}

export interface InvoiceAction extends BaseResponse {
    id: number
    name: string
}

export interface Rto extends BaseResponse {
    id: number
    rtoCode: string
    abn: string
    phone: string
    suburb: string
    state: string
    addressLine1: string
    addressLine2: string
    studentsCount: string
    zipCode: string
    rtoNetwork: 'private' | 'shareable'
    allowUpdate: boolean
    canAddOwnWorkplace: boolean
    allowAutoComplete: boolean
    canAddNeedWorkplace: boolean
    workplaceApprovalRequired: boolean
    autoReleaseLogBook: boolean
    allowEsignAutoPopulation: boolean
    allowInvoicing: boolean
    allowAutoReport: boolean
    allowPartialSubmission: boolean
    allowStudentSelfPayment: boolean
    canViewPaymentStatus: boolean
    allowScheduleEmails: boolean
    canAccessNewPortal: boolean
    reportType: ReportingType
    user: User
    package: Packages
    courses: Course[]
    subadmin: SubAdmin[]
    students: Student[]
    contactPersons: any
    invoiceSettings: InvoiceSetting[]
    assessmentTools: AssessmentToolsType[]
}

export interface StudentActionsRequest extends BaseResponse {
    id: number
    comment: string
    status: string
    action: string
    snoozedDate: Date
    student: Student
    requestedBy: User
}
export interface RemovePartnerRequest extends BaseResponse {
    id: number
    comment: string
    status: string
    industry: Industry
    requestedBy: User
    snoozedDate: Date
}

export interface SnoozeComment extends BaseResponse {
    id: number
    isActive: boolean
    comment: string
}

export interface Student extends BaseResponse {
    id: number
    studentId: string
    age: string
    isInternational: boolean
    familyName: string
    studentMaskedId: string
    assignToCoordinatorDate: string
    hasIssue: boolean
    isReported: boolean
    statusHistory: any
    expectedDelay: string
    workplaceType: any
    phone: string
    snoozedBy: User
    dob: Date
    isHighPriority: boolean
    emergencyPerson: string
    subadmin: SubAdmin
    called: boolean
    batch: string
    aiVoiceCalls: PlacementCall[]
    emergencyPersonPhone: string
    industries: Industry[]
    expiryDate: Date
    lastContactedAt: string
    addressLine1: string
    rtoInfo: any
    addressLine2: string
    courseDescription: string
    suburb: string
    state: string
    zipCode: string
    oldExpiry: Date
    nonContactable: boolean
    user: User
    rto: Rto
    snoozedAt: Date | undefined
    snoozedDate: Date | undefined
    rtoCoordinator: SubAdmin
    location: string
    studentStatus: StudentStatusEnum
    courses: Course[]
    assessmentEvidence: any[]
    workplace: IWorkplaceIndustries[]
    callLog: CallLog[]
    gender: string
    tickets: any
    isSnoozed: boolean
    isTransferred: boolean
    isAddressUpdated: boolean
    studentUpdateRequests: PartnerRemovalRequests[]
    nonContactableAt: Date
    hasPaid: boolean
    snoozeComments: SnoozeComment[]
}

export interface StudentIssue extends BaseResponse {
    id: number
    category: string
    comment: string
    reportedAt?: Dates
    resolutionDate?: Dates
    resolutionNote?: string
    resolutionStatus: 'pending' | 'resolved' | 'rejected' | string
    isActive: boolean
    isApprovedByManager: boolean
    isReportedByAdmin: boolean
    priority: 'critical' | 'high' | 'medium'
    title: string
    workplaceRequest?: IWorkplaceIndustries
    requestedBy?: {
        id: number
        name: string
        email: string
    }
    student?: Student
}

export interface RtoApprovalWorkplaceRequest extends BaseResponse {
    id: number
    status: 'pending' | 'approved' | 'rejected'
    isRtoApprovalRequired: boolean
    isRejectedByIndustry: boolean
    hasVerifiedCapacity: boolean
    isMarkedComplete: boolean
    isEligible: boolean
    rtoApprovalStatus: 'pending' | 'approved' | 'rejected'
    declaration: string
    isAutomated: boolean
    comment: string
    industryRejectionDate: string
    industryRejectionComment: string
    dates: Dates
    approvalDate: string
    location: Branch
    approvalChannal: string
    student: Student
    industry: Industry
    workplaceRequest: IWorkplaceIndustries
}

export interface Dates {
    date1: string
    date2: string
}

interface UserExtend extends User {
    rto: Rto
    coordinator: SubAdmin
}

export interface DeptMember extends BaseResponse {
    isHod: boolean
    department: Department
    subadmin: SubAdmin & { assignStudents: number }
}

export interface Department extends BaseResponse {
    name: string
    code: string
    email: null
}

export type SupportTeamTagType =
    | 'quality assurance'
    | 'student services'
    | 'admin'
    | 'sourcing team'
    | 'rto team'

export interface SupportTeamType extends BaseResponse {
    id: number
    name: string
    tags: SupportTeamTagType[]
}

export interface SubAdmin extends BaseResponse {
    id: number
    user: User
    phone: string
    appointmentEligibility: boolean
    courses: Course[]
    coordinatorId: string
    addressLine1: string
    createdBy: UserExtend
    isAssociatedWithRto: boolean
    canAdmin: boolean
    isAdmin: boolean
    rtos: Rto[]
    associatedRto: Rto
    canOnPremiumFeature: boolean
    removeOnPlacementStart: boolean
    canCancelWorkPlaceRequest: boolean
    allowRtoListing: boolean
    allowIndustryListing: boolean
    allowAutoAssignment: boolean
    canAccessRtoProfile: boolean
    allowIndustryAssignment: boolean
    canDownloadReport: boolean
    canViewStudentDetails: boolean
    canImportIndustryListing: boolean
    canViewIndustryDetails: boolean
    canApproveWorkplace: boolean
    canAccessRpl: boolean
    canAccessTalentPool: boolean
    canAccessQueries: boolean
    canAccessBlogs: boolean
    globalSearchAccess: boolean
    isManager: boolean
    receiveStudentAssessment: boolean
    receiveWorkplaceRequest: boolean
    canBookAppointments: boolean
    canAccessSubadmin: boolean
    canAddStudents: boolean
    isTodoEnabled: boolean
    canViewAllStudents: boolean
    canCreateInternalTicket: boolean
    canViewRtoList: boolean
    hasRtoWorkplaceApprovalAccess: boolean

    departmentMember: DeptMember

    hasAllStudentAccess: boolean

    studentsCount: number
    supportTeam: SupportTeamType[]
}

export interface PartnerRemovalRequests extends BaseResponse {
    comment: string
    status: string
    action: string
}

export interface IndustryCourseApprovals extends BaseResponse {
    id: number

    status: string
    description: string
    note: null
    file: null
    reference: string[]
    isPreviousCourse: boolean
    isCoordinatorAdded: boolean
    addedBy: User
    actionBy: User
    course: Course
}

export interface StudentProvidedWpAppRequest extends BaseResponse {
    id: number
    status: string
    industry: Industry
    course: Course
    student: Student
}

export type ScheduleType = 'weekly' | 'monthly'

type Day =
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday'

type Slot = {
    id: number
    isActive: boolean
    createdAt: string
    updatedAt: string
    day: Day
    startTime: string // HH:mm:ss
    endTime: string // HH:mm:ss
}

export interface ScheduleDate extends BaseResponse {
    id: number
    date: string // YYYY-MM-DD
}

export interface IndustryInterviewAvailability extends BaseResponse {
    id: number
    type: ScheduleType
    startDate: string | null
    endDate: string | null
    slots: Slot[]
    dates: ScheduleDate[]
    interviewer: User
}

export interface Industry extends BaseResponse {
    id: number
    abn: string
    businessName: string
    phoneNumber: string
    workingHours: any
    bio: string
    dob: Date
    contactPerson: string
    snoozedAt: Date
    snoozedDate: Date
    snoozedBy: any
    isSnoozed: boolean
    missingAttributes: string[]
    contactPersonNumber: string
    isPartner: boolean
    isInterested: boolean
    isPremium: boolean
    PartneredBy: User
    studentCapacity: number | null
    courses: Course[]
    onBoardedAt: any
    branches: Industry[]
    workplaceType: WorkplaceType
    supervisors: Supervisor[]
    industrySectorCapacity: IndustrySectorCapacity[]
    createdBy: any
    channel: string
    isPlacementReady: boolean
    website: string
    addressLine1: string
    onboardingCreatedBy: any
    addressLine2: string
    suburb: string
    state: string
    zipCode: string
    user: User
    location: string
    headQuarter: Industry
    serviceOffered: MealTypes[]
    isHiring: boolean
    subAdmin: SubAdmin[]
    callLog: CallLog[]
    approvalReviewQuestionCount: number
    isAddressUpdated: boolean
    placementStatus: IndustryPlacementStatus
    approvalReviewQuestion: any
    locations: any
    enrolledStudents: number
    favoriteBy: SubAdmin
    partnerRemovalRequests: PartnerRemovalRequests[]
    industryCourseApprovals: IndustryCourseApprovals[]
    profileCompletionPercentage: string
    isRtoAssociated: boolean
    secondaryContactPersonPhone?: string
    secondaryContactName?: string
    secondaryContactEmail?: string
    isAvailabilityProvidedAtRuntime?: boolean
    placementReadyBy: User
    placementReadyAt: string
    placementUrl?: string
    showOnboarding?: boolean
}

export interface PendingIndustry extends Industry {
    industry: Industry
    sector: any
}

export interface IndustryBranchesAddressType extends BaseResponse {
    id: number
    address: string
    contactPerson: string
    contactPersonPhone: string
    contactPersonEmail: string
    suburb: string
    studentCapacity: number
    enrolledStudents: number
    country?: string
    state?: string
}

export interface ContactPerson extends BaseResponse {
    id: number
    name: string
    email: string
    phone: string
}

export interface CallLog extends BaseResponse {
    id: number
    isExpired: boolean
    isAnswered: boolean
    calledBy: User
}
export interface ApiCallResult {
    isLoading: any
    isSuccess: any
    isFetching: any
    isError: any
    error: any
    isUninitialized: any
    status: string
    reset: () => void
    originalArgs: any
    fulfilledTimeStamp: any
    requestId: any
    data: any
    endpointName: any
    startedTimeStamp: any
}

export interface KpiVerification {
    id: number
    isVerified: boolean
}

export interface KpiTarget {
    id: number
    verified: boolean
    user: AppointmentAchievments
    departmentMember: DeptMember
}

export interface AppointmentAchievments extends User {
    appointments: number
    workplaceRequests: number
    agreementByStudent: number
    agreementByWorkplace: number
    completed: number
    progress: number
    targets: Targets
    kpiData: any
    favoriteIndustryStudent: number
    capacityApproved: number
    capacityDeclined: number
}

export interface Targets {
    appointments: number
    workplaceRequests: number
    AgreementByStudent: number
    AgreementByWorkplace: number
    completed: number
}

export interface RtoPlan extends BaseResponse {
    id: number
    cost: string
    token: string
    plan: string
}
