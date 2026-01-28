import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'document-processor'
export const studentsLogbookEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getStudentLogbookPagesCount: builder.query<any, number>({
        query: (id) => `${PREFIX}/log-book/${id}/page-count/get`,
        providesTags: ['Logbook'],
    }),
    getStudentLogbook: builder.query<any, { id: number; pageNumber: number }>({
        query: ({ id, pageNumber }) =>
            `${PREFIX}/log-book/${id}/get-page/${pageNumber}/load`,
        providesTags: ['Logbook'],
    }),

    saveLogbook: builder.mutation<any, { id: number; data: any }>({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}/log-book/${id}/process`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Logbook', 'AssessmentEvidence'],
    }),
})
