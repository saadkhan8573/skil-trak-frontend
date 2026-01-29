import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'industries'
export const mouEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getIndustryMOU: builder.query<any, any>({
        query: (params) => ({
            url: 'industries/mou/list',
            params,
        }),
        providesTags: ['MOU'],
    }),
    getIndustryMOUDetail: builder.query<any, string>({
        query: (id) => {
            return {
                url: `industries/mou/view/${id}`,
            }
        },
        providesTags: ['MOU'],
    }),
    createMouByIndustry: builder.mutation({
        query: (body) => ({
            url: `industries/mou/create`,
            method: 'POST',
            body: body,
        }),
        invalidatesTags: ['MOU'],
    }),
    cancelIndustryMOU: builder.mutation({
        query: (id) => ({
            url: `industries/mou/cancel/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['MOU'],
    }),
    acceptMouByIndustry: builder.mutation({
        query: ({ industrySignature, id }) => ({
            url: `industries/mou/sign/${id}`,
            method: 'PATCH',
            body: { industrySignature },
        }),
        invalidatesTags: ['MOU'],
    }),
    rejectIndustryMOU: builder.mutation({
        query: (id) => ({
            url: `industries/mou/reject/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['MOU'],
    }),
    getDefaultMouContent: builder.query({
        query: () => 'mou/default',
        providesTags: ['MOU'],
    }),
})
