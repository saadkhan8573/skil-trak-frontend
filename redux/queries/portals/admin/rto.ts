import { UserRoles } from '@constants'
import { ReportingType } from '@partials/admin/rto/enum'
import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

import {
    AssessmentToolsType,
    Course,
    ImportStudentFormType,
    PaginatedResponse,
    PaginationValues,
    PaginationWithSearch,
    RTOSubAdmin,
    Rto,
    RtoStatsCount,
    Student,
    StudentFormQueryType,
    UserCount,
    UserStatus,
} from '@types'

const PREFIX = 'admin'
export const rtoEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    rtoCount: builder.query<UserCount, void>({
        query: () => `${PREFIX}/rtos/count`,
        providesTags: ['RTOS'],
    }),

    rtoStatisticsCount: builder.query<RtoStatsCount, number>({
        query: (id) => `${PREFIX}/rto/dashboard/count/${id}`,
        providesTags: ['RTOS'],
    }),

    rtos: builder.query<PaginatedResponse<Rto>, PaginationWithSearch>({
        query: (params) => ({
            url: `${PREFIX}/rtos/list`,
            params,
        }),
        providesTags: ['RTOS'],
    }),

    rtoStudentsLogsList: builder.query<
        PaginatedResponse<Student>,
        PaginationValues & {
            id: number
        }
    >({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/rto/${id}/students/list-all`,
            params,
        }),
        providesTags: ['RTOS', 'Avatar', 'Profile'],
    }),

    allowUpdation: builder.mutation<Rto, number>({
        query: (id) => ({
            url: `${PREFIX}/rto/allow-update/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['RTOS'],
    }),

    rtosApproved: builder.query<Rto[], void>({
        query: () => {
            return {
                url: `${PREFIX}/rtos/all`,
            }
        },
        providesTags: ['RTOS'],
    }),

    rtoDetail: builder.query<Rto, number>({
        query: (id: number) => `${PREFIX}/rtos/view/${id}`,
        providesTags: ['RTOS', 'Avatar', 'Profile', 'RTOCourses', 'RTO'],
    }),

    rtoAssessmentTools: builder.query<
        AssessmentToolsType[],
        { rto: number; course: number; status: string }
    >({
        query: ({ rto, course, status }) => ({
            url: `${PREFIX}/assessment-tool/${course}/${rto}`,
            params: { status },
        }),
        providesTags: ['RTOS'],
    }),

    rtoRemove: builder.mutation<Rto, number>({
        query: (id) => ({
            // url: `${PREFIX}/rto/remove/${id}`,
            url: `${PREFIX}/user/remove/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['RTOS'],
    }),

    // RTO Portal
    rtoProfileDetail: builder.query<Rto, void>({
        query: () => `rtos/profile/view`,
        providesTags: ['RTOS'],
    }),

    rtoStatusChange: builder.mutation<Rto, { id: number; status: UserStatus }>({
        query: ({ id, status }) => {
            return {
                url: `${PREFIX}/rtos/status`,
                method: 'PATCH',
                params: { id },
                body: { status },
            }
        },
        invalidatesTags: ['RTOS'],
    }),
    rtoCreateAssessmentTools: builder.mutation<
        AssessmentToolsType,
        { body: FormData; id: number }
    >({
        query: ({ body, id }) => ({
            url: `${PREFIX}/rto/assessment-tool/create/${id}`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RTOS'],
    }),
    rtoUpdateAssessmentTools: builder.mutation<
        AssessmentToolsType,
        { body: FormData; assessment: number }
    >({
        query: ({ body, assessment }) => ({
            url: `${PREFIX}/rto/assessment-tool/update/${assessment}`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['RTOS'],
    }),
    rtoRemoveAssessmentTools: builder.mutation<AssessmentToolsType, number>({
        query: (id) => ({
            url: `${PREFIX}/rto/assessment-tool/remove/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['RTOS'],
    }),
    rtoAssessmentToolArchive: builder.mutation<AssessmentToolsType[], number>({
        query: (id) => ({
            url: `${PREFIX}/rto/assessment-tool/archived/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['RTOS'],
    }),

    rtoSectors: builder.query<Course[], number>({
        query: (id) => `${PREFIX}/rtos/course/${id}`,
        providesTags: ['RTOS'],
    }),

    rtoAssignCourses: builder.mutation<
        Rto,
        { user: number; courses: number[]; rtoCourses: any }
    >({
        query: (body) => ({
            url: `${PREFIX}/rtos/course/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RTOS'],
    }),

    rtoUnassignCourse: builder.mutation<
        Rto,
        { rtoId: number; courseId: number }
    >({
        query: (body) => ({
            url: `${PREFIX}/rtos/course/delete/${body.courseId}`,
            params: { rto: body.rtoId },
            method: 'DELETE',
        }),
        invalidatesTags: ['RTOS'],
    }),

    rtoSubAdmins: builder.query<Rto, number>({
        query: (id) => `${PREFIX}/rto/subadmin/${id}`,
        providesTags: ['RTOS'],
    }),

    rtoProfileSubAdmins: builder.query<
        PaginatedResponse<RTOSubAdmin>,
        { skip?: number; limit?: number; id: number }
    >({
        query: (params) => ({
            url: `${PREFIX}/rto/subadmin/list/${params?.id}`,
            params,
        }),
        providesTags: ['RTOS'],
    }),

    rtoAssignSubAdmins: builder.mutation<
        null,
        { user: number; subAdmins: number[] }
    >({
        query: (body) => ({
            url: `${PREFIX}/rtos/subadmin/assign`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RTOS'],
    }),
    rtoImportStudents: builder.mutation<
        {
            created: Student[]
            ignored: string[]
        },
        { id: number; body: ImportStudentFormType }
    >({
        query: ({ id, body }) => ({
            url: `${PREFIX}/students/import/${id}`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RTOS'],
    }),
    rtoImportStudentExistingEmailCheck: builder.mutation<
        { emails: string }[],
        { emails: string[] }
    >({
        query: (body) => ({
            url: `${PREFIX}/students/existing-emails`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RTOS'],
    }),
    rtoAddStudent: builder.mutation<
        Student,
        {
            id: number
            body: StudentFormQueryType
        }
    >({
        query: ({ id, body }) => ({
            url: `${PREFIX}/student/add/${id}`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RTOS'],
    }),
    checkStudentEmail: builder.mutation<any, { body: string[] }>({
        query: ({ body }) => ({
            url: `${PREFIX}/email/find`,
            method: 'POST',
            body: { emails: body },
        }),
        invalidatesTags: ['RTOS'],
    }),

    rtoUnassignSubAdmins: builder.mutation<
        { message: string },
        { rtoId: number; subAdmin: number }
    >({
        query: (body) => ({
            url: `${PREFIX}/rto/subadmin/remove/${body.rtoId}`,
            params: { subadmin: body.subAdmin },
            method: 'DELETE',
        }),
        invalidatesTags: ['RTOS'],
    }),

    rtoAutoComplete: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/rto/${id}/toggle/auto-complete`,
            method: 'PATCH',
        }),
        invalidatesTags: ['RTOS'],
    }),

    rtoAllowPermissions: builder.mutation<
        any,
        { id: number; allowAutoReport: boolean; reportType: ReportingType }
    >({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}/rto/${id}/auto-reporting/update`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['RTOS'],
    }),
    rtoAllowPartialSubmission: builder.mutation<
        any,
        {
            id: number
            allowPartialSubmission: boolean
        }
    >({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}/rto/${id}/toggle/incomplete-submission`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['RTOS'],
    }),
    rtoWpApprovalRequest: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/rto/${id}/settings/workplace-approval/toggle`,
            method: 'PATCH',
        }),
        invalidatesTags: ['RTOS'],
    }),

    rtoCanViewPaymentStatusToggle: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/rto/${id}/toggle/can-view-payment-status`,
            method: 'PATCH',
        }),
        invalidatesTags: ['RTOS'],
    }),

    allowScheduleEmailToggle: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/rto/${id}/allow-schedule-email`,
            method: 'PATCH',
        }),
        invalidatesTags: ['RTOS'],
    }),

    studentAccountsExists: builder.query<Rto, number>({
        query: (id: number) => `${PREFIX}/rtos/view/${id}`,
        providesTags: ['STUDENT EMAILS'],
    }),

    rtoObserverList: builder.query<
        PaginatedResponse<any>,
        PaginationWithSearch
    >({
        query: () => `${PREFIX}/rto-observer/list`,
        providesTags: ['RTOS'],
    }),

    autoReleaseLogbook: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/rto/${id}/auto-release-logbook`,
            method: 'PATCH',
        }),
        invalidatesTags: ['RTOS'],
    }),

    addRtoObserver: builder.mutation<
        any,
        {
            password: string
            role: UserRoles
            name: string
            email: string
            phone: string
        }
    >({
        query: (body) => ({
            url: `${PREFIX}/rto-observer/create`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RTOS'],
    }),

    updateRtoObserver: builder.mutation<
        any,
        {
            id: number
            name: string
            email: string
            phone: string
        }
    >({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}/rto-observer/update/${id}`,
            body,
            method: 'PATCH',
        }),
        invalidatesTags: ['RTOS'],
    }),

    removeRtoObserver: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/rto-observer/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['RTOS'],
    }),

    allowInvoicingPermission: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/rto/${id}/allow-invoicing`,
            method: 'PATCH',
        }),
        invalidatesTags: ['RTOS'],
    }),
    allowSelfPayment: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/rto/${id}/student-self-paymanet/toggle`,
            method: 'PATCH',
        }),
        invalidatesTags: ['RTOS'],
    }),

    toggleEsignPopulation: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/rto/${id}/toggle/auto-esign`,
            method: 'PATCH',
        }),
        invalidatesTags: ['RTOS'],
    }),

    canStudentAddOwnWorkplace: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/rto/${id}/can-add-own-workplace`,
            method: 'PATCH',
        }),
        invalidatesTags: ['RTOS'],
    }),

    canStudentAddNeedWorkplace: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/rto/${id}/can-add-need-workplace`,
            method: 'PATCH',
        }),
        invalidatesTags: ['RTOS'],
    }),
    rtoCanViewNewDashboard: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/rto/${id}/can-access-portal`,
            method: 'PATCH',
        }),
        invalidatesTags: ['RTOS'],
    }),
})
