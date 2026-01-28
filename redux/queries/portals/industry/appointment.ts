import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'industries'
export const appointmentsEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    industryCoordinatorAvailability: builder.query<any, any>({
        query: (user) => ({
            url: 'coordinator/availabilities',
            params: { user },
        }),
        providesTags: ['IndustryAppointment'],
    }),
    createIndustryAppointment: builder.mutation({
        query: (body) => ({
            url: `appointment/create`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['IndustryAppointment'],
    }),
    getIndustryAppointments: builder.query<any, any>({
        query: (params) => ({
            url: 'my-appointments/view',
            params,
        }),
        providesTags: ['IndustryAppointment'],
    }),
})
