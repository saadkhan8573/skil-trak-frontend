import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

import {
    Course,
    Student,
    UserCount,
    UserStatus,
    Appointment,
    PaginationValues,
    PaginatedResponse,
    PaginationWithSearch,
} from '@types'

const PREFIX = 'admin/'
export const studentEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    studentCount: builder.query<UserCount, void>({
        query: () => `${PREFIX}students/list/count`,
        providesTags: [
            'Students',
            'SubAdminWorkplace',
            'SubAdminStudents',
            'BulkUsersDelete',
            'BulkStatus',
        ],
    }),
    students: builder.query<PaginatedResponse<Student>, PaginationWithSearch>({
        query: (params) => ({
            url: `${PREFIX}students/list`,
            params,
        }),
        providesTags: [
            'Students',
            'SubAdminStudents',
            'Notes',
            'AllCommunications',
            'SubAdminWorkplace',
            'BulkUsersDelete',
            'BulkStatus',
        ],
    }),
    getSnoozedStudents: builder.query<
        PaginatedResponse<Student>,
        PaginationValues
    >({
        query: (params) => ({
            url: `${PREFIX}snoozed/students/list`,
            params,
        }),
        providesTags: ['Students'],
    }),
    getFlaggedStudents: builder.query<
        PaginatedResponse<Student>,
        PaginationValues
    >({
        query: (params) => ({
            url: `${PREFIX}students/reported/list`,
            params,
        }),
        providesTags: [
            'Students',
            'SubAdminStudents',
            'Notes',
            'AllCommunications',
            'SubAdminWorkplace',
            'BulkUsersDelete',
            'BulkStatus',
        ],
    }),

    completedStudents: builder.query<
        PaginatedResponse<Student>,
        PaginationValues
    >({
        query: (params) => ({
            url: `${PREFIX}completed-students/list`,
            params,
        }),
        providesTags: ['Students', 'SubAdminStudents'],
    }),

    getUnassignedStudents: builder.query<
        PaginatedResponse<Student>,
        PaginationValues
    >({
        query: (params) => ({
            url: `${PREFIX}students/list/un-assigned`,
            params,
        }),
        providesTags: ['Students', 'SubAdminStudents'],
    }),

    filteredStudents: builder.query<
        PaginatedResponse<Student>,
        PaginationWithSearch
    >({
        query: (params) => {
            return {
                url: `${PREFIX}students/filter`,
                params,
            }
        },
        providesTags: [
            'Students',
            'SubAdminStudents',
            'Notes',
            'AllCommunications',
            'SubAdminWorkplace',
        ],
    }),

    studentProfile: builder.query<Student, number>({
        query: (id) => `${PREFIX}students/view/${id}`,
        providesTags: ['Students', 'Notes', 'AllCommunications'],
    }),

    studentSectors: builder.query<Course[], number>({
        query: (id) => `${PREFIX}student/course/${id}`,
        providesTags: ['Students'],
    }),
    studentRemove: builder.mutation<Student, number>({
        query: (id) => ({
            url: `${PREFIX}student/remove/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Students'],
    }),

    studentAssignCourses: builder.mutation<
        Student,
        {
            user: number
            courses: number[]
        }
    >({
        query: (body) => ({
            url: `${PREFIX}student/course/assign`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Students', 'Rto-Students'],
    }),

    studentUnassignCourses: builder.mutation<
        Student,
        { id: number; courseId: number }
    >({
        query: (body) => ({
            url: `${PREFIX}student/course/delete/${body.courseId}`,
            params: { student: body.id },
            method: 'DELETE',
        }),
        invalidatesTags: ['Students', 'Rto-Students'],
    }),

    studentStatusChange: builder.mutation<
        Student,
        { id: number; status: UserStatus }
    >({
        query: ({ id, status }) => {
            return {
                url: `${PREFIX}students/status`,
                method: 'PATCH',
                params: { id },
                body: { status },
            }
        },
        invalidatesTags: ['Students'],
    }),

    studentUpdate: builder.mutation<Student, { id: number; body: Student }>({
        query: ({ id, body }) => ({
            url: `${PREFIX}students/update/${id}`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['Students'],
    }),

    studentsRequiredDocsDetail: builder.query<
        any,
        { id: number; docType: string }
    >({
        query: ({ id, docType }) => ({
            url: `${PREFIX}student/required-docs/response/${id}`,
            params: { key: docType },
        }),
        providesTags: ['Students'],
    }),
    studentCourseDetail: builder.query<
        Course,
        { id: number; studentId: number }
    >({
        query: ({ id, studentId }) =>
            `${PREFIX}student/course/docs/${studentId}/${id}`,

        providesTags: ['Students'],
    }),
    studentUpcomingAppointments: builder.query<Appointment[], number>({
        query: (id) => `${PREFIX}appointments/view/${id}`,

        providesTags: ['Students'],
    }),

    // stripe/student/id/payment/list/view
    // studentPaymentDetails
    studentPaymentDetails: builder.query<any, any>({
        query: (id) => `stripe/student/${id}/payment/list-view`,
        providesTags: ['Students'],
    }),
})
