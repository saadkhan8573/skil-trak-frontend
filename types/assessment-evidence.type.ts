import { Result } from '@constants'
import { BaseResponse } from './base.type'
import { Course } from './sector.type'
import { Industry, Student, User, UserStatus } from './user.type'
import { AddCommentEnum } from './form'

export interface AssessmentEvidenceFolder extends BaseResponse {
    id: number
    skiltrakId: number
    name: string
    type: string
    capacity: number
    description: string
    positiveComment: string
    negativeComment: string
    notAssessed: boolean
    isMandatory: boolean
    isAgreement: boolean
    studentResponse: StudentResponseType[]
    isFacilityCheckList: boolean
    isOtherDoc: boolean
    isIndustryCheck: boolean
    isCustom: boolean
    assessmentResult: any
    comments: any
    industryCheck:any
}

export interface CourseWithAssessmentEvidence extends Course {
    assessmentEvidence: AssessmentEvidenceFolder[]
}

export interface AssessmentSubmissionsCount {
    pending?: number
    notCompetent?: number
    competent?: number
    reOpened?: number
    archived?: number
    allDocumentSubmitted?: number
}

export interface AssessmentEvidenceType extends BaseResponse {
    id: number
    finalComment: null
    isSubmitted: boolean
    isManualSubmission: boolean
    isAssessed: null
    autoSubmission: boolean
    totalSubmission: number
    notifyCoordinator: boolean
    notifyStudent: boolean
    notifyRto: boolean
    status: UserStatus
    result: Result
    student: Student
    course: Course
}

export interface FileType extends BaseResponse {
    id: number
    file: string
    filename: string
    isArchived: boolean
    skiltrakId: number
    type: any
    uploadedBy?: User
    actionedBy?: User
    comment?: string
    status: string
    size?: string
}

export interface StudentResponseType extends BaseResponse {
    id: number
    filesCount: number
    skiltrakId: number
    comment: string
    status: string
    files: FileType[]
    reSubmitted: boolean
}

export interface AssessmentEvidenceDetailType extends BaseResponse {
    id: number
    skiltrakId: number
    name: string
    type: string
    capacity: number
    description: string
    positiveComment: string
    negativeComment: string
    notAssessed: boolean
    studentResponse: StudentResponseType[]
    course: Course
    isAgreement: boolean
    isIndustryCheck: boolean
    isFacilityCheckList: boolean
    link: string
    otherDoc: boolean
}

export interface AssessmentEvidenceResponse extends BaseResponse {
    id: number
    skiltrakId: number
    comment: string
    studentResponse: StudentResponseType[]
    status: AddCommentEnum
    assessmentFolder: AssessmentEvidenceFolder
    files: FileType[]
}

export interface AgreementFileType {
    file: string
    fileName: string
    student: Student
    course: Course
    industry: Industry
}

export interface AssessmentAddCommentType extends BaseResponse {
    id: number

    skiltrakId: string | null
    comment: string
    status: string
}

export interface ArchiveAssessmentType extends BaseResponse {
    id: number
    isSubmitted: boolean
    isManualSubmission: boolean
    isAssessed: null
    autoSubmission: boolean
    totalSubmission: number
    notifyCoordinator: boolean
    notifyStudent: boolean
    notifyRto: boolean
    status: string
    result: Result
}

export interface CommentType extends BaseResponse {
    id: number
    comment: string
    status: string
    folder: AssessmentEvidenceFolder
}
export interface AssessmentResultType
    extends ArchiveAssessmentType, BaseResponse {
    id: number
    finalComment: string
    assessor: User
    student: Student
    comments: CommentType[]
}

export interface FolderStatusConfig {
    icon: any
    color: string
    bg: string
    border: string
    badge: string
}

export interface AssessmentDocumentCount {
    approvedCourseDocuments: number
    approvedDocuments: number
    approvedIndustryCheck: number
    courseDocuments: number
    industryCheck: number
    pendingCourseDocuments: number
    pendingDocuments: number
    pendingIndustryCheck: number
}

export interface CourseResult {
    result: Result
    createdAt?: string | Date
    id?: number
    totalSubmission?: number
    isSubmitted?: boolean
    isManualSubmission?: boolean
}
