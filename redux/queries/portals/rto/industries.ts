import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { PaginationValues } from '@types'

const PREFIX = 'rtos'
export const industriesEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getIndustriesList: builder.query<any, string>({
        query: (status) => {
            return {
                url: `${PREFIX}/industries/list`,
                params: { status },
            }
        },
        providesTags: ['RTOIndustries'],
    }),

    getBlackListedIndustries: builder.query<any, PaginationValues>({
        query: (params) => ({
            url: `${PREFIX}/workplaces/black-listed/list`,
            params,
        }),
        providesTags: ['RTOIndustries'],
    }),

    removeFromBlackList: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/workplace/${id}/remove/from/black-list`,
            method: 'PATCH',
        }),
        invalidatesTags: ['RTOIndustries'],
    }),
})
