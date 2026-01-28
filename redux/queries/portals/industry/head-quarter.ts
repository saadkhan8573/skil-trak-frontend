import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { PaginationValues } from '@types'

const PREFIX = 'industries'
export const headQuarterEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getIndustryHeadQuarter: builder.query<any, PaginationValues>({
        query: () => `${PREFIX}/head-office/view`,
        providesTags: ['HeadQuarter'],
    }),
})
