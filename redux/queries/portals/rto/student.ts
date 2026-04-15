import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { PaginatedResponse, PaginationValues, Student } from '@types'

const PREFIX = 'rtos'
const STATISTICS = 'statistics'
export const studentEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    studentsCount: builder.query<
        {
            active: number
            pending: number
            inProgress: number
            noWorkplace: number
            placementStarted: number
            scheduleCompleted: number
            completed: number
            blocked: number
            expired: number
            rejected?: number
            skiltrakFlagged?: number
            qualificationissued?: number
            activeNonContactable: number
            expiredNonContactable: number
        },
        void
    >({
        query: () => `${PREFIX}/all-students/count`,
        providesTags: ['Rto-Students'],
    }),
    studentsImport: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/students/import`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Rto-Students'],
    }),
    updateReportedStudentComment: builder.mutation<any, any>({
        query: ({ id, commentId, body }) => {
            return {
                url: `${PREFIX}/reported/student/${id}/comment/${commentId}/update`,
                method: 'PATCH',
                body,
            }
        },
        invalidatesTags: ['Rto-Students'],
    }),
    addStudent: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/student/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Rto-Students'],
    }),

    studentsImportedList: builder.query<any, any>({
        query: () => `${PREFIX}/students/imported-lists`,
        providesTags: ['Rto-Students'],
    }),
    getIncompleteSubmissionStudents: builder.query<any, any>({
        query: () => `${PREFIX}/students/incomplete-submission/list`,
        providesTags: ['Rto-Students'],
    }),
    sendVerificationCode: builder.mutation<any, { listing?: boolean }>({
        query: (params) => ({
            url: `shared/otp/add`,
            params,
            method: 'POST',
        }),
        invalidatesTags: ['Rto-Students'],
    }),
    compareVerificationCode: builder.mutation<any, { otp: string }>({
        query: (body) => ({
            url: `shared/otp/compare`,
            body,
            method: 'POST',
        }),
        invalidatesTags: ['Rto-Students'],
    }),

    getRtoStudents: builder.query<any, any>({
        query: (params) => {
            return {
                url: `${PREFIX}/students/list`,
                params,
            }
        },
        providesTags: ['Rto-Students'],
    }),
    getNonContactableStudentsList: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/non-contactable-students/list`,
            params,
        }),
        providesTags: ['Rto-Students'],
    }),
    getActiveStudentsList: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/active-students/list`,
            params,
        }),
        providesTags: ['Rto-Students'],
    }),
    getPendingStudentsList: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/pending-students/list`,
            params,
        }),
        providesTags: ['Rto-Students'],
    }),
    getInProgressStudentsList: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/in-progress-students/list`,
            params,
        }),
        providesTags: ['Rto-Students'],
    }),
    getSkiltrakFlaggedStudentsList: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/flag-students/list`,
            params,
        }),
        providesTags: ['Rto-Students'],
    }),
    getNoWorkplaceStudentsList: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/no-workplace-students/list`,
            params,
        }),
        providesTags: ['Rto-Students'],
    }),
    getPlacementStartedStudentsList: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/placement-started-students/list`,
            params,
        }),
        providesTags: ['Rto-Students'],
    }),
    getScheduleCompletedStudentsList: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/schedule-completed-students/list`,
            params,
        }),
        providesTags: ['Rto-Students'],
    }),
    getExpiredStudentsList: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/expired-students/list`,
            params,
        }),
        providesTags: ['Rto-Students'],
    }),
    getBlockedStudentsList: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/blocked-students/list`,
            params,
        }),
        providesTags: ['Rto-Students'],
    }),
    getQualificationIssuedStudentsList: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/qualification-issued-students/list`,
            params,
        }),
        providesTags: ['Rto-Students'],
    }),
    getRtoProblematicStudents: builder.query<any, any>({
        query: (params) => {
            return {
                url: `${PREFIX}/students/has-issues/list`,
                params,
            }
        },
        providesTags: ['Rto-Students'],
    }),
    getRtoReportedStudentsList: builder.query<any, any>({
        query: (params) => {
            return {
                url: `${PREFIX}/students/reported/list`,
                params,
            }
        },
        providesTags: ['Rto-Students'],
    }),
    assignRtoCoordinatorToStudents: builder.mutation<
        any,
        { subAdmin: number; studentId: number }
    >({
        query: ({ subAdmin, studentId }) => ({
            url: `${PREFIX}/coordinator/${subAdmin}/student/${studentId}/assign`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Rto-Students'],
    }),

    assignRtoCoordinatorToMultiStudents: builder.mutation<
        any,
        { subAdmin: number; body: { ids: number[] } }
    >({
        query: ({ subAdmin, body }) => ({
            url: `${PREFIX}/coordinator/${subAdmin}/students/assign`,
            body,
            method: 'PATCH',
        }),
        invalidatesTags: ['Rto-Students'],
    }),

    getRtoStudentsList: builder.query<any, void>({
        query: () => `${PREFIX}/students/names/list`,
        providesTags: ['Rto-Students'],
    }),
    rtoCompletedStudents: builder.query<
        PaginatedResponse<Student>,
        PaginationValues
    >({
        query: (params) => ({
            url: `${PREFIX}/completed-students/list`,
            params,
        }),
        providesTags: ['Students', 'SubAdminStudents'],
    }),
    getRtoStudentProfile: builder.query<any, any>({
        query: (id) => `${PREFIX}/student/profile/${id}`,
        providesTags: ['Rto-Students'],
    }),
    removeRTOStudent: builder.mutation<any, any | null>({
        query: (id) => {
            return {
                url: `${PREFIX}/student/remove/${id}`,
                method: 'DELETE',
            }
        },
        invalidatesTags: ['Rto-Students'],
    }),
    changeRTOStudentsStatus: builder.mutation<
        any,
        { id: number; status: string }
    >({
        query: ({ id, status }) => {
            return {
                url: `${PREFIX}/student-status/update/${id}`,
                method: 'PATCH',
                body: { status },
            }
        },
        invalidatesTags: ['Rto-Students'],
    }),
    getNotContactableStudents: builder.query<any, any>({
        query: (params) => {
            return {
                url: `statistics/rto/student/not-contactable`,
                params,
            }
        },
        providesTags: ['Rto-Students'],
    }),
    getBlockedStudentsReport: builder.query<any, any>({
        query: (params) => {
            return {
                url: `statistics/rto/students/blocked`,
                params,
            }
        },
        providesTags: ['Rto-Students'],
    }),
    getArchivedStudentsReport: builder.query<any, any>({
        query: (params) => ({
            url: `statistics/rto/students/archived`,
            params,
        }),
        providesTags: ['Rto-Students'],
    }),

    getNewStudentsReport: builder.query<any, any>({
        query: (params) => ({
            url: `statistics/rto/new-students`,
            params,
        }),
        providesTags: ['Rto-Students'],
    }),
    getCancelledWorkplaceReport: builder.query<any, any>({
        query: (params) => ({
            url: `statistics/rto/workplace-requests/cancelled`,
            params,
        }),
        providesTags: ['Rto-Students'],
    }),
    getCompletedWorkplaceReport: builder.query<any, any>({
        query: (params) => ({
            url: `statistics/rto/workplace-requests/completed`,
            params,
        }),
        providesTags: ['Rto-Students'],
    }),
    getPlacementStartedReport: builder.query<any, any>({
        query: (params) => ({
            url: `statistics/rto/placementStarted`,
            params,
        }),
        providesTags: ['Rto-Students'],
    }),
    getStudentsResultsReport: builder.query<any, any>({
        query: (params) => ({
            url: `statistics/rto/result`,
            params,
        }),
        providesTags: ['Rto-Students'],
    }),
    getTerminatedWorkplaceReport: builder.query<any, any>({
        query: (params) => ({
            url: `statistics/rto/workplace-requests/terminated`,
            params,
        }),
        providesTags: ['Rto-Students'],
    }),
    getWorkplaceRequestsReport: builder.query<any, any>({
        query: (params) => ({
            url: `statistics/rto/workplace-requests`,
            params,
        }),
        providesTags: ['Rto-Students'],
    }),
    getAppointmentsReport: builder.query<any, any>({
        query: (params) => ({
            url: `statistics/rto/appointments/list`,
            params,
        }),
        providesTags: ['Rto-Students'],
    }),
    getWithoutWorkplaceReport: builder.query<any, any>({
        query: (params) => ({
            url: `statistics/rto/students/list/with-out-workplace`,
            params,
        }),
        providesTags: ['Rto-Students'],
    }),
    getReportedStudentsReport: builder.query<any, any>({
        query: (params) => ({
            url: `statistics/rto/students/reported`,
            params,
        }),
        providesTags: ['Rto-Students'],
    }),
    getReportDownloadLink: builder.query<any, any>({
        query: ({ userId, ...params }) => ({
            url: `${STATISTICS}/rto/summary/generate/${userId}`,
            params,
        }),
        providesTags: ['Rto-Students'],
    }),
    getRtoMyReportDownload: builder.query<any, any>({
        query: ({ userId, ...params }) => ({
            url: `${STATISTICS}/rto/data/${userId}`,
            params,
        }),
        providesTags: ['Rto-Students'],
    }),
    getExportStudentList: builder.query<any, any>({
        query: ({ userId, ...params }) => ({
            url: `${PREFIX}/students-list/download/${userId}`,
            params,
        }),
        providesTags: ['Rto-Students'],
    }),

    // Resolve issues
    // rtos/reported-students/list?search=status:open
    getRtoResolveIssuesStudents: builder.query<any, any>({
        query: (params) => {
            return {
                url: `${PREFIX}/reported-students/list`,
                params,
            }
        },
        providesTags: ['Rto-Students'],
    }),
    rtoResolveIssue: builder.mutation<any, { id: number; note: string }>({
        query: ({ id, ...body }) => {
            return {
                url: `${PREFIX}/report/${id}/resolve`,
                method: 'PATCH',
                body,
            }
        },
        invalidatesTags: ['Rto-Students'],
    }),
    // counts
    getRtoResolveIssuesStudentsCount: builder.query<
        {
            totalResolved: number
            criticalResolved: number
            thisMonth: number
            openIssues: number
            criticalPriority: number
            highPriority: number
            studentsEffected: number
            openWithoutResolutionDate: number
            averageResolutionDays: number
        },
        void
    >({
        query: () => {
            return {
                url: `${PREFIX}/reported-students/count`,
            }
        },
        providesTags: ['Rto-Students'],
    }),
})
