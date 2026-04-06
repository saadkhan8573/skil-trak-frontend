import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'supervisors'
export const supervisorsEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getSupervisor: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}`,
            params,
        }),
        providesTags: ['Industries'],
    }),
    getSupervisorBySector: builder.query<
        any,
        { indId: number; sectorId: number }
    >({
        query: ({ indId, sectorId }) => `${PREFIX}/${indId}/${sectorId}`,
        providesTags: ['Industries'],
    }),
    addSupervisor: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Industries'],
    }),
    editSupervisor: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/${body?.id}`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['Industries'],
    }),

    removeSupervisor: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Industries'],
    }),

    // sectors/:id/courses-by-level
    getCoursesBySupervisorLevel: builder.query<any, any>({
        query: ({ id, params }) => ({
            url: `sectors/${id}/courses-by-level`,
            params,
        }),
        providesTags: ['Industries'],
    }),
})
