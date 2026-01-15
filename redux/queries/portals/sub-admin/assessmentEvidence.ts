import { BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import {
    AddCommentEnum,
    AgreementFileType,
    ArchiveAssessmentType,
    AssessmentAddCommentType,
    AssessmentCourseType,
    AssessmentEvidenceDetailType,
    AssessmentEvidenceResponse,
    AssessmentEvidenceType,
    AssessmentFinalCommentFormType,
    AssessmentSubmissionsCount,
    FileType,
    PaginatedResponse,
    PaginationWithSearch,
} from '@types'

const PREFIX = 'subadmin'
export const assessmentEvidenceEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    assessmentCount: builder.query<AssessmentSubmissionsCount[], void>({
        query: () => `${PREFIX}/students/assessment-evidence/count`,
        providesTags: ['AssessmentEvidence'],
    }),
    getAssessmentEvidence: builder.query<
        PaginatedResponse<AssessmentEvidenceType>,
        PaginationWithSearch
    >({
        query: (params) => ({
            url: `${PREFIX}/students/assessment-evidence/list-all`,
            params,
        }),
        providesTags: ['AssessmentEvidence'],
    }),
    getAssessmentEvidenceDetail: builder.query<
        {
            assessmentEvidence: AssessmentEvidenceDetailType[]
            otherDocs: AssessmentEvidenceDetailType[]
        },
        { courseId: number; studentId: number; indId?: string }
    >({
        query: ({ courseId, studentId, indId }) => ({
            url: `${PREFIX}/student/assessment-evidence/${courseId}/${studentId}`,
            params: { indId },
        }),
        providesTags: ['AssessmentEvidence', 'Agreement', 'SubAdminWorkplace'],
    }),
    getArchivedAssessmentEvidenceDetail: builder.query<
        AssessmentEvidenceDetailType[],
        { courseId: number; studentId: number }
    >({
        query: ({ courseId, studentId }) =>
            `${PREFIX}/student/assessment-evidence-archived/${courseId}/${studentId}`,
        providesTags: ['AssessmentEvidence'],
    }),
    getAssessmentResponse: builder.query<
        AssessmentEvidenceResponse,
        { selectedFolder: number; student: number }
    >({
        query: ({ selectedFolder, student }) =>
            `${PREFIX}/student/assessment-evidence/response/${selectedFolder}/${student}`,
        providesTags: ['AssessmentEvidence', 'Agreement', 'SubAdminWorkplace'],
    }),
    getOtherDocAssessmentResponse: builder.query<
        AssessmentEvidenceResponse,
        { selectedFolder: number; student: number }
    >({
        query: ({ selectedFolder, student }) =>
            `industry-checks/student/${student}/other-document/${selectedFolder}/response/list-all`,
        providesTags: ['AssessmentEvidence', 'Agreement', 'SubAdminWorkplace'],
    }),

    getAgrementFile: builder.query<AgreementFileType, { studentId: number }>({
        query: ({ studentId }) =>
            `${PREFIX}/student/workplace-request/agreement/${studentId}`,
        providesTags: ['AssessmentEvidence'],
    }),

    downloadAllCourseFiles: builder.mutation<
        any,
        { studentId: number; courseId: number }
    >({
        query: ({ studentId, courseId }) => ({
            url: `shared/files/download/${studentId}/${courseId}`,
            // method: 'POST',
        }),
        invalidatesTags: ['Students', 'SubAdminStudents'],
    }),

    downloadArhiveCourseFiles: builder.mutation<
        any,
        { studentId: number; courseId: number }
    >({
        query: ({ studentId, courseId }) => ({
            url: `shared/archived-files/download/${studentId}/${courseId}`,
            method: 'POST',
        }),
        invalidatesTags: ['Students', 'SubAdminStudents'],
    }),

    getArchivedAssessmentResponse: builder.query<
        AssessmentEvidenceResponse,
        { selectedFolder: number; student: number }
    >({
        query: ({ selectedFolder, student }) =>
            `${PREFIX}/student/archived-assessment-evidence/response/${selectedFolder}/${student}`,
        providesTags: ['AssessmentEvidence'],
    }),
    addCommentOnAssessment: builder.mutation<
        AssessmentAddCommentType,
        {
            folderId: number
            resultId: number
            comment: string
            status: AddCommentEnum
            std: number
            assessmentFolderId: number
        }
    >({
        query: ({
            folderId,
            resultId,
            comment,
            status,
            std,
            assessmentFolderId,
        }) => ({
            url: `${PREFIX}/student/assessment-evidence/comment/${folderId}/${std}/${assessmentFolderId}`,
            method: 'PATCH',
            params: { result: resultId },
            body: { status, comment },
        }),
        invalidatesTags: ['AssessmentEvidence', 'SubAdminStudents'],
    }),
    submitAssessmentEvidence: builder.mutation<
        AssessmentEvidenceResponse,
        { id: number; body: AssessmentFinalCommentFormType }
    >({
        query: ({ id, body }) => ({
            url: `${PREFIX}/student/assessment-evidence/result/${id}`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['AssessmentEvidence', 'SubAdminStudents'],
    }),
    archiveAssessmentEvidence: builder.mutation<
        ArchiveAssessmentType,
        { id: number }
    >({
        query: ({ id }) => ({
            url: `${PREFIX}/assessment-evidence/result/update-status/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['AssessmentEvidence', 'SubAdminStudents'],
    }),
    deleteAssessmentEvidence: builder.mutation<
        AssessmentEvidenceResponse,
        { id: number }
    >({
        query: ({ id }) => ({
            url: `${PREFIX}/assessment-evidence/result/remove/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['AssessmentEvidence', 'SubAdminStudents'],
    }),
    studentAssessmentCourses: builder.query<AssessmentCourseType[], number>({
        query: (id) => `${PREFIX}/student/course/${id}`,
        keepUnusedDataFor: 0,
        providesTags: [
            'AssessmentEvidence',
            'SubAdminStudents',
            'Agreement',
            'SubAdminWorkplace',
        ],
    }),
    studentAllCoursesList: builder.query<AssessmentCourseType[], number>({
        query: (id) => `${PREFIX}/student/course/${id}/data/list`,
        keepUnusedDataFor: 0,
        providesTags: [
            'AssessmentEvidence',
            'SubAdminStudents',
            'Agreement',
            'SubAdminWorkplace',
        ],
    }),
    maulallyReopenSubmissionRequest: builder.mutation<null, number>({
        query: (id) => ({
            url: `${PREFIX}/student/assessment-evidence/allow-submission/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['AssessmentEvidence', 'SubAdminStudents'],
    }),
    uploadAssessmentDocs: builder.mutation<
        AssessmentEvidenceResponse,
        { studentId: number; body: FormData; folderId: number }
    >({
        query: ({ folderId, studentId, body }) => ({
            url: `${PREFIX}/assessment-evidence/response/${folderId}/${studentId}`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['AssessmentEvidence', 'SubAdminStudents'],
    }),
    uploadOtherDocAssessmentDocs: builder.mutation<
        AssessmentEvidenceResponse,
        { studentId: number; body: FormData; folderId: number }
    >({
        query: ({ folderId, studentId, body }) => ({
            url: `industry-checks/student/${studentId}/other-document/${folderId}/response/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['AssessmentEvidence', 'SubAdminStudents'],
    }),
    initiateSigning: builder.mutation<any, any>({
        query: ({ id, body }) => ({
            url: `docusign/template/send/${id}`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['AssessmentEvidence', 'SubAdminStudents'],
    }),
    getDocuSignStatus: builder.query<any, any>({
        query: (id) => `docusign/envelope/get-info/${id}`,
        providesTags: ['AssessmentEvidence', 'SubAdminStudents'],
    }),
    archiveUploadedFile: builder.mutation<FileType, number>({
        query: (fileId) => ({
            url: `subadmin/assessment-evidence/file/archive/${fileId}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['AssessmentEvidence'],
    }),
})
