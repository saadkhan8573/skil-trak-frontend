import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

import { PaginationWithSearch } from '@types'

type KpiProgress = PaginationWithSearch & { id: number }

const PREFIX = 'kpi'
export const kpiProgressEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    kpiDeptList: builder.query<any, void>({
        query: () => `${PREFIX}/departments-list`,
        providesTags: ['KPIS'],
    }),
    kpiTypesList: builder.query<any, void>({
        query: () => `${PREFIX}/types-list`,
        providesTags: ['KPIS'],
    }),

    kpiTargetsList: builder.query<any, number>({
        query: (id) => `${PREFIX}/department/${id}/targets`,
        providesTags: ['KPIS'],
    }),

    addKpiType: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/type-add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['KPIS'],
    }),

    addKpiTarget: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/target-add/for-department`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['KPIS'],
    }),

    removeTarget: builder.mutation<any, any>({
        query: (id) => ({
            url: `${PREFIX}/target/${id}/remove`,
            method: 'DELETE',
        }),
        invalidatesTags: ['KPIS'],
    }),

    subadminReportList: builder.query<any, PaginationWithSearch>({
        query: (params) => ({
            url: `${PREFIX}/subadmins/list`,
            params,
        }),
        providesTags: ['KPIS'],
    }),

    overAllEmployeeProgressCounts: builder.query<any, { search: string }>({
        query: (params) => ({
            url: `${PREFIX}/subadmins/average`,
            params,
        }),
        providesTags: ['KPIS'],
    }),
    overAllEmployeeProgressByMonth: builder.query<any, void>({
        query: () => `${PREFIX}/subadmins/average/monthly`,
        providesTags: ['KPIS'],
    }),

    employeeProgressCountsByDept: builder.query<
        any,
        { deptId: number; search: string }
    >({
        query: ({ deptId, ...params }) => ({
            url: `${PREFIX}/department/${deptId}/data`,
            params,
        }),
        providesTags: ['KPIS'],
    }),
    employeeCounts: builder.query<any, void>({
        query: () => `${PREFIX}/subadmins/count`,
        providesTags: ['KPIS'],
    }),

    subadminDetail: builder.query<any, { id: number }>({
        query: ({ id }) => `${PREFIX}/subadmin/${id}/kpi-details`,
        providesTags: ['KPIS'],
    }),
    subadminProgress: builder.query<any, { id: number; search: string }>({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/subadmin/${id}/kpi-progress`,
            params,
        }),
        providesTags: ['KPIS'],
    }),

    subadminKpiAppointmentDetails: builder.query<any, KpiProgress>({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/subadmin/${id}/appointments-data`,
            params,
        }),
        providesTags: ['KPIS'],
    }),

    subadminKpiWorkplaceDetails: builder.query<any, KpiProgress>({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/subadmin/${id}/workplace-data`,
            params,
        }),
        providesTags: ['KPIS'],
    }),

    subadminKpiCompletedDetails: builder.query<any, KpiProgress>({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/subadmin/${id}/completed-data`,
            params,
        }),
        providesTags: ['KPIS'],
    }),

    subadminKpiWorkplaceAgreementDetails: builder.query<any, KpiProgress>({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/subadmin/${id}/agreement/workplace/requested-data`,
            params,
        }),
        providesTags: ['KPIS'],
    }),

    subadminKpiStudentAgreementDetails: builder.query<any, KpiProgress>({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/subadmin/${id}/agreement/workplace/provided-data`,
            params,
        }),
        providesTags: ['KPIS'],
    }),

    subadminKpiCallIndustriesDetails: builder.query<any, KpiProgress>({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/subadmin/${id}/called-industries/list`,
            params,
        }),
        providesTags: ['KPIS'],
    }),

    subadminKpiCallStudentsDetails: builder.query<any, KpiProgress>({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/subadmin/${id}/called-students/list`,
            params,
        }),
        providesTags: ['KPIS'],
    }),

    subadminKpiFlagedStudentsDetails: builder.query<any, KpiProgress>({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/subadmin/${id}/flagged-students/list`,
            params,
        }),
        providesTags: ['KPIS'],
    }),

    subadminKpiSnoozedStudentsDetails: builder.query<any, KpiProgress>({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/subadmin/${id}/snoozed-students/list`,
            params,
        }),
        providesTags: ['KPIS'],
    }),
})
