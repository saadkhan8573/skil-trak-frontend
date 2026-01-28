import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

export const impersonationEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    impersonationToggle: builder.mutation<any, void>({
        query: () => ({
            url: `subadmin/imparsonation/toggle`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Impersonation', 'SubAdmin'],
    }),
    allowAsAdmin: builder.mutation<any, number>({
        query: (id) => ({
            url: `admin/can-admin/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Impersonation', 'SubAdmins'],
    }),
})
