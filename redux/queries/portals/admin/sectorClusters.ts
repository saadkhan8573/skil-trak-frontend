import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

import { PaginatedResponse, PaginationWithSearch, Sector } from '@types'

const PREFIX = 'sectors'
export const sectorClustersEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    // sectors: builder.query<
    //     PaginatedResponse<Sector>,
    //     PaginationWithSearch | undefined
    // >({
    //     query: (params) => ({
    //         url: `${PREFIX}/sector/list`,
    //         params,
    //     }),
    //     providesTags: ['Sectors'],
    // }),

    getAvailableLinkedSectors: builder.query<any, number>({
        query: (id) => `${PREFIX}/${id}/available-linked-sectors`,
        providesTags: ['SectorClusters'],
    }),
    getClusterSectors: builder.query<any, number>({
        query: (id) => `${PREFIX}/${id}/linked-sectors`,
        providesTags: ['SectorClusters'],
    }),

    addSectorToCluster: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/add-linked-sector`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['SectorClusters'],
    }),
    // Questions
    getSectorClusterQuestions: builder.query<any, number>({
        query: (id) => `${PREFIX}/questions/${id}`,
        providesTags: ['SectorClusters'],
    }),
    addSectorQuestion: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/questions`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['SectorClusters'],
    }),
    updateSectorQuestion: builder.mutation<any, any>({
        query: ({ id, body }) => ({
            url: `${PREFIX}/${id}/questions`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['SectorClusters'],
    }),

    // Supervisor requirements
    updateRequirements: builder.mutation<any, any>({
        query: ({ id, body }) => ({
            url: `${PREFIX}/${id}/supervisor-requirements`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['SectorClusters'],
    }),
    getSupervisorRequirements: builder.query<any, any>({
        query: (id) => `${PREFIX}/${id}/supervisor-requirements`,
        providesTags: ['SectorClusters'],
    }),
})
