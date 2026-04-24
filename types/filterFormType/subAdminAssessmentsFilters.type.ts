import { Result } from '@constants'

export interface SubAdminAssessmentsFiltersType {
    name: string
    email: string
    phone: string
    studentId: string
    result: Result
    rtoId: number
    courseId: number
    studentMaskedId: string
}
