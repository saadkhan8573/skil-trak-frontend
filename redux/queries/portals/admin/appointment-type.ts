import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import {
    AppointmentType,
    PaginatedResponse,
    PaginationWithSearch,
} from '@types'

const PREFIX = 'admin/'
export const appointmentTypeEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    appointmentTypes: builder.query<
        PaginatedResponse<AppointmentType>,
        PaginationWithSearch
    >({
        query: (params) => ({
            url: `${PREFIX}appointment-type/list`,
            params,
        }),
        providesTags: ['AppointmentTypes'],
    }),

    appointmentTypeDetail: builder.query<AppointmentType, number>({
        query: (id) => `${PREFIX}appointment-type/view/${id}`,
        providesTags: ['AppointmentTypes'],
    }),

    appointmentTypeAdd: builder.mutation<AppointmentType, AppointmentType>({
        query: (body) => ({
            url: `${PREFIX}appointment-type/add`,
            method: 'POST',
            body: body,
        }),
        invalidatesTags: ['AppointmentTypes'],
    }),

    appointmentTypeUpdate: builder.mutation<AppointmentType, AppointmentType>({
        query: (body) => ({
            url: `${PREFIX}appointment-type/update/${body.id}`,
            method: 'PATCH',
            body: body,
        }),
        invalidatesTags: ['AppointmentTypes'],
    }),

    appointmentTypeRemove: builder.mutation<AppointmentType, number>({
        query: (id) => ({
            url: `${PREFIX}appointment-type/remove/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['AppointmentTypes'],
    }),
})
