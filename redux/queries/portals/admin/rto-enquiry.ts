import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'admin/'
export const rtoEnquiryEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getRtoEnquiries: builder.query<any, { search?: string }>({
        query: (params) => ({
            url: `${PREFIX}rtos/inquires-list`,
            params,
        }),
        providesTags: ['RTO-Enquiry'],
    }),

    getRtoEnquiryDetail: builder.query<any, number>({
        query: (id) => `${PREFIX}rto/inquiry/${id}-detail`,
        providesTags: ['RTO-Enquiry'],
    }),

    getRtoEnquiriesCounts: builder.query<any, { search: string }>({
        query: (params) => ({
            url: `${PREFIX}rtos/inquires-count`,
            params,
        }),
        providesTags: ['RTO-Enquiry'],
    }),

    premiumIndustriesListForEnquiry: builder.query<any, number>({
        query: (id) => `${PREFIX}feature/${id}/industries-list`,
        providesTags: ['RTO-Enquiry'],
    }),

    attachIndustry: builder.mutation<any, { id: number; indId: number }>({
        query: ({ id, indId }) => ({
            url: `${PREFIX}inquiry/${id}/industry/${indId}/add`,
            method: 'PATCH',
        }),
        invalidatesTags: ['RTO-Enquiry'],
    }),

    closeEnquiry: builder.mutation<any, { id: number; closeNote: string }>({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}inquiry/${id}/close`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['RTO-Enquiry'],
    }),
})
