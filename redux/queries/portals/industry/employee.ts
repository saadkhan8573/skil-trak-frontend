import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'industries'
export const employeeEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getEmployee: builder.query<any, any>({
        query: (params) => {
            return {
                url: 'industries/employee/list',
                params,
            }
        },
        providesTags: ['Employee'],
    }),
    getEmployeeDetail: builder.query<any, any>({
        query: (id) => {
            return {
                url: `industries/employee/${id}/tasks`,
            }
        },
        providesTags: ['Employee'],
    }),
    addEmployee: builder.mutation({
        query: (body) => ({
            url: `industries/employee/add`,
            method: 'POST',
            body: body,
        }),
        invalidatesTags: ['Employee'],
    }),
    updateEmployee: builder.mutation({
        query: ({ body, id }) => {
            return {
                url: `industries/employee/${id}`,
                method: 'PATCH',
                body,
            }
        },

        invalidatesTags: ['Employee'],
    }),
    updateEmployeeTaskOnDrag: builder.mutation({
        query: (body) => ({
            url: `industries/task/update`,
            method: 'POST',
            body: body,
        }),
        invalidatesTags: ['Employee'],
    }),
    removeEmployee: builder.mutation({
        query: (id) => ({
            url: `industries/employee/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Employee'],
    }),
    addEmployeeTask: builder.mutation({
        query: (body) => ({
            url: `industries/task/add`,
            method: 'POST',
            body: body,
        }),
        invalidatesTags: ['Employee'],
    }),
    changeEmployeeTaskPriority: builder.mutation({
        query: ({ id, priority }) => ({
            url: `industries/task/${id}`,
            method: 'PATCH',
            body: { priority },
        }),
        invalidatesTags: ['Employee'],
    }),
    deleteEmployeeTask: builder.mutation({
        query: (id) => ({
            url: `industries/task/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Employee'],
    }),
})
