import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

import { PaginatedResponse, PaginationWithSearch, SectorDocument } from '@types'

const PREFIX = 'admin'
export const sectorDocumentsEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    sectorDocuments: builder.query<
        PaginatedResponse<SectorDocument>,
        PaginationWithSearch | undefined
    >({
        query: (params) => ({
            url: `${PREFIX}/document/templates-list`,
            params,
        }),
        providesTags: ['SectorDocuments'],
    }),

    // List sector documents for a specific sector (for dropdowns)
    sectorDocumentsBySector: builder.query<SectorDocument[], number>({
        query: (sectorId) => ({
            url: `${PREFIX}/sector/${sectorId}/document-templates-detail`,
        }),
        providesTags: ['SectorDocuments'],
    }),

    sectorDocumentDetail: builder.query<SectorDocument, number>({
        query: (id) => `${PREFIX}/document/${id}/template-detail`,
        providesTags: ['SectorDocuments'],
    }),

    addSectorDocument: builder.mutation<any, { id: number; sector: number }>({
        query: (body) => ({
            url: `${PREFIX}/sector/template-create`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['SectorDocuments'],
    }),

    updateSectorDocument: builder.mutation<
        SectorDocument,
        {
            id: number
            name: string
        }
    >({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/document/${id}/template-update`,
            method: 'PATCH',
            params,
        }),
        invalidatesTags: ['SectorDocuments'],
    }),

    removeSectorDocument: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/document/${id}/template-delete`,
            method: 'DELETE',
        }),
        invalidatesTags: ['SectorDocuments'],
    }),
})
