import { UserStatus } from 'types/user.type'

export interface AdminWorkplaceFiltersType {
    studentId: string
    studentMaskedId: string
    name: string
    email: string
    location: string
    status: UserStatus
    subAdminId: number
    rtoId: number
    industryId: number
    depId: number
    courseId: number
    nowp: string
}
