import { PlacementTypeEnum } from '@partials/rto-v2/import-students/enum'
import { OptionType } from 'types/option.type'
import { Course } from 'types/sector.type'
import { Student } from 'types/user.type'

export interface RtoAssessmentToolFormType extends FormData {
    course: number
    title: string
    file: File
    isLogBook: boolean
    isIndustryLogBook: boolean
}

export interface ImportStudentFileList {
    address: string
    email: string
    id: string
    name: string
    contact: string
}

export interface ImportStudentFormType {
    batch: string
    expiryDate: string
    courses: number[]
    students: Student[]
    list: ImportStudentFileList
    placementType: PlacementTypeEnum
}
