import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'management'
export const checkKpiEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    // Get Queries
    getKpiReportList: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/kpi-reports/data/list`,
            params,
        }),
        providesTags: ['KpiReportList', 'KpiReportDocument'],
    }),
    getSubAdminKpiReports: builder.query<any, any>({
        query: ({ id, params }) => ({
            url: `${PREFIX}/subadmin/${id}/kpi-reports`,
            params,
        }),
        providesTags: ['TeamManagement', 'KpiReportDocument'],
    }),
    getKpiReportDetail: builder.query<any, any>({
        query: ({ id, params }) => ({
            url: `${PREFIX}/kpi-report/${id}/data`,
            params,
        }),
        providesTags: ['TeamManagement'],
    }),
    getKpiReportDuplicationDetail: builder.query<any, any>({
        query: ({ id, params }) => {
            return {
                url: `${PREFIX}/kpi-report/${id}/duplications`,
                params,
            }
        },
        providesTags: ['TeamManagement'],
    }),

    getKpiReportOverview: builder.query<any, any>({
        query: (id) => {
            return {
                url: `${PREFIX}/kpi-report/${id}/detail`,
            }
        },
        providesTags: ['KpiReportDocument'],
    }),
    getManagementDashboardCount: builder.query<any, void>({
        query: () => {
            return {
                url: `${PREFIX}/count/all`,
            }
        },
        providesTags: ['KpiReportDocument'],
    }),
    getKpiStatusBasedCount: builder.query<any, void>({
        query: () => {
            return {
                url: `${PREFIX}/kpi-data/count`,
            }
        },
        providesTags: ['KpiReportDocument'],
    }),
    getKpiTargets: builder.query<any, any>({
        query: (id) => {
            return {
                url: `${PREFIX}/member/${id}/targets`,
            }
        },
        providesTags: ['KpiReportDocument', 'KpiProgress'],
    }),
    getKpiReportFeedback: builder.query<any, any>({
        query: (id) => {
            return {
                url: `${PREFIX}/kpi-report/${id}/comments`,
            }
        },
        providesTags: ['KpiReportDocument'],
    }),

    // kpi-data/count

    // ----------------- Mutation ---------------------- //
    addFeedbackOnKpiReport: builder.mutation<any, any>({
        query: ({ id, body }) => {
            return {
                url: `${PREFIX}/kpi-report/${id}/comment/add`,
                method: 'POST',
                body,
            }
        },
        invalidatesTags: ['KpiReportDocument'],
    }),
    updateKpiTargetLimit: builder.mutation<any, any>({
        query: ({ id, body }) => {
            return {
                url: `${PREFIX}/target/${id}/update`,
                method: 'PATCH',
                body,
            }
        },
        invalidatesTags: ['KpiReportDocument'],
    }),
    deleteKpiReport: builder.mutation<any, any>({
        query: (id) => {
            return {
                url: `${PREFIX}/kpi-report/${id}/delete`,
                method: 'DELETE',
                // body,
            }
        },
        invalidatesTags: ['KpiReportDocument'],
    }),
    deleteBulkKpiReport: builder.mutation<any, any>({
        query: (body) => {
            return {
                url: `${PREFIX}/kpi-reports/delete-all`,
                method: 'DELETE',
                body,
            }
        },
        invalidatesTags: ['KpiReportDocument'],
    }),
    deleteTeam: builder.mutation<any, any>({
        query: (id) => {
            return {
                url: `${PREFIX}/team/${id}/delete`,
                method: 'DELETE',
                // body,
            }
        },
        invalidatesTags: ['RemoveTeam', 'TeamManagement'],
    }),
    deleteBulkTeams: builder.mutation<any, any>({
        query: (body) => {
            return {
                url: `${PREFIX}/teams/delete-all`,
                method: 'DELETE',
                body,
            }
        },
        invalidatesTags: ['KpiReportDocument'],
    }),
    createKpiTargetLimit: builder.mutation<any, any>({
        query: (body) => {
            return {
                url: `${PREFIX}/target/create`,
                method: 'POST',
                body,
            }
        },
        invalidatesTags: ['KpiReportDocument'],
    }),
})
