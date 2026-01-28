import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

import { PaginatedResponse, PaginationWithSearch, Sector } from '@types'

const PREFIX = 'admin'
export const sectorEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    sectors: builder.query<
        PaginatedResponse<Sector>,
        PaginationWithSearch | undefined
    >({
        query: (params) => ({
            url: `${PREFIX}/sector/list`,
            params,
        }),
        providesTags: ['Sectors'],
    }),

    sectorDetail: builder.query<Sector, number>({
        query: (id) => `${PREFIX}/sector/view/${id}`,
        providesTags: ['Sectors'],
    }),

    sectorAdd: builder.mutation<Sector, Sector>({
        query: (body) => ({
            url: `${PREFIX}/sector/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Sectors'],
    }),

    sectorUpdate: builder.mutation<Sector, Sector>({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}/sector/update/${id}`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['Sectors'],
    }),

    sectorRemove: builder.mutation<Sector, number>({
        query: (id) => ({
            url: `${PREFIX}/sector/delete/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Sectors'],
    }),
})
