import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

import {
    DefaultDocumentsType,
    PaginatedResponse,
    PaginationWithSearch,
} from '@types'

const PREFIX = 'admin'
export const defaultDocumentsEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    defaultDocuments: builder.query<
        PaginatedResponse<DefaultDocumentsType>,
        PaginationWithSearch | undefined
    >({
        query: (params) => ({
            url: `${PREFIX}/industry-check-names/list`,
            params,
        }),
        providesTags: ['DefaultDocuments'],
    }),

    defaultDocumentDetail: builder.query<DefaultDocumentsType, number>({
        query: (id) => `${PREFIX}/industry-check-name/${id}/detail`,
        providesTags: ['DefaultDocuments'],
    }),

    addDefaultDocument: builder.mutation<
        any,
        Omit<
            DefaultDocumentsType,
            'id' | 'createdAt' | 'updatedAt' | 'isActive'
        >
    >({
        query: (body) => ({
            url: `${PREFIX}/industry-check-name/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['DefaultDocuments'],
    }),

    updateDefaultDocument: builder.mutation<
        DefaultDocumentsType,
        {
            id: number
            name: string
            type: string
            description: string
            link: string
        }
    >({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}/industry-check-name/${id}/update`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['DefaultDocuments'],
    }),

    removeDefaultDocument: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/industry-check-name/${id}/delete`,
            method: 'DELETE',
        }),
        invalidatesTags: ['DefaultDocuments'],
    }),
})
