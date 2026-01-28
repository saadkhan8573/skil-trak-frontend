import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'rtos/'
export const insuranceEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getRtoInsuranceType: builder.query<any, number | undefined>({
        query: (userId) => {
            const params = userId ? { userId } : null
            return {
                url: `${PREFIX}insurance/documents/type-list`,
                params,
            }
        },
        providesTags: ['Insurance-Type'],
    }),
    uploadRtoInsuranceDocs: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}insurance/document-create`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Insurance-Type'],
    }),
})
