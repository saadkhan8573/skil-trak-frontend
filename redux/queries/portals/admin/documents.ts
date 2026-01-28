import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { DocumentsType } from 'types/documents.type'

const PREFIX = 'admin'
export const documentsEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getDocuments: builder.query<DocumentsType[], void>({
        query: () => `${PREFIX}/document/list`,
        providesTags: ['Documents'],
    }),
    addDocuments: builder.mutation<DocumentsType, FormData>({
        query: (body) => ({
            url: `${PREFIX}/document/add`,
            method: 'POST',
            body: body,
        }),
        invalidatesTags: ['Documents'],
    }),
})
