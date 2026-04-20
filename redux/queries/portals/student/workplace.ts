import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { workplaceQuestionsKeys } from '@partials/common/workplace/enum'

const PREFIX = 'students'
export const workplaceEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    workPlaceRequest: builder.mutation({
        query: (body) => ({
            url: `${PREFIX}/workplace-requests`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Workplace'],
    }),
    getWorkplaceIndustries: builder.query<any, number | void>({
        query: (userId) => ({
            url: `${PREFIX}/workindustry/list`,
            params: userId ? { userId } : undefined,
        }),
        providesTags: ['Workplace', 'SubAdmin-Students'],
    }),

    getPlacementProgress: builder.query<any, void>({
        query: () => `${PREFIX}/work-place-request/view`,
        providesTags: ['Workplace'],
    }),
    getCourseDocuments: builder.query<any, any>({
        query: ({ id, course }) => {
            return {
                url: `${PREFIX}/requireddocs/${id}`,
                params: { course },
            }
        },
        providesTags: ['Workplace'],
    }),
    getIndustryFolders: builder.query<any, any>({
        query: (params) => {
            return {
                url: `/industries/document/required-by-industry/list`,
                params,
            }
        },
        providesTags: ['Workplace'],
    }),
    getStudentIndustries: builder.query<any, void>({
        query: () => `${PREFIX}/industries/list`,
        providesTags: ['Workplace'],
    }),

    uploadDocuments: builder.mutation({
        query: ({ id, body, workplaceId }) => {
            return {
                url: `${PREFIX}/workplace/response`,
                method: 'POST',
                params: { docs: [id], wpId: workplaceId },
                body,
            }
        },
        invalidatesTags: ['Workplace'],
    }),
    cancelWorkplaceRequest: builder.mutation<any, void>({
        query: () => ({
            url: `${PREFIX}/workplace/cancel`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Workplace'],
    }),
    applyForWorkplace: builder.mutation({
        query: (id) => ({
            url: `${PREFIX}/workplace/apply/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Workplace'],
    }),
    applyWorkplaceWithAbnIndustry: builder.mutation<
        any,
        {
            IndustryId: number
            courseId: number
            document: number
            location?: number
            answer: string
        }
    >({
        query: ({ IndustryId, ...params }) => ({
            url: `${PREFIX}/add/work-place/existing-industry/${IndustryId}`,
            params,
            method: 'POST',
        }),
        invalidatesTags: ['Workplace-Apply'],
    }),
    uploadAgreement: builder.mutation({
        query: ({ appliedIndustryId, course, body }) => ({
            url: `${PREFIX}/sign/agreement/${appliedIndustryId}`,
            method: 'POST',
            params: { course },
            body,
        }),
        invalidatesTags: ['Workplace'],
    }),
    updateFindAbn: builder.mutation({
        query: (body: any) => ({
            url: `${PREFIX}/industry/find-abn`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Workplace'],
    }),
    addWorkplace: builder.mutation<any, any>({
        query: ({ document, ...body }) => ({
            url: `${PREFIX}/add/work-place`,
            method: 'POST',
            params: { document },
            body,
        }),
        invalidatesTags: ['Workplace-Apply'],
    }),

    getWorkplaceApprovalRequest: builder.query<any, void>({
        query: () => `${PREFIX}/workplace/approval-request/get`,
        providesTags: ['Workplace'],
    }),
    getWpApprovalRequestIndustryChecks: builder.query<any, any>({
        query: (id) => ({
            url: `${PREFIX}/approval/${id}/industry-checks/get`,
        }),
        providesTags: [
            'Workplace',
            'StudentAssessmentEvidence',
            'AssessmentEvidence',
            'SubAdminStudents',
        ],
    }),

    changeStatusWpApprrovalReq: builder.query<
        any,
        { id: number; status: string; date: string }
    >({
        query: ({ id, ...params }) => ({
            url: `subadmin/workplace/approval-request/${id}/update-status`,
            params,
        }),
        providesTags: ['Workplace'],
    }),

    uploadWPContract: builder.mutation({
        query: (body: any) => ({
            url: `employment-documents`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Workplace-Apply'],
    }),
    getWPContract: builder.query<any, void>({
        query: () => 'employment-documents',
        providesTags: ['Workplace'],
    }),
    rejectIndustryFromEmail: builder.mutation<
        any,
        { id: number; body: any; status: string }
    >({
        query: ({ id, body, ...params }) => ({
            url: `subadmin/workplace/approval-request/${id}/update-status`,
            params,
            body,
            method: 'POST',
        }),
        invalidatesTags: ['Students'],
    }),

    getWpIndustryChecks: builder.query<any, void>({
        query: () => `${PREFIX}/assessment-evidence/view/by-student`,
        providesTags: ['StudentAssessmentEvidence', 'AssessmentEvidence'],
    }),
    // workplace/approval-request/:id/complete
    completeWorkplaceApprovalRequest: builder.mutation<any, any>({
        query: (id) => ({
            url: `${PREFIX}/workplace/approval-request/${id}/complete`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Workplace'],
    }),
    getStudentWorkplaceQuestions: builder.query<
        {
            questions: {
                id: number
                isActive: boolean
                createdAt: string
                updatedAt: string
                question: string
                answer: string
                type: workplaceQuestionsKeys
            }[]
        },
        { userId?: number } | void
    >({
        query: (params) => ({
            url: `students/workplace-requests/autofill/questionaire`,
            params: params || {},
        }),
        providesTags: ['Workplace'],
    }),
    updateStudentWorkplaceQuestion: builder.mutation<
        any,
        {
            qId: number | string
            answer: string
            stdId?: number | string
            wpId?: number | string
        }
    >({
        query: ({ qId, stdId, wpId, ...body }) => ({
            url: `students/workplace-requests/question/${qId}`,
            method: 'PATCH',
            params: { stdId, wpId },
            body,
        }),
        invalidatesTags: ['Workplace', 'SubAdminWorkplace'],
    }),
})
