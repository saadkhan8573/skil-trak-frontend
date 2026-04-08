import { BaseResponse } from 'types/base.type'
import { TypeOptionsEnum } from 'types/folder.type'
import { Course } from 'types/sector.type'

export interface AddFolderFormType {
    name: string
    capacity: number
    type: TypeOptionsEnum
    description: string
    isRequired: boolean
    category: string
    isAgreement: boolean
    isFacilityCheckList: boolean
    isLogbook: boolean
}

export interface AddFolderFormQueryType extends AddFolderFormType {
    id?: number
    course: number
}

export interface AddFolderQueryResponseType extends BaseResponse {
    id: number
    course: Course
    isCustom: boolean
}
