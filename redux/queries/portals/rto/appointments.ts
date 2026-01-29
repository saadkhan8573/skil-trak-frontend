import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'rtos'
export const appointmentsEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    createRTOAppointment: builder.mutation<any, any | null>({
        query: (body) => {
            return {
                url: `${PREFIX}/appointment/create`,
                method: 'POST',
                body,
            }
        },
        invalidatesTags: ['RTOAppointment', 'Appointments'],
    }),
    getRTOAppointments: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/my-appointments/view`,
            params,
        }),
        providesTags: ['RTOAppointment'],
    }),
    getCoordinatorsForRTO: builder.query<any, void>({
        query: () => `${PREFIX}/assigned/coordinator/list`,
        providesTags: ['RTOAppointment'],
    }),

    //shared/v2/users/search
    getRtoSearchedUsers: builder.query<any, any>({
        query: (params) => ({
            url: `shared/v2/users/search/for-appointment/in-rto`,
            params,
        }),
        providesTags: ['RTOAppointment'],
    }),
    // shared/v2/course/:id/search/for-appointment
    getRtoSearchedUserCourse: builder.query<any, any>({
        query: ({ id, params }) => ({
            url: `shared/v2/course/${id}/search/for-appointment`,
            params,
        }),
        providesTags: ['RTOAppointment'],
    }),
    createRtoAppointment: builder.mutation<any, any>({
        query: (body) => ({
            url: `appointments/rto/create`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RTOAppointment', 'Appointments'],
    }),
    //appointments/count/v2/for-rto
    getRtoAppointmentsCount: builder.query<any, void>({
        query: () => ({
            url: `appointments/count/v2/for-rto`,
        }),
        providesTags: ['RTOAppointment'],
    }),
})
