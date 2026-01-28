import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { CourseProgramData } from '@types'

const PREFIX = 'rtos/'
export const approvalRequestEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    approvalRequestDetail: builder.query<any, number>({
        query: (id) => `${PREFIX}workplace-approval/${id}/get-details`,
        providesTags: ['RTO'],
    }),

    approvalRequestSupervisors: builder.query<
        any,
        { industryId: number; courseId: number }
    >({
        query: ({ industryId, courseId }) =>
            `${PREFIX}industry/${industryId}/course/${courseId}/supervisors`,
        providesTags: ['RTO'],
    }),

    rtoApprovalRequestCourse: builder.query<
        any,
        { industryId: number; courseId: number }
    >({
        query: ({ industryId, courseId }) =>
            `${PREFIX}industry/${industryId}/course/${courseId}/requirements`,
        providesTags: ['RTO'],
    }),

    approvalRequestHighlightedTasks: builder.query<
        any,
        { courseId: number; userId: number }
    >({
        query: ({ courseId, ...params }) => ({
            url: `${PREFIX}course/${courseId}/tasks`,
            params,
        }),
        providesTags: ['RTO'],
    }),

    getWpPrograms: builder.query<
        CourseProgramData[],
        { industryId: number; courseId: number }
    >({
        query: ({ industryId, courseId }) =>
            `${PREFIX}industry/${industryId}/course/${courseId}/programs`,
        providesTags: ['RTO'],
    }),

    quickReviewRequest: builder.query<
        { supervisor: boolean; sectorCapacity: boolean; compliance: boolean },
        { industryId: number; courseId: number; userId: number }
    >({
        query: ({ industryId, courseId, ...params }) => ({
            url: `${PREFIX}industry/${industryId}/course/${courseId}/review`,
            params,
        }),

        providesTags: ['RTO'],
    }),

    getRtoCourseChecklist: builder.query<
        any,
        { courseId: number; studentId: number; industryUserId: number }
    >({
        query: ({ courseId, studentId, industryUserId }) =>
            `${PREFIX}course/${courseId}/student/${studentId}/industry/${industryUserId}/facility-checklist`,
        providesTags: ['RTO'],
    }),

    getSkiltrakCourseChecklist: builder.query<
        any,
        { industryUserId: number; courseId: number }
    >({
        query: ({ industryUserId, courseId }) =>
            `${PREFIX}industry/${industryUserId}/course/${courseId}/facility-checklist`,
        providesTags: ['RTO'],
    }),
})
