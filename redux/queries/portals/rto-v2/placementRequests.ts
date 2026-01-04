import { BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

const PREFIX = 'rtos/'
export const placementRequestsEndPoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getStudentPlacementRequestList: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}placement-requests/list`,
            params,
        }),
        providesTags: ['RTO'],
    }),
    getStudentPlacementRequestStats: builder.query<any, void>({
        query: () => ({
            url: `${PREFIX}dashboard/placements/metrics`,
        }),
        providesTags: ['RTO'],
    }),

    aupdateRTOProfile: builder.mutation<any, any>({
        query: ({ id, body }) => ({
            url: 'rtos/profile/update',
            method: 'PATCH',
            params: { rto: id },
            body,
        }),
        invalidatesTags: ['RTO'],
    }),
    addManualNote: builder.mutation<any, any>({
        query: ({ id, body }) => ({
            url: `subadmin/workplace/${id}/custom/status-check-note/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RTO'],
    }),
    confirmHighlightedTask: builder.mutation<any, any>({
        query: (id) => ({
            url: `rtos/course-configuration-detail/${id}/confirm`,
            method: 'PATCH',
        }),
        invalidatesTags: ['RTO'],
    }),

    // Details
    // rtos/student/:id/placement-profile/view
    getStudentPlacementProfileDetails: builder.query<any, any>({
        query: (id) => ({
            url: `${PREFIX}placement-request/${id}/view`,
        }),
        providesTags: ['RTO', 'SubAdminStudents', 'SubAdminWorkplace'],
    }),
    //rtos/placement-request/:id/workplace-view
    getStudentPlacementIndustryDetails: builder.query<any, any>({
        query: (id) => ({
            url: `${PREFIX}placement-request/${id}/workplace-view`,
        }),
        providesTags: ['RTO', 'SubAdminStudents', 'SubAdminWorkplace'],
    }),
    //rtos/placement-request/:id/view-course
    getStudentPlacementCourse: builder.query<any, any>({
        query: (id) => ({
            url: `${PREFIX}placement-request/${id}/view-course`,
        }),
        providesTags: ['RTO'],
    }),
    // highlighted tasks
    getIndustryPlacementHighlightedTasks: builder.query<any, any>({
        query: (id) => ({
            url: `${PREFIX}placement-request/${id}/get-highlighted-tasks`,
        }),
        providesTags: ['RTO'],
    }),
    // rtos/student/id/detail-view
    getStudentPlacementDetails: builder.query<any, any>({
        query: (studentId) => ({
            url: `${PREFIX}student/${studentId}/detail-view`,
        }),
        providesTags: ['RTO'],
    }),
    // rtos/placement-request/:id/view-progress
    getStudentPlacementProgress: builder.query<any, any>({
        query: (id) => ({
            url: `${PREFIX}placement-request/${id}/view-progress`,
        }),
        providesTags: ['RTO'],
    }),
    // rtos/placement-request/:id/Complience-check
    getStudentPlacementCompliance: builder.query<any, any>({
        query: (id) => ({
            url: `${PREFIX}placement-request/${id}/compliance-check`,
        }),
        providesTags: ['RTO'],
    }),
    // placement-request/:id/get-course-programs
    getStudentPlacementCoursePrograms: builder.query<any, any>({
        query: (id) => ({
            url: `${PREFIX}placement-request/${id}/get-course-programs`,
        }),
        providesTags: ['RTO'],
    }),
    // rtos/placement-request/:id/get-status-check-notes
    getStudentPlacementStatusCheckNotes: builder.query<any, any>({
        query: (id) => ({
            url: `${PREFIX}placement-request/${id}/get-status-check-notes`,
        }),
        providesTags: ['RTO'],
    }),
})
