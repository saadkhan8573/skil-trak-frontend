import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'rtos'
export const coordinatorEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    coordinatorCreate: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/coordinator/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Rto-Coordinators'],
    }),
    coordinatorUpdate: builder.mutation<any, any>({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}/coordinator/${id}/update`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['Rto-Coordinators'],
    }),

    getRtoCoordinators: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/coordinator/list`,
            params,
        }),
        providesTags: ['Rto-Coordinators', 'SubAdmins'],
    }),
    getRtoAssignedCoordinatorsList: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/assigned/coordinator`,
            params,
        }),
        providesTags: ['Rto-Coordinators', 'SubAdmins'],
    }),
    getRtoAssignedCoordinators: builder.query<any, void>({
        query: () => `${PREFIX}/coordinator/names/list`,
        providesTags: ['Rto-Coordinators', 'SubAdmins'],
    }),
    getRtoCoordinatorsDetail: builder.query<any, number>({
        query: (id) => `${PREFIX}/coordinator/profile/${id}`,
        providesTags: ['Rto-Coordinators'],
    }),
    removeCoordinator: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/coordinator/remove/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Rto-Coordinators'],
    }),

    hasAccessAllStudents: builder.mutation<any, any>({
        query: (id) => ({
            url: `${PREFIX}/coordinator/${id}/toggle/has-access-all/students`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Rto-Coordinators', 'SubAdmins'],
    }),
})
