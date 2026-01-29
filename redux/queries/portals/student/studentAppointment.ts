import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'students'
export const studentEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getStudentPastAppointments: builder.query<any, void>({
        query: () => `${PREFIX}/pastappointments/list`,
        providesTags: ['StudentAppointments'],
    }),
    getStudentUpcomingAppointments: builder.query<any, void>({
        query: () => `${PREFIX}/futureappointments/list`,
        providesTags: ['StudentAppointments'],
    }),
    getCoordinatorsForStudent: builder.query<any, void>({
        query: () => `${PREFIX}/coordinator/list`,
        providesTags: ['StudentAppointments'],
    }),
    getCoordinatorsAvailability: builder.query<any, number>({
        query: (user) => ({
            url: `${PREFIX}/coordinator/availabilities`,
            params: { user },
        }),
        providesTags: ['StudentAppointments'],
    }),
    getJobs: builder.query({
        query: (params: any) => {
            return {
                url: `${PREFIX}/industries/job/list`,
                params,
            }
        },
        providesTags: ['StudentAppointments'],
    }),
    createStudentAppointment: builder.mutation({
        query: (body) => ({
            url: `${PREFIX}/appointment/create`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['StudentAppointments'],
    }),
    getStudentAppointments: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/my-appointments/view`,
            params,
        }),
        providesTags: ['StudentAppointments'],
    }),
    getStudentTimeSlotes: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/coordinator/available/slots`,
            params,
        }),
        providesTags: ['StudentAppointments'],
    }),
})
