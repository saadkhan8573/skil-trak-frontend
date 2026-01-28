import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { RtoPlan, WorkplaceTokenPlan } from '@types'

const PREFIX = 'rtos/'
export const rtoIndustryCreditsEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    createIndustryCredit: builder.mutation<
        any,
        {
            cost: number
            token: string
        }
    >({
        query: (body) => ({
            url: `${PREFIX}payment/initiate`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RTOIndustryCredits'],
    }),

    changeRtoNetwork: builder.mutation<
        any,
        {
            network: 'shareable' | 'private'
        }
    >({
        query: (params) => ({
            url: `${PREFIX}network-update`,
            method: 'PATCH',
            params,
        }),
        invalidatesTags: ['RTOIndustryCredits'],
    }),

    getRtoCredits: builder.query<RtoPlan, void>({
        query: () => `${PREFIX}credit`,
        providesTags: ['RTOIndustryCredits'],
    }),

    confirmRtoWorkplacePayment: builder.mutation<
        any,
        {
            token: string
            paymentId: string
            plan: WorkplaceTokenPlan
        }
    >({
        query: (body) => ({
            url: `${PREFIX}workplace-token/create`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RTOIndustryCredits', 'RTO'],
    }),
})
