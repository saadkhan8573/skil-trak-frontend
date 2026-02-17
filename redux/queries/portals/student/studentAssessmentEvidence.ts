import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { AssessmentEvidenceResponse } from '@types'

const PREFIX = 'students'
export const studentAssessmentEvidenceEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getAssessmentsCourses: builder.query<any[], void>({
        query: () => `${PREFIX}/courses/view`,
        providesTags: ['StudentAssessmentEvidence'],
    }),
    getAssessmentsFolders: builder.query<any, { id: number; indId?: string }>({
        query: ({ id, indId }) => ({
            url: `${PREFIX}/assessmentevidence/view/${id}`,
            params: { indId },
        }),
        providesTags: ['StudentAssessmentEvidence'],
    }),
    getAssessmentsFolderDetail: builder.query<any, string | null>({
        query: (id: string | null) => `${PREFIX}/folder/view/${id}`,
        providesTags: ['StudentAssessmentEvidence'],
    }),
    getOtherDocAssessmentResponseForStudent: builder.query<
        AssessmentEvidenceResponse & { studentId: number },
        { selectedFolder: number }
    >({
        query: ({ selectedFolder }) =>
            `industry-checks/student/other-document/${selectedFolder}/response/list-all`,
        providesTags: ['AssessmentEvidence', 'Agreement', 'SubAdminWorkplace'],
    }),
    // uploadFolderDocs: builder.mutation({
    //     query: ({ id, body }) => ({
    //         url: `${PREFIX}/assessment-evidence/response`,
    //         method: 'POST',
    //         params: id ? { id: id } : undefined,
    //         body,
    //     }),
    //     invalidatesTags: ['StudentAssessmentEvidence'],
    // }),

    uploadFolderDocs: builder.mutation({
        query: ({ id, body }) => ({
            url: `${PREFIX}/assessment-evidence/response/${id}`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['StudentAssessmentEvidence'],
    }),
    archiveAssessmentFiles: builder.mutation<any, string | null>({
        query: (id: string | null) => ({
            url: `${PREFIX}/assessment-evidence/file/archive/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['StudentAssessmentEvidence'],
    }),
    submitStudentAssessment: builder.mutation({
        query: ({ body, id, student }) => ({
            url: `${PREFIX}/assessment-evidence/submit/${id}`,
            params: { student },
            method: 'POST',
            body,
        }),
        invalidatesTags: [
            'StudentAssessmentEvidence',
            'AssessmentEvidence',
            'SubAdminStudents',
        ],
    }),
})
