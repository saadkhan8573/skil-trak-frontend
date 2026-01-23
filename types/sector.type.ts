import { Result } from '@constants'
import { AssessmentEvidenceFolder } from './assessment-evidence.type'
import { BaseResponse } from './base.type'
import { ConfirmationSource } from './confirmation.type'
import { Folder } from './folder.type'
import { Industry, Student, User } from './user.type'

export interface CourseExtraHours extends BaseResponse {
    id: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    hours: string
}

export interface WPSectorType extends BaseResponse {
    id: number
    sector: Sector
}

export interface WorkplaceType extends BaseResponse {
    id: number
    isActive: boolean
    name: string
    sector: Sector
    course: Course
    workplaceTypeSectors: WPSectorType[]
    sectors: WPSectorType[]
}
export interface WorkplaceTypes extends BaseResponse {
    id: number
    isActive: boolean
    workplaceType: WorkplaceType
}

export interface IndustrySectorApproval extends BaseResponse {
    id: number
    status: 'approved' | 'pending' | 'rejected'
    note: string
    rejectedAt: string
}

export interface CourseInfo extends BaseResponse {
    id: number
    info: string
}

export interface IndustryHighlightedTasks extends BaseResponse {
    id: number
    isConfirmed: boolean
    confirmedBy: User
    confirmationSource: ConfirmationSource
}

export interface IndustryCourseApproval extends BaseResponse {
    id: number
    status: 'pending' | 'approved' | 'rejected'
    description: string
    hodComment: string
    isVerifiedByHod: boolean
    deletedBy: User
    isContentVerified: boolean
    note: string
    file: string
    reference: string[]
    isPreviousCourse: boolean
    isCoordinatorAdded: boolean
    addedBy: User
    actionBy: User
    course: Course
    industry?: Industry
}

export interface AssessmentResult extends BaseResponse {
    id: number;
    finalComment: string;
    isSubmitted: boolean;
    isManualSubmission: boolean;
    isAssessed: boolean;
    totalSubmission: number;
    result: Result;
    assessor: User;
    student: Student;
    comments: string[];
  }

export interface Course extends BaseResponse {
    id: number
    code: string
    title: string
    esignTemplates: any
    name: string
    level: number
    description: string
    hours: number
    requirements: string
    courseRequirements?: any
    sector: Sector
    keywords: string[]
    folders: Folder[]
    results: AssessmentResult[]
    timing: any
    students: Student[]
    isSuperseded: boolean
    extraHours: CourseExtraHours[]
    assessmentEvidence: AssessmentEvidenceFolder[]
    workplaceTypes: WorkplaceTypes[]
    courseInfo: CourseInfo[]
    approvals: IndustryCourseApproval[]
    highlightedTasks?: { id?: number; statement: string }[]
    industryHighlightedTasks: IndustryHighlightedTasks[]
    changedHighlightedTaskIds?: number[]
}

export interface Sector extends BaseResponse {
    id: number
    code: string
    name: string
    keywords?: string[]
    courses: Course[]
    industryApproval: IndustrySectorApproval[]
}

export interface GetSectorsType {
    [key: string]: Course[]
}

export interface CourseDetailType extends Course {
    assessmentEvidence: AssessmentEvidenceFolder[]
    folder: Folder[]
}

export interface CourseProgramType extends BaseResponse {
    id: number
    hours: string
    title: string
    course: Course
}

export enum DeliveryMode {
    ONSITE = 'onsite',
    ONLINE = 'online',
    BLENDED = 'blended',
    SIMULATION = 'simulation',
}

export interface CourseProgramData extends BaseResponse {
    id: number

    deliveryMode: DeliveryMode[]
    courseProgram: CourseProgramType
}

export interface IndustrySectorCapacity extends BaseResponse {
    id: number
    capacity: string
    enrolled: string
}

export interface DefaultDocumentsType extends BaseResponse {
    id: number
    name: string
    capacity: number
    type: string
    description: string
    link: string
}
