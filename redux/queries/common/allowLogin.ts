import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

export const allowLoginEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    allowAsLogin: builder.mutation<any, number>({
        query: (id) => ({
            url: `admin/user/${id}/after-hours-access/toggle`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Impersonation', 'SubAdmins'],
    }),
})
