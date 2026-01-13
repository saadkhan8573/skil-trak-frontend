export interface BaseResponse {
    createdAt: Date
    isActive: boolean
    updatedAt: Date
    deletedAt?: Date | string
}
