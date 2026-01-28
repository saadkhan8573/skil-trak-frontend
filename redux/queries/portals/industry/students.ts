import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'industries'
export const studentsEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    industryStudentCount: builder.query<any, void>({
        query: () => `${PREFIX}/students/count`,
        providesTags: ['Industries'],
    }),
    getIndustryStudents: builder.query({
        query: (params) => ({
            url: `${PREFIX}/student/list`,
            params,
        }),
        providesTags: ['Students'],
    }),
    getIndustryStudentProfile: builder.query({
        query: (id) => `${PREFIX}/student/view/${id}`,
        providesTags: ['Students'],
    }),
    getFutureCandidates: builder.query<any, void>({
        query: (id) => `${PREFIX}/future-candidate/list`,
        providesTags: ['Students'],
    }),
})
