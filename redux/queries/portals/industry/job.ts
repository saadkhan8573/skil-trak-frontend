import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'industries'
export const jobEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getAllJobs: builder.query({
        query: (params) => {
            return {
                url: `${PREFIX}/admin/jobs/list`,
                params,
            }
        },
        providesTags: ['Job'],
    }),
    jobChangeStatus: builder.mutation({
        query: (id) => ({
            url: `${PREFIX}/admin/jobs/approve/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Job'],
    }),
    getIndustryJobs: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/job/list`,
            params,
        }),
        providesTags: ['Job'],
    }),
    getJobDetail: builder.query({
        query: (id) => `${PREFIX}/job/view/${id}`,
        providesTags: ['Job'],
    }),
    addJob: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/job/add`,
            method: 'POST',
            body: body,
        }),
        invalidatesTags: ['Job'],
    }),
    updateJob: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/job/update/${body.id}`,
            method: 'PATCH',
            body: body,
        }),
        invalidatesTags: ['Job'],
    }),
    removeJob: builder.mutation({
        query: (id) => ({
            url: `${PREFIX}/job/remove/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Job', 'Jobs'],
    }),
    getBrowseCandidates: builder.query<any, any>({
        query: (params: any) => {
            return {
                url: `${PREFIX}/browse-candidate/list`,
                params,
            }
        },
        providesTags: ['Job'],
    }),
    getJobAppliedUser: builder.query<any, any>({
        query: ({ id, ...params }: any) => {
            return {
                url: `${PREFIX}/job-applications/list/${id}`,
                params,
            }
        },
        providesTags: ['Job'],
    }),
})
