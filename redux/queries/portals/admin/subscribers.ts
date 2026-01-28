import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

import { PaginatedResponse, PaginationWithSearch, Subscriber } from '@types'

export const subscriberEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    listSubscribers: builder.query<
        PaginatedResponse<Subscriber>,
        PaginationWithSearch
    >({
        query: (params) => ({
            url: 'subscribers',
            params,
        }),
        providesTags: ['Subscribers'],
    }),

    unsubscribe: builder.mutation<Subscriber, number>({
        query: (id) => ({
            url: `subscribers/unsubscribe/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Subscribers'],
    }),

    resubscribe: builder.mutation<Subscriber, number>({
        query: (id: number) => ({
            url: `subscribers/subscribe/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Subscribers'],
    }),
    subscribe: builder.mutation<any, any>({
        query: (body) => ({
            url: `subscribers`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Subscribers'],
    }),
})
