import { BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import { PaginationValues, PaginationWithSearch, UserStatus } from '@types'
import { EsignDocumentStatus } from '@utils'

const PREFIX = 'esign'
export const eSignEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getEsignRtos: builder.query<any, void>({
        query: () => `rtos/list/for-esign`,
        providesTags: ['E-Sign'],
    }),

    getSubadminEsignList: builder.query<any, PaginationWithSearch>({
        query: (params) => ({
            url: `${PREFIX}/documents/list-all`,
            params,
        }),
        providesTags: ['E-Sign'],
    }),

    getEsignDocumentsCount: builder.query<any, void>({
        query: () => `${PREFIX}/documents/count`,
        providesTags: ['E-Sign'],
    }),

    saveEsign: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/template/create`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['E-Sign'],
    }),

    saveIndustryEsign: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/template/facility-checklist/create`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['E-Sign'],
    }),

    updateIndustryEsign: builder.mutation<any, any>({
        query: ({ id, body }) => ({
            url: `${PREFIX}/template/${id}/facility-checklist/update`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['E-Sign'],
    }),

    getTemplatePagesCount: builder.query<any, any>({
        query: (id) => `${PREFIX}/template/${id}/pages/get-count`,
        providesTags: ['E-Sign'],
    }),
    getCoordinatorsByCourse: builder.query<any, number>({
        query: (id) => `subadmin/courses/${id}`,
        providesTags: ['E-Sign'],
    }),
    saveEsignTemplate: builder.mutation<any, any>({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}/template/tabs/${id}`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['E-Sign'],
    }),
    // getEsignTemplate: builder.query<any, number>({
    //     query: (id) => `${PREFIX}/template/tabs/${id}`,
    //     providesTags: ['E-Sign'],
    // }),

    getEsignList: builder.query<any, PaginationWithSearch>({
        query: (params) => ({
            url: `${PREFIX}/template/list`,
            params,
        }),
        providesTags: ['E-Sign'],
    }),

    getIndustryEsignList: builder.query<
        any,
        PaginationValues & { search?: string }
    >({
        query: (params) => ({
            url: `${PREFIX}/template/facility-checklist/list`,
            params,
        }),
        providesTags: ['E-Sign'],
    }),

    getIndustryAllEsignList: builder.query<any, {id:number,sectorId?:number}>({
        query: ({id,...params}) => ({
            url : `${PREFIX}/industry/${id}/docs`,
            params 
        }),
        providesTags: ['E-Sign'],
    }),
    getIndustryESignDocuments: builder.query<any, { userId: number }>({
        query: ({ userId }) => ({
            url: `industries/facility-checklist/pending/list`,
            params: { userId },
        }),
        providesTags: ['E-Sign'],
    }),

    getIndustryEsignDetail: builder.query<any, number>({
        query: (id) => `${PREFIX}/facility-checklist/template/${id}/view`,
        providesTags: ['E-Sign'],
    }),

    getEsignTemplateDetail: builder.query<any, number>({
        query: (id) => `${PREFIX}/template/view/${id}`,
        providesTags: ['E-Sign'],
    }),
    updateEsignTemplateDetail: builder.mutation<any, any>({
        query: ({ id, body }) => ({
            url: `${PREFIX}/template/update/${id}`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['E-Sign'],
    }),
    getEsignTemplate: builder.query<any, { id: number; pageNumber: number }>({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/template/get/${id}`,
            params,
        }),
        providesTags: ['E-Sign'],
    }),
    getEsignTemplateTabs: builder.query<any, number>({
        query: (id) => `${PREFIX}/template/tabs-get/${id}`,
        providesTags: ['E-Sign'],
    }),
    changeEsignStatus: builder.mutation<
        any,
        { id: number; status: UserStatus }
    >({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/template/status/update/${id}`,
            method: 'PATCH',
            params,
        }),
        invalidatesTags: ['E-Sign'],
    }),
    getESignStudentDetail: builder.query<
        any,
        { student: number; courseId: number }
    >({
        query: ({ student, courseId }) =>
            `${PREFIX}/student/${courseId}/${student}`,
        providesTags: ['E-Sign'],
    }),

    getESignTemplateDetail: builder.query<
        any,
        { folder: number; userId: number }
    >({
        query: ({ folder, ...params }) => ({
            url: `${PREFIX}/folder/template/view/${folder}`,
            params,
        }),
        providesTags: ['E-Sign'],
    }),

    previewAsSignerTemplate: builder.query<
        any,
        {
            folder: number
            industry?: number
            student?: number
            coordinator?: number
        }
    >({
        query: ({ folder, ...params }) => ({
            url: `${PREFIX}/template/get-updated/${folder}`,
            params,
        }),
        providesTags: ['E-Sign'],
    }),

    viewStudentEsignDocument: builder.query<
        any,
        {
            folder: number
            std: number
        }
    >({
        query: ({ folder, ...params }) => ({
            url: `${PREFIX}/document/retrieve/folder/${folder}`,
            params,
        }),
        providesTags: ['E-Sign'],
    }),

    initiateESign: builder.mutation<
        any,
        {
            template: number
            users: string
        }
    >({
        query: ({ template, ...params }) => ({
            url: `${PREFIX}/document/initiate/${template}`,
            params,
            method: 'POST',
        }),
        invalidatesTags: ['E-Sign'],
    }),

    initiateIndustryESign: builder.mutation<
        any,
        {
            industryUserId: number
            templateId: number
        }
    >({
        query: ({ industryUserId, templateId }) => ({
            url: `${PREFIX}/industry/${industryUserId}/check-list-template/${templateId}/document/initiate`,
            method: 'POST',
        }),
        invalidatesTags: ['E-Sign'],
    }),
    bulkInitiateIndustryESign: builder.mutation<
        any,
        {
            industryUserId: number
            templateIds: number[]
        }
    >({
        query: ({ industryUserId, templateIds }) => ({
            url: `${PREFIX}/industry/${industryUserId}/check-list/documents/initiate`,
            method: 'POST',
            body: { templateIds },
        }),
        invalidatesTags: ['E-Sign'],
    }),

    getIndustryPendingDocs: builder.query<
        any,
        {
            userId: number
            search: string
        }
    >({
        query: (params) => ({
            url: `${PREFIX}/industry-check-list/document/pending/list`,
            params,
        }),
        providesTags: ['E-Sign'],
    }),

    getIndustryEsignDocs: builder.query<
        any,
        {
            search: string
            userId: number
        }
    >({
        query: (params) => ({
            url: `industries/checklist/documents/list`,
            params,
        }),
        providesTags: ['E-Sign'],
    }),

    cancelESign: builder.mutation<
        any,
        { id: number; status: EsignDocumentStatus }
    >({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/document/status-update/${id}`,
            params,
            method: 'PATCH',
        }),
        invalidatesTags: ['E-Sign'],
    }),

    requestResignForESign: builder.mutation<
        any,
        { document: number; userId: number }
    >({
        query: ({ document, userId }) => ({
            url: `${PREFIX}/document/${document}/re-sign/${userId}/request`,
            method: 'PATCH',
        }),
        invalidatesTags: ['E-Sign'],
    }),
    usersPendingDocumentsList: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/documents/pending/retrieve-for-user`,
            params,
        }),
        providesTags: ['E-Sign'],
    }),

    getUserTemplateDocumentForSign: builder.query<
        any,
        { id: number; pageNumber: number }
    >({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/documents/${id}/retrieve-svgs`,
            params,
        }),
        providesTags: ['E-Sign'],
    }),

    getUserSignatureTabForTemplate: builder.query<
        any,
        { template: number; docId: number; signerId?: number }
    >({
        query: ({ template, ...params }) => ({
            url: `${PREFIX}/signature-tab/retrieve-for-document/${template}`,
            params,
        }),
        providesTags: ['E-Sign'],
    }),

    getTotalPagesForDocuments: builder.query<any, number>({
        query: (id) => `${PREFIX}/document/${id}/pages/get-count`,
        providesTags: ['E-Sign'],
    }),
    signDocumentByUser: builder.mutation<
        any,
        {
            documentId: number
            tabId: number
            signature: string
        }
    >({
        query: ({ signature, ...params }) => ({
            url: `${PREFIX}/document/sign`,
            method: 'POST',
            params,
            body: { signature },
        }),
        invalidatesTags: ['E-Signssss'],
    }),

    cancelEsignDocument: builder.mutation<
        any,
        {
            documentId: number
            tabId: number
            signature: string
        }
    >({
        query: ({ signature, ...params }) => ({
            url: `${PREFIX}/document/sign`,
            method: 'POST',
            params,
            body: { signature },
        }),
        invalidatesTags: ['E-Sign'],
    }),

    addCustomFieldData: builder.mutation<
        any,
        {
            userId?: number
            tabsResponse: any
            documentId: number
        }
    >({
        query: ({ documentId, ...body }) => ({
            url: `${PREFIX}/document/${documentId}/tab/response`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['E-Sign'],
    }),

    addEmailCustomFieldData: builder.mutation<
        any,
        {
            documentId: number
            tabsResponse: any
            id?: number
        }
    >({
        query: ({ documentId, id, ...body }) => ({
            url: `${PREFIX}/document/${documentId}/tab/response/from-email`,
            method: 'POST',
            params: { id },
            body,
        }),
        invalidatesTags: ['E-Sign'],
    }),

    getDocumentForUsers: builder.query<any, number>({
        query: (docId) => `${PREFIX}/document/${docId}/get`,
        providesTags: ['E-Sign'],
    }),
    getTabsForUsers: builder.query<any, { docId: number; token: string }>({
        query: ({ docId, ...params }) => ({
            url: `${PREFIX}/signature-tab/get-for-document/${docId}`,
            params,
        }),
        providesTags: ['E-Sign'],
    }),

    addSignForUser: builder.mutation<
        any,
        {
            id: number
            tabId: number
            signature: string
            documentId: number
        }
    >({
        query: ({ id, signature, ...params }) => ({
            url: `${PREFIX}/document/sign/through-mail/${id}`,
            method: 'POST',
            params,
            body: { signature },
        }),
        invalidatesTags: ['E-Signsssssssss'],
    }),
    updateSignDate: builder.mutation<
        any,
        {
            id: number
            date: Date
        }
    >({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}/tab/response/${id}/update`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['DateChange'],
    }),

    removeTemplate: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/template/${id}/remove`,
            method: 'DELETE',
        }),
        invalidatesTags: ['E-Sign'],
    }),
    removeTemplateTabs: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/tab/${id}/remove`,
            method: 'DELETE',
        }),
        invalidatesTags: ['RemoveTemplate-E-Sign'],
    }),

    checkIfUserSigned: builder.query<any, { documentId: number; id: number }>({
        query: ({ documentId, id }) =>
            `${PREFIX}/document/${documentId}/validate/signer/${id}`,
        providesTags: ['Email Sign'],
    }),
    pendingDocumentsCount: builder.query<any, void>({
        query: () => `${PREFIX}/signings-pending/count`,
        providesTags: ['Email Sign'],
    }),

    downloadTemplateTabs: builder.query<any, number>({
        query: (id) => ({
            url: `${PREFIX}/document/tabs/download/${id}`,
        }),
        providesTags: ['RemoveTemplate-E-Sign'],
    }),

    downloadEsignDocument: builder.query<any, number>({
        query: (id) => `${PREFIX}/document/${id}/download`,
        providesTags: ['E-Sign'],
    }),

    resendEmailToUser: builder.mutation<
        any,
        { documentId: number; userId: number }
    >({
        query: ({ documentId, userId }) => ({
            url: `${PREFIX}/document/${documentId}/signer/${userId}/mail-send`,
            method: 'POST',
        }),
        invalidatesTags: ['E-Sign'],
    }),

    toggleReminderEmail: builder.mutation<any, number>({
        query: (signerId) => ({
            url: `${PREFIX}/signer/${signerId}/reminder-email/toggle`,
            method: 'PATCH',
        }),
        invalidatesTags: ['E-Sign'],
    }),
})
