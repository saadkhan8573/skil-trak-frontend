import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { PaginatedResponse, PaginationValues, PaginationWithSearch, User } from '@types'

const PREFIX = 'admin'
export const marketingEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getMarketingUsers: builder.query<
        PaginatedResponse<User>,
        PaginationValues | undefined
    >({
        query: (params) => ({
            url: `${PREFIX}/marketing/list`,
            params,
        }),
        providesTags: ['Users'],
    }),
})
