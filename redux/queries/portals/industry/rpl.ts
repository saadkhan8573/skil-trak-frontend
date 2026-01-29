import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'industries'
export const rplEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getRpl: builder.query({
        query: () => `${PREFIX}/rpl/list`,
        providesTags: ['RPL'],
    }),
    addRpl: builder.mutation({
        query: (body) => ({
            url: `${PREFIX}/rpl/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RPL'],
    }),
})
