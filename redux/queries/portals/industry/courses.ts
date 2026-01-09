import { BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

const PREFIX = 'industries'
export const coursesEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getAllIndustryCourses: builder.query({
        query: (params) => ({
            url: 'admin/course/list',
            params,
        }),
        providesTags: ['Course'],
    }),
    getCourseDetail: builder.query({
        query: (id) => `admin/course/view/${id}`,
        providesTags: ['Course'],
    }),
    addCourse: builder.mutation({
        query: (body) => ({
            url: `admin/course/add`,
            method: 'POST',
            body: body,
        }),
        invalidatesTags: ['Course'],
    }),
    updateCourse: builder.mutation<any, any>({
        query: (body) => {
            return {
                url: `admin/course/update/${body.id}`,
                method: 'PATCH',
                body,
            }
        },
        invalidatesTags: ['Course'],
    }),
    removeCourse: builder.mutation({
        query: (id) => ({
            url: `admin/course/delete/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Course'],
    }),
    getIndustryCourses: builder.query<any, number | null>({
        query: (id) => {
            const params = id ? { id } : {}
            return {
                url: 'industries/course/list',
                params,
            }
        },
        providesTags: ['Course'],
    }),
    getIndustrySectors: builder.query<
        any,
        { userId?: number;  } | null
    >({
        query: (params) => {
            return {
                url: 'industries/sectors/list',
                params,
            }
        },
        providesTags: ['Course'],
    }),
    addCourses: builder.mutation({
        query: (body) => ({
            url: `industries/folder/add`,
            method: 'POST',
            body: body,
        }),
        invalidatesTags: ['Course'],
    }),
})
