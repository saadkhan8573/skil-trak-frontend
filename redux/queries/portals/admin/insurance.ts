import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'admin'
export const insuranceEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getInsuranceType: builder.query<any, void>({
        query: () => `${PREFIX}/insurance-document/type/list`,
        providesTags: ['Insurance-Type'],
    }),
    getRtoByInsuranceType: builder.query<any, number>({
        query: (id) => `${PREFIX}/insurance-document/type/${id}`,
        providesTags: ['Insurance-Type'],
    }),
    getIndustriesByInsuranceType: builder.query<any, number>({
        query: (id) => `${PREFIX}/insurance-document/type/${id}/industries`,
        providesTags: ['Insurance-Type'],
    }),

    addInsuranceType: builder.mutation<any, { title: string }>({
        query: (body) => ({
            url: `${PREFIX}/insurance-document/type/create`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Insurance-Type'],
    }),

    editInsuranceType: builder.mutation<any, { id: number; title: string }>({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}/insurance-document/type/${id}/update`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['Insurance-Type'],
    }),

    removeInsuranceType: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/insurance-document/type/${id}/remove`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Insurance-Type'],
    }),
})
