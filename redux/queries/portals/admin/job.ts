import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { Job, PaginatedResponse, PaginationWithSearch } from '@types'

const PREFIX = 'admin/'
export const jobEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    jobs: builder.query<PaginatedResponse<Job>, PaginationWithSearch>({
        query: (params) => ({
            url: `${PREFIX}jobs/list`,
            params,
        }),
        providesTags: ['Jobs'],
    }),

    jobApplicants: builder.query<PaginatedResponse<Job>, any>({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}job/${id}/applicants-all`,
            params,
        }),
        providesTags: ['Jobs'],
    }),

    jobStatusChange: builder.mutation<Job, number>({
        query: (id) => ({
            url: `${PREFIX}jobs/approve/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Jobs'],
    }),
})
