import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { PaginatedResponse, PaginationWithSearch, Rpl } from '@types'

const PREFIX = 'admin/'
export const industryRplEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    rplRequestList: builder.query<PaginatedResponse<Rpl>, PaginationWithSearch>(
        {
            query: (params) => ({
                url: `${PREFIX}rpl-requests/list`,
                params,
            }),
            providesTags: ['RPL'],
        }
    ),
    rplDelete: builder.mutation<Rpl, number>({
        query: (id) => ({
            url: `${PREFIX}rpl-request/remove/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['RPL'],
    }),
    rplCount: builder.query<any, void>({
        query: () => `${PREFIX}rpl-requests/count`,
        providesTags: ['RPL'],
    }),
    rplIsRead: builder.mutation<any, void>({
        query: () => ({
            url: `${PREFIX}rpl/read`,
            method: 'PATCH',
        }),
        invalidatesTags: ['RPL'],
    }),
})
