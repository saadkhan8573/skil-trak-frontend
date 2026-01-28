import { PaginatedResponse, PaginationValues } from '@types'
import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'api/v1/partners'
export const generateKeysEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    generateKey: builder.mutation<any, number>({
        query: (body) => ({
            url: `${PREFIX}/auth/generate/external-credentials`,
            body,
            method: 'POST',
        }),
        invalidatesTags: ['Generate-Key'],
    }),
    getKeys: builder.query<PaginatedResponse<any>, PaginationValues>({
        query: () => `${PREFIX}/auth/get/external-credentials`,
        providesTags: ['Generate-Key'],
    }),
    deactivateGeneratedKey: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/auth/generate/external-credentials/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Generate-Key'],
    }),
})
