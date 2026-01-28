import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { AdminProfileFormType, User } from '@types'

const PREFIX = 'admin'
export const profileEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getProfile: builder.query<User, void>({
        query: () => `${PREFIX}/profile/get`,
        providesTags: ['Profile'],
    }),
    updateAdminProfile: builder.mutation<User, AdminProfileFormType>({
        query: (body) => ({
            url: `${PREFIX}/profile/update`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['Profile'],
    }),
    getDashboardChartCounts: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/count/for-graph`,
            params,
        }),
        providesTags: ['Profile'],
    }),

    // View Progress by course
    getAdminProgressByCourse: builder.query<any, any>({
        query: () => `${PREFIX}/progress-by-course`,
        providesTags: ['Profile'],
    }),
})
