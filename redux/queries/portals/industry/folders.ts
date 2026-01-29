import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'industries'
export const foldersEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    addFolder: builder.mutation({
        query: (body) => ({
            url: `admin/folder/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Document'],
    }),
    updateFolder: builder.mutation<any, any>({
        query: (body) => ({
            url: `industries/folder/update/${body.id}`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['Document'],
    }),
    removeFolder: builder.mutation({
        query: (id) => ({
            url: `industries/folder/remove/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Document'],
    }),
    addChecklist: builder.mutation({
        query: (body) => ({
            url: `admin/checklist/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Document'],
    }),
    updateChecklist: builder.mutation({
        query: ({ id, body }) => ({
            url: `admin/checklist/update/${id}`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['Document'],
    }),
    removeChecklist: builder.mutation({
        query: (id) => ({
            url: `admin/checklist/remove/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Document'],
    }),
    getIndustryDocuments: builder.query<any, { course: number; id?: number }>({
        query: (params) => ({
            url: 'industries/folder/list',
            params,
        }),
        providesTags: ['Document'],
    }),
    addOrUpdateRequiredDocument: builder.mutation<any, any>({
        query: ({ industry, ...body }) => ({
            url: `industries/folder/add-or-update`,
            method: 'POST',
            params: { id: industry },
            body,
        }),
        invalidatesTags: ['Document'],
    }),
    addDocument: builder.mutation({
        query: ({ industry, ...body }) => ({
            url: `industries/folder/add`,
            method: 'POST',
            params: { id: industry },
            body,
        }),
        invalidatesTags: ['Document'],
    }),
    deleteDocument: builder.mutation<any, number>({
        query: (id) => ({
            url: `industries/folder/delete/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Document'],
    }),

    getIndustrySectorRequiredDocs: builder.query<
        any,
        { sectorId: number; industryId: number }
    >({
        query: ({ sectorId, industryId }) => ({
            url: `industry-checks/sector/${sectorId}/list`,
            params: { indId: industryId },
        }),
        providesTags: ['Document'],
    }),

    addIndustrySectorDocsOptional: builder.mutation<
        any,
        { userId?: number; id: number }
    >({
        query: ({ id, userId }) => ({
            url: `industry-checks/${id}/required-status/update`,
            params: { userId },
            method: 'PATCH',
        }),
        invalidatesTags: ['Document'],
    }),

    addCustomIndustrySectorDocsOptional: builder.mutation<
        any,
        { userId?: number; id: number }
    >({
        query: ({ id, userId }) => ({
            url: `industry-checks/other-document/${id}/update/status`,
            params: { userId },
            method: 'PATCH',
        }),
        invalidatesTags: ['Document'],
    }),

    addCustomIndustrySectorDocs: builder.mutation<any, any>({
        query: ({ id, ...body }) => ({
            url: `industry-checks/sector/${id}/other-document/create`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Document'],
    }),

    updateCustomIndustrySectorDocs: builder.mutation<any, any>({
        query: ({ id, ...body }) => ({
            url: `industry-checks/other-document/${id}/update`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['Document'],
    }),

    removeCustomIndustrySectorDocs: builder.mutation<any, number>({
        query: (id) => ({
            url: `industry-checks/other-document/${id}/remove`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Document'],
    }),
})
