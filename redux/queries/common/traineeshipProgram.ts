import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

export const traineeshipProgramEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getTraineeshipProgram: builder.query<any, any>({
        query: (params) => ({
            url: 'queries',
            params,
        }),
        providesTags: ['Traineeship'],
    }),
    getTraineeshipProgramCount: builder.query<any, void>({
        query: () => 'admin/queries-count',
        providesTags: ['Traineeship'],
    }),
    addTraineeshipProgram: builder.mutation<any, void>({
        query: (body) => ({
            url: `queries`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Traineeship'],
    }),
    contactTraineeshipProgram: builder.mutation<any, number>({
        query: (id) => ({
            url: `admin/query/${id}/read`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Traineeship', 'WorkBased'],
    }),
})
