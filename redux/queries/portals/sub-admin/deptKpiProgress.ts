import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { PaginationWithSearch } from '@types'

const PREFIX = 'kpi'
export const deptKpiProgressEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    deptEmployeeCounts: builder.query<any, void>({
        query: () => `${PREFIX}/department/subadmins/count`,
        providesTags: ['Logbook'],
    }),
    deptSubadminReportList: builder.query<any, PaginationWithSearch>({
        query: (params) => ({
            url: `${PREFIX}/department/subadmins/list`,
            params,
        }),
        providesTags: ['KPIS'],
    }),

    deptEmployeeProgressCounts: builder.query<any, { search: string }>({
        query: (params) => ({
            url: `${PREFIX}/department/subadmins/average`,
            params,
        }),
        providesTags: ['KPIS'],
    }),

    deptEmployeeProgressByMonth: builder.query<any, void>({
        query: () => `${PREFIX}/department/data/monthly`,
        providesTags: ['KPIS'],
    }),

    deptSubadminDetail: builder.query<any, number>({
        query: (id) => `${PREFIX}/subadmin/${id}/kpi-details`,
        providesTags: ['KPIS'],
    }),

    verifyDeptSubadmin: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/subadmin/${id}/kpi-verify`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Students', 'SubAdminStudents', 'KPIS'],
    }),
    deptKpiTargetList: builder.query<any, void>({
        query: () => `${PREFIX}/department/targets`,
        providesTags: ['KPIS'],
    }),

    saveDeptKpiTarget: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/target-add/for-department/by-hod`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['KPIS'],
    }),
})
