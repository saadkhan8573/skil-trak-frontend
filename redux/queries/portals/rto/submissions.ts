import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'rtos'
export const submissionsEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getRtoSubmissions: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/evidence/list`,
            params,
        }),
        providesTags: ['RtoSubmissions'],
    }),
    getRtoSubmissionsCount: builder.query<any, void>({
        query: () => `${PREFIX}/assessment-result/count`,
        providesTags: ['RtoSubmissions'],
    }),
    changeRtoSubmissionStatus: builder.mutation<
        any,
        { id: number; result: string }
    >({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/assessment/${id}/result-update`,
            method: 'PATCH',
            params,
        }),
        invalidatesTags: ['RtoSubmissions'],
    }),
})
