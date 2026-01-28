import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

import {
    PaginatedResponse,
    PaginationWithSearch,
    IndustryCheck,
    IndustryCheckFilterType,
    Sector,
} from '@types'

const PREFIX = 'admin'
export const industryChecksEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    industryChecks: builder.query<
        PaginatedResponse<IndustryCheck>,
        PaginationWithSearch | undefined
    >({
        query: (params) => ({
            url: `${PREFIX}/industry-checks/list`,
            params,
        }),
        providesTags: ['IndustryChecks'],
    }),

    // List industry checks for a specific sector (for dropdowns)
    industryChecksBySector: builder.query<IndustryCheck[], number>({
        query: (sectorId) => ({
            url: `${PREFIX}/sector/${sectorId}/industry-checks-detail`,
        }),
        providesTags: ['IndustryChecks'],
    }),

    industryCheckDetail: builder.query<IndustryCheck, number>({
        query: (id) => `${PREFIX}/industry-check/${id}/detail`,
        providesTags: ['IndustryChecks'],
    }),

    addIndustryCheck: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/industry-check/create`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['IndustryChecks'],
    }),

    updateIndustryCheck: builder.mutation<
        IndustryCheck,
        {
            id: number
            name: string
            sector: number
            capacity: number
            link: string
            description?: string
            isRequired: boolean
        }
    >({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/industry-check/${id}/update`,
            method: 'PATCH',
            body: params,
        }),
        invalidatesTags: ['IndustryChecks'],
    }),

    removeIndustryCheck: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/industry-check/${id}/delete`,
            method: 'DELETE',
        }),
        invalidatesTags: ['IndustryChecks'],
    }),

    addSectorIndustryCheck: builder.mutation<
        any,
        { sectorId: number; defaultDocumentId: number }
    >({
        query: ({ sectorId, defaultDocumentId }) => ({
            url: `${PREFIX}/sector/${sectorId}/industry-check-name/${defaultDocumentId}/add`,
            method: 'POST',
        }),
        invalidatesTags: ['IndustryChecks', 'Folders', 'Courses'],
    }),

    getSectorIndustryChecks: builder.query<any, number>({
        query: (sectorId) => ({
            url: `${PREFIX}/sector/${sectorId}/industry-checks/list`,
        }),
        providesTags: ['IndustryChecks'],
    }),

    addCourseIndustryCheck: builder.mutation<
        any,
        { courseId: number; defaultDocumentId: number }
    >({
        query: ({ courseId, defaultDocumentId }) => ({
            url: `${PREFIX}/course/${courseId}/industry-check-name/${defaultDocumentId}/add`,
            method: 'POST',
        }),
        invalidatesTags: ['IndustryChecks', 'Folders', 'Courses'],
    }),

    addCourseMultipleIndustryChecks: builder.mutation<
        any,
        {
            sectorId: number
            courses: number[]
            documents: { id: number; isMandatory: boolean }[]
        }
    >({
        query: (body) => ({
            url: `${PREFIX}/courses/industry-check/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['IndustryChecks', 'Folders', 'Courses'],
    }),

    listAllFoldersForCourses: builder.query<Sector[], void>({
        query: () => `${PREFIX}/courses/industry-checks/list`,
        providesTags: ['IndustryChecks', 'Folders', 'Courses'],
    }),
})
