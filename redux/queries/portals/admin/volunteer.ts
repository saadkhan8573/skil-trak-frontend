import { VolunteerRequestEnum } from '@partials'
import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import {
    PaginatedResponse,
    PaginationWithSearch,
    VolunteerRequest,
} from '@types'

const PREFIX = 'admin/'
export const volunteerEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getVolunteerRequests: builder.query<
        PaginatedResponse<VolunteerRequest>,
        PaginationWithSearch
    >({
        query: (params) => ({
            url: `${PREFIX}volunteer-requests/list`,
            params,
        }),
        providesTags: ['Volunteer'],
    }),
    requestVolunteerCount: builder.query<any, void>({
        query: () => `${PREFIX}volunteer-requests/count`,
        providesTags: ['Volunteer'],
    }),
    volunteerIsRead: builder.mutation<any, void>({
        query: () => ({
            url: `${PREFIX}volunteer/read`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Volunteer'],
    }),
    changeVolunteerRequestStatus: builder.mutation<
        any,
        { id: number; note: string; status: VolunteerRequestEnum }
    >({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}volunteer-request/${id}/update`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['Volunteer'],
    }),
})
