import { subAdminApi } from './../../redux/queries/portals/sub-admin/sub-admin.query'
export interface SubadminIndustryFilter {
    name: string
    email: string
    phone: string
    abn: string
    suburb: string
    courseId: number
    address: string
    state?: string
    isHiring: boolean
    isPartner: boolean
    subAdminId: any
    feature: number
    placementReady: string
}
