import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import {
    PaginatedResponse,
    PaginationWithSearch,
    Rto,
    RtoMessage,
} from '@types'

const PREFIX = 'admin/'
export const rtoMessageCenterEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getRtoMessagesListing: builder.query<
        PaginatedResponse<RtoMessage>,
        PaginationWithSearch
    >({
        query: (params) => ({
            url: `${PREFIX}rtos/messages/list`,
            params,
        }),
        providesTags: ['RTO-Message'],
    }),

    getRtosListForMesssages: builder.query<Rto[], { name?: string }>({
        query: (params) => ({
            url: `${PREFIX}active/rtos-list`,
            params,
        }),
        providesTags: ['RTO-Message'],
    }),

    rtoMessagesCount: builder.query<{ active: number; archived: number }, void>(
        {
            query: (params) => ({
                url: `${PREFIX}rtos/messages/count`,
                params,
            }),

            providesTags: ['RTO-Message'],
        }
    ),

    sendRtoMessage: builder.mutation<any, { id: number; closeNote: string }>({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}rto-message/create`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RTO-Enquiry'],
    }),

    changeMessageStatus: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}rto-message/${id}/archive`,
            method: 'PATCH',
        }),
        invalidatesTags: ['RTO-Message'],
    }),
})
