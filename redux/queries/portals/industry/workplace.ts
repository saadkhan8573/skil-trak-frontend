import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { PaginationValues } from '@types'

const PREFIX = 'industries'
export const workplaceEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getIndustryPendingWorkplace: builder.query<any, PaginationValues>({
        query: (params) => ({
            url: `${PREFIX}/workplace-request/pending/list`,
            params,
        }),
        providesTags: ['IndustryWorkplace'],
    }),
    getIndustryWorkplace: builder.query<any, PaginationValues>({
        query: (params) => ({
            url: `${PREFIX}/workplace-request/approved/list`,
            params,
        }),
        providesTags: ['IndustryWorkplace'],
    }),
    getIndustryWorkplaceDetail: builder.query<any, number>({
        query: (id) => `${PREFIX}/workplace-request/view/${id}`,
        providesTags: ['IndustryWorkplace'],
    }),

    getAssessmentFolders: builder.query<
        any,
        { studentId: number; courseId: number }
    >({
        query: ({ studentId, courseId }) =>
            `${PREFIX}/assessment-evidence/view/${studentId}/${courseId}`,
        providesTags: ['IndustryWorkplace'],
    }),

    assessmentFolderResponse: builder.query<
        any,
        { selectedFolderId: number; studentId: number }
    >({
        query: ({ selectedFolderId, studentId }) =>
            `${PREFIX}/assessment-evidence/response/${selectedFolderId}/${studentId}`,
        providesTags: ['AssessmentEvidence'],
    }),

    getIndustryRequiredDocs: builder.query<any, { courseId: number }>({
        query: ({ courseId }) =>
            `${PREFIX}/student/required-document/${courseId}`,
        providesTags: ['IndustryWorkplace'],
    }),

    getIndustryStudentSchedule: builder.query<
        any,
        { studentUserId: number; courseId: number; workplace: number }
    >({
        query: ({ studentUserId, courseId, workplace }) => ({
            url: `${PREFIX}/student/schedule/view/${studentUserId}`,
            params: { course: courseId, workplace },
        }),
        providesTags: ['IndustryWorkplace', 'StudentSchedule'],
    }),

    createScheduleForStudent: builder.mutation({
        query: (body) => ({
            url: `${PREFIX}/schedule/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['IndustryWorkplace'],
    }),

    updateScheduleForStudent: builder.mutation({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}/schedule/edit/${id}`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['IndustryWorkplace'],
    }),

    getIndustryRequiredDocsResponse: builder.query<
        any,
        { selectedFolderId: number; studentId: number }
    >({
        query: ({ selectedFolderId, studentId }) =>
            `${PREFIX}/student/document-response/${selectedFolderId}/${studentId}`,
        providesTags: ['IndustryWorkplace'],
    }),

    getIndustryWorkplaceFolders: builder.query<any, any>({
        query: ({ workplaceId, appliedIndustryId, courseId }) =>
            `${PREFIX}/workplace-request/docs/${workplaceId}/${appliedIndustryId}/${courseId}`,
        providesTags: ['IndustryWorkplace'],
    }),
    addNoteByIndustry: builder.mutation({
        query: (body) => ({
            url: `${PREFIX}/workplace-request/note/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['IndustryWorkplace'],
    }),
    workplaceActions: builder.mutation<any, any>({
        query: ({ id, status }) => ({
            url: `${PREFIX}/workplace-request/action/${id}`,
            method: 'PATCH',
            body: { status },
        }),
        invalidatesTags: ['IndustryWorkplace'],
    }),
    addFeedback: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/workplace-request/feedback/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['IndustryWorkplace'],
    }),
    addReport: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/workplace-request/report/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['IndustryWorkplace'],
    }),
    signAgreement: builder.mutation({
        query: (id) => ({
            url: `${PREFIX}/workplace-request/sign-agreement/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['IndustryWorkplace'],
    }),
    startPlacementByIndustry: builder.mutation({
        query: (id) => ({
            url: `${PREFIX}/workplace-started/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['IndustryWorkplace'],
    }),
    completeWorkplace: builder.mutation({
        query: (id) => ({
            url: `${PREFIX}/workplace-request/complete/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['IndustryWorkplace'],
    }),
    terminateWorkplace: builder.mutation({
        query: (id) => ({
            url: `${PREFIX}/workplace-request/terminate/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['IndustryWorkplace'],
    }),
    cancelWorkplace: builder.mutation({
        query: (id) => ({
            url: `${PREFIX}/workplace-request/cancel/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['IndustryWorkplace'],
    }),
})
