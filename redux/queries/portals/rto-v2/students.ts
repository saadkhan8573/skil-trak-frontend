import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { PaginationWithSearch } from '@types'
import { IWorkplaceIndustries } from '@redux/queryTypes'

const PREFIX = 'rtos/'
export const studentsEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    rtoStudentHistory: builder.query<any, PaginationWithSearch>({
        query: (params) => ({
            url: `${PREFIX}students/history/list`,
            params,
        }),
        providesTags: ['RTO'],
    }),

    importStudents: builder.mutation<any, PaginationWithSearch>({
        query: (body) => ({
            url: `${PREFIX}students/import/v2`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RTO'],
    }),

    addSingleStudentWithPlacementType: builder.mutation<
        any,
        PaginationWithSearch
    >({
        query: (body) => ({
            url: `${PREFIX}student/add/v2`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RTO'],
    }),

    getWpForAutoMatching: builder.query<
        IWorkplaceIndustries[],
        { userId?: number } | void
    >({
        query: (params) => ({
            url: `${PREFIX}workplace-request/pending/list`,
            params: params || {},
        }),
        providesTags: ['RTO'],
    }),

    runAutomationForAvailabeleStudents: builder.mutation<any, { id: number }>({
        query: (body) => ({
            url: `students/workplace-requests/pending-workplace-request/process`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RTO-WORKPLACE'],
    }),

    getStudentTicketsCount: builder.query<
        {
            all: number
            open: number
            reopened: number
            closed: number
        },
        number
    >({
        query: (studentId) => `students/${studentId}/tickets-count`,
        providesTags: ['RTO'],
    }),

    getStudentAppointmentsCount: builder.query<
        {
            completed: number
            future: number
            total: number
            week: number
        },
        number
    >({
        query: (studentId) => `students/${studentId}/appointments-count`,
        providesTags: ['RTO'],
    }),

    studentInfoMessage: builder.mutation<any, any>({
        query: (body) => ({
            url: `admin/student-message/create`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RTO'],
    }),

    getStudentInfoMessages: builder.query<any, { userId: number }>({
        query: (params) => ({
            url: `students/message/by-admin`,
            params,
        }),
        providesTags: ['RTO'],
    }),

    // subadmin/appointment/book/externaly
    bookAppointmentExternally: builder.mutation<any, any>({
        query: (body) => ({
            url: `subadmin/appointment/book-externaly`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RTO', 'RTOIndustries', 'StudentsWorkplace'],
    }),

    getStudentRejectedIndustries: builder.query<any, number>({
        query: (studentId) => `students/${studentId}/rejected-industries/list`,
        providesTags: ['RTO'],
    }),
    getStudentAppointmentDetail: builder.query<any, { userId?: number } | void>({
        query: (params) => ({
            url: `students/workplace-requests/past-appointment/get`,
            params: params || {},
        }),
        providesTags: ['RTO'],
    }),
})
