import { VolunteerRequestEnum } from '@partials'
import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import {
    PaginatedResponse,
    PaginationWithSearch,
    VolunteerRequest,
} from '@types'

const PREFIX = 'subadmin/'
export const subadminVolunteerEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getSubadminVolunteerRequests: builder.query<
        PaginatedResponse<VolunteerRequest>,
        PaginationWithSearch
    >({
        query: (params) => ({
            url: `${PREFIX}volunteer-request/list`,
            params,
        }),
        providesTags: ['Volunteer'],
    }),
    // requestVolunteerCount: builder.query<any, void>({
    //     query: () => `${PREFIX}volunteer-requests/count`,
    //     providesTags: ['Volunteer'],
    // }),
    changeSubadminVolunteerRequestStatus: builder.mutation<
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
