import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'rtos'
export const mouEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getRtoMOUList: builder.query<any, { skip: number; limit: number }>({
        query: (params) => ({
            url: `${PREFIX}/mous/list`,
            params,
        }),
        providesTags: ['RTOMOU'],
    }),
    getRtoMOUDetail: builder.query<any, string>({
        query: (id) => {
            return {
                url: `${PREFIX}/mou/view/${id}`,
            }
        },
        providesTags: ['RTOMOU'],
    }),
    createMOUbyRTO: builder.mutation({
        query: (body) => ({
            url: `${PREFIX}/mou/create`,
            method: 'POST',
            body: body,
        }),
        invalidatesTags: ['RTOMOU'],
    }),
    acceptMOUbyRTO: builder.mutation({
        query: ({ rtoSignature, id }) => ({
            url: `${PREFIX}/mou/sign/${id}`,
            method: 'PATCH',
            body: { rtoSignature },
        }),
        invalidatesTags: ['RTOMOU'],
    }),
    cancelMOUByRTO: builder.mutation({
        query: (id) => ({
            url: `${PREFIX}/mou/cancel/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['RTOMOU'],
    }),
    rejectMOUByRTO: builder.mutation({
        query: (id) => ({
            url: `${PREFIX}/mou/reject/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['RTOMOU'],
    }),
})
