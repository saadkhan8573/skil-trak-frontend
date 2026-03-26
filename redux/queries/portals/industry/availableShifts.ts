import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'industries'
export const availableShiftsEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getAvailableShifts: builder.query<any, void>({
        query: () => `${PREFIX}/working-hours/list`,
        providesTags: ['AvailableShifts'],
    }),
    addWorkingHours: builder.mutation<any, { userId?: number; days: any }>({
        query: ({ userId, ...body }) => ({
            url: `${PREFIX}/working-hours/add`,
            method: 'POST',
            body,
            params: { userId },
        }),
        invalidatesTags: [
            'AvailableShifts',
            'SubAdminIndustries',
            'RTOIndustries',
        ],
    }),
    addShift: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/available-shift/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['AvailableShifts'],
    }),
    getShifts: builder.query<any, number>({
        query: (id) => `${PREFIX}/available-shift/list/${id}`,
        providesTags: ['AvailableShifts'],
    }),
    removeShift: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/available-shift/remove/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['AvailableShifts'],
    }),
})
