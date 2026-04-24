import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { AssessmentEvidenceFolder } from '@types'

const PREFIX = 'students/'
export const studentDocumentsEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getStudentDocumentsCount: builder.query<
        {
            approvedCourseDocuments: number
            approvedDocuments: number
            approvedIndustryCheck: number
            courseDocuments: number
            industryCheck: number
            pendingCourseDocuments: number
            pendingDocuments: number
            pendingIndustryCheck: number
        },
        { studentId: number; courseId: number }
    >({
        query: ({ studentId, courseId }) =>
            `${PREFIX}${studentId}/course/${courseId}/folders/count`,
        providesTags: ['RTO-Documents'],
    }),

    getStudentDocumentsList: builder.query<
        AssessmentEvidenceFolder[],
        {
            studentId: number
            courseId: number
            search?: string
            industryId?: number
        }
    >({
        query: ({ studentId, courseId, ...params }) => ({
            url: `${PREFIX}${studentId}/course/${courseId}/folders/list`,
            params,
        }),

        providesTags: ['RTO-Documents', 'AssessmentEvidence'],
    }),

    getStudentDocumentFiles: builder.query<any, number>({
        query: (studentResponseId) =>
            `${PREFIX}folder/${studentResponseId}/files/list`,
        providesTags: ['RTO-Documents', 'Logbook', 'AssessmentEvidence'],
    }),

    uploadStudentDocumentFile: builder.mutation<
        any,
        { stdId: number; folderId: number; responseId: number; body: FormData }
    >({
        query: ({ stdId, folderId, responseId, body }) => ({
            url: `${PREFIX}${stdId}/folder/${folderId}/response/add`,
            method: 'POST',
            params: { responseId },
            body,
        }),
        invalidatesTags: ['RTO-Documents'],
    }),

    fileStatusChange: builder.mutation<
        any,
        { stdId: number; responseId: number; status: string; comment: string }
    >({
        query: ({ stdId, responseId, ...params }) => ({
            url: `${PREFIX}${stdId}/response/${responseId}/update-status`,
            method: 'PATCH',
            params,
        }),
        invalidatesTags: ['RTO-Documents'],
    }),

    allFilesStatusChange: builder.mutation<
        any,
        { folderId: number; status: string; comment: string }
    >({
        query: ({ folderId, ...params }) => ({
            url: `${PREFIX}folder/${folderId}/update-status`,
            method: 'PATCH',
            params,
        }),
        invalidatesTags: ['RTO-Documents'],
    }),
    // :stdId/course/:cId/mail-send
    sendEmailOnIndustryChecks: builder.mutation<
        any,
        { stdId: number; cId: number }
    >({
        query: ({ stdId, cId }) => ({
            url: `${PREFIX}${stdId}/course/${cId}/mail-send`,
            method: 'POST',
        }),
        invalidatesTags: ['RTO-Documents'],
    }),
})
