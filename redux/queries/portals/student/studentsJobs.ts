import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { StudentJobType, StudentJobsType } from '@redux/queryTypes'

const PREFIX = 'students'
export const studentJobEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getStudentJobs: builder.query<StudentJobsType, void>({
        query: (params: any) => {
            return {
                url: `${PREFIX}/jobs/list`,
                params,
            }
        },
        providesTags: ['StudentJobs'],
    }),
    getStudentJobDetail: builder.query<StudentJobType, string>({
        query: (id: string) => `${PREFIX}/jobs/view/${id}`,
        providesTags: ['StudentJobs'],
    }),
    saveJob: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/jobs/save/${id}`,
            method: 'POST',
        }),
        invalidatesTags: ['StudentJobs'],
    }),
    applyForJob: builder.mutation<any, any>({
        query: ({ id, body }) => ({
            url: `${PREFIX}/job/apply/${id}`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['StudentJobs'],
    }),
    getStudentUploadedResume: builder.query<any, void>({
        query: () => `${PREFIX}/applications/find-last`,
        providesTags: ['StudentJobs'],
    }),
    getStudentFavoriteJobs: builder.query<any, void>({
        query: () => `${PREFIX}/jobs/favorite/list`,
        providesTags: ['StudentJobs'],
    }),
})
