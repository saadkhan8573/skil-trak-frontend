import { UserRoles } from '@constants'
import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import {
    Industry,
    PaginatedResponse,
    Rto,
    Student,
    SubadminAvailabilitiesList,
    User,
} from '@types'
import { IWorkplaceIndustries } from 'redux/queryTypes'

const PREFIX = 'subadmin'

interface Def extends Student {
    workplace: IWorkplaceIndustries[]
}

interface Abc extends User {
    student: Def
    industry: Industry
    rto: Rto
}
export const subAdminAppointmentspoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    searchUser: builder.query<any, any | null>({
        query: (params) => ({
            url: `appointments/user/search`,
            params,
        }),
        providesTags: ['Appointment'],
    }),
    searchSubAdminUsers: builder.query<
        PaginatedResponse<User>,
        { search: string; role: UserRoles; skip: number; limit: number }
    >({
        query: (params) => ({
            url: `appointments/sub-admin/user/search`,
            params,
        }),
        providesTags: ['Appointment'],
    }),
    userAvailabilities: builder.query<
        any,
        { date: Date; id: number; forUser: number; byUser: number }
    >({
        query: (params) => ({
            url: `subadmin/user/availabilities`,
            params,
        }),
        providesTags: ['Appointment'],
    }),
    searchUserById: builder.query<Abc, { search: number; role: UserRoles }>({
        query: (params) => ({
            url: 'subadmin/user/find',
            params,
        }),
        providesTags: ['Appointment'],
    }),
    availabilityList: builder.query<SubadminAvailabilitiesList[], void>({
        query: () => 'subadmin/availabilities/list',
        providesTags: ['Appointment'],
    }),
})
