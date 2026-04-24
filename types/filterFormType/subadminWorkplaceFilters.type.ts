import { UserStatus } from 'types/user.type'

export interface SubadminWorkplaceFiltersType {
    studentId: string
    name: string
    email: string
    status: UserStatus
    rtoId: number
    industryId: number
    courseId: number
    currentStatus: any
    subAdminId: any
    nowp: any
    studentMaskedId: string
}
