import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'industries'
export const employeeTaskEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getEmployeeTask: builder.query({
        query: () => `${PREFIX}/employeetask/list`,
        providesTags: ['EmployeeTask'],
    }),
})
