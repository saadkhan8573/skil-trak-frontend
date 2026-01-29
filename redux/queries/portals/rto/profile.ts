import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { PaginatedResponse, PaginationValues, Student } from '@types'

const PREFIX = 'rtos/'
export const profileEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getRTOProfileDetail: builder.query({
        query: () => `rtos/profile/view`,
        providesTags: ['RTO'],
    }),
    getRtoSelfPayment: builder.query<any, any>({
        query: (id) => `${PREFIX}${id}/self-payment-status/view`,
        providesTags: ['RTO'],
    }),
    updateRTOProfile: builder.mutation<any, any>({
        query: ({ id, body }) => ({
            url: 'rtos/profile/update',
            method: 'PATCH',
            params: { rto: id },
            body,
        }),
        invalidatesTags: ['RTO'],
    }),
    rtoDashboardStudentsLogsList: builder.query<
        PaginatedResponse<Student>,
        PaginationValues
    >({
        query: (params) => ({
            url: `${PREFIX}students/list-all`,
            params,
        }),
        providesTags: ['RTOS', 'Avatar', 'Profile'],
    }),
    getRtoMapIndustries: builder.query<any, void>({
        query: () => `${PREFIX}industries/list/for-map`,
        providesTags: ['SubAdmin'],
    }),

    getRtoProgressByCourse: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}course/progress/view`,
            params,
        }),
        providesTags: ['RTOS'],
    }),

    // Add custom course requirements
})
