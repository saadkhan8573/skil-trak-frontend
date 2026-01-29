import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'industries'
export const messageEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getIndustryMessages: builder.query<any, void>({
        query: (params) => `${PREFIX}/mail/list`,
        providesTags: ['Message'],
    }),
    sendIndustryMessage: builder.mutation({
        query: (body) => ({
            url: `messaging/email`,
            method: 'POST',
            body: body,
        }),
        invalidatesTags: ['Message'],
    }),
})
