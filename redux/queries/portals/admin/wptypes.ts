import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

import {
    Course,
    CourseWithAssessmentEvidence,
    PaginatedResponse,
    PaginationWithSearch,
} from '@types'

const PREFIX = 'admin'
export const wptypesEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    wpTypes: builder.query<
        PaginatedResponse<any>,
        PaginationWithSearch | undefined
    >({
        query: (params) => ({
            url: `${PREFIX}/workplace/types-list`,
            params,
        }),
        providesTags: ['WorkplaceTypes'],
    }),

    wpTypeDetail: builder.query<any, number>({
        query: (id) => `${PREFIX}/workplace-type/${id}/detail`,
        providesTags: ['WorkplaceTypes'],
    }),

    addWpType: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/workplace/type-add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['WorkplaceTypes'],
    }),

    updateWpType: builder.mutation<Course, { id: number; name: string }>({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}/workplace-type/${id}/update`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['WorkplaceTypes'],
    }),

    removeWpType: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/workplace-type/${id}/remove`,
            method: 'DELETE',
        }),
        invalidatesTags: ['WorkplaceTypes'],
    }),
})
