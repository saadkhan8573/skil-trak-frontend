import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import {
    CoordinatorActiveStudentReport,
    CoordinatorAppointmentReport,
    CoordinatorAssignedReport,
    CoordinatorStudentCallsReport,
    CoordinatorStudentHaveWorkplaceReport,
    PaginatedResponse,
    PaginationValues,
} from '@types'

const PREFIX = 'statistics/sub-admin'

interface ReportType extends PaginationValues {
    userId?: number
}

interface ReportTypeWithRange extends ReportType {
    startDate: string
    endDate: string
}

export const subAdminReports = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getAssignedStudentsReport: builder.query<
        PaginatedResponse<CoordinatorAssignedReport>,
        ReportTypeWithRange | undefined
    >({
        query: (params) => ({
            url: `${PREFIX}/students/assigned`,
            params,
        }),
        providesTags: ['SubAdminReports'],
    }),
    getAssignedWorkplaceReport: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/workplace/assigned`,
            params,
        }),
        providesTags: ['SubAdminReports'],
    }),
    getActiveStudentsReport: builder.query<
        PaginatedResponse<CoordinatorActiveStudentReport>,
        ReportType
    >({
        query: (params) => ({
            url: `${PREFIX}/students/active`,
            params,
        }),
        providesTags: ['SubAdminReports'],
    }),
    getSubAdminArchivedStudentsReport: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/students/archive`,
            params,
        }),
        providesTags: ['SubAdminReports'],
    }),
    getStudentsCallsReport: builder.query<
        PaginatedResponse<CoordinatorStudentCallsReport>,
        ReportTypeWithRange | undefined
    >({
        query: (params) => ({
            url: `${PREFIX}/students/called`,
            params,
        }),
        providesTags: ['SubAdminReports'],
    }),
    getBookAppointmentsReport: builder.query<
        PaginatedResponse<CoordinatorAppointmentReport>,
        ReportTypeWithRange | {}
    >({
        query: (params) => ({
            url: `${PREFIX}/appointments/booked`,
            params,
        }),
        providesTags: ['SubAdminReports'],
    }),
    getSubAdminTerminatedWorkplaceReport: builder.query<
        PaginatedResponse<any>,
        ReportTypeWithRange | undefined
    >({
        query: (params) => ({
            url: `${PREFIX}/workplace-requests/terminated`,
            params,
        }),
        providesTags: ['SubAdminReports'],
    }),
    getSubAdminCompletedWorkplaceReport: builder.query<
        PaginatedResponse<any>,
        ReportTypeWithRange | undefined
    >({
        query: (params) => ({
            url: `${PREFIX}/workplace-requests/completed`,
            params,
        }),
        providesTags: ['SubAdminReports'],
    }),
    getSubAdminCancelledWorkplaceReport: builder.query<
        PaginatedResponse<any>,
        ReportTypeWithRange | undefined
    >({
        query: (params) => ({
            url: `${PREFIX}/workplace-requests/cancelled`,
            params,
        }),
        providesTags: ['SubAdminReports'],
    }),
    getStudentWorkplaceStartedReport: builder.query<
        PaginatedResponse<any>,
        ReportTypeWithRange | undefined
    >({
        query: (params) => ({
            url: `${PREFIX}/workplace-requests/started`,
            params,
        }),
        providesTags: ['SubAdminReports'],
    }),
    getStudentWithNoWorkplaceReport: builder.query<
        PaginatedResponse<any>,
        ReportType
    >({
        query: (params) => ({
            url: `${PREFIX}/students/no-workplace-requests`,
            params,
        }),
        providesTags: ['SubAdminReports'],
    }),
    getSubAdminReportDownloadLink: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/summary/generate/${params?.userId}`,
            params,
        }),
        providesTags: ['SubAdminReports'],
    }),
    getStudentProvidedWorkplaceReport: builder.query<
        PaginatedResponse<CoordinatorStudentHaveWorkplaceReport>,
        ReportTypeWithRange | undefined
    >({
        query: (params) => ({
            url: `${PREFIX}/student-provided/workplace-requests`,
            params,
        }),
        providesTags: ['SubAdminReports'],
    }),
})
