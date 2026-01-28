import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'students'
export const documentsEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getStudentDocuments: builder.query<any, void>({
        query: () => `admin/documents/for-student/list`,
        providesTags: ['StudentDocuments'],
    }),
})
