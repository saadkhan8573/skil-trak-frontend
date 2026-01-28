import { VolunteerRequestEnum } from '@partials'
import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'industries'
export const volunteerEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    VolunteerRequestsList: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/volunteer-request/list`,
            params,
        }),
        providesTags: ['RequestAVolunteer'],
    }),
    requestAVolunteer: builder.mutation<
        any,
        { course: number; requirement: string }
    >({
        query: ({ course, ...body }) => ({
            url: `${PREFIX}/volunteer-request/course/${course}/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RequestAVolunteer'],
    }),
    cancelVolunteerRequest: builder.mutation<
        any,
        { id: number; status: VolunteerRequestEnum }
    >({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}/volunteer-request/${id}/status-update`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['RequestAVolunteer'],
    }),
})
