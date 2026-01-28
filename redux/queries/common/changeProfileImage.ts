import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = `users`

export const changeProfileImageEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    changeProfile: builder.mutation<any, any | null>({
        query: ({ body, user }) => ({
            url: `${PREFIX}/avatar/update`,
            method: 'PATCH',
            params: { user },
            body,
        }),
        invalidatesTags: ['Avatar', 'Profile'],
    }),
    removeProfile: builder.mutation<any, number>({
        query: (user) => ({
            url: `${PREFIX}/avatar/remove`,
            params: { user },
            method: 'DELETE',
        }),
        invalidatesTags: ['Avatar', 'Profile'],
    }),
})
