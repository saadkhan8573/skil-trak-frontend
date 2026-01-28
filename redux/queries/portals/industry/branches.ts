import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { PaginationValues } from '@types'

const PREFIX = 'industries'
export const branchesEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getBranches: builder.query<any, PaginationValues>({
        query: () => `${PREFIX}/branches/list`,
        providesTags: ['Branches'],
    }),
})
