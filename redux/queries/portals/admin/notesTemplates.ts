import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

import { PaginatedResponse, PaginationWithSearch } from '@types'

const PREFIX = 'notes-template'
export const notesTemplatesEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    notesTemplates: builder.query<
        PaginatedResponse<any>,
        PaginationWithSearch | undefined
    >({
        query: (params) => ({
            url: PREFIX,
            params,
        }),
        providesTags: ['NotesTemplates'],
    }),

    notesTemplateDetail: builder.query<any, number>({
        query: (id) => `${PREFIX}/${id}`,
        providesTags: ['NotesTemplates'],
    }),

    addNoteTemplate: builder.mutation<any, any>({
        query: (body) => ({
            url: PREFIX,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['NotesTemplates'],
    }),

    updateNoteTemplate: builder.mutation<any, { id: number; name: string }>({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}/${id}`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['NotesTemplates'],
    }),

    removeNoteTemplate: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['NotesTemplates'],
    }),

    swapNoteTemplate: builder.mutation<any, { id: number; index: number }>({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/sequence/update/${id}`,
            params,
            method: 'PATCH',
        }),
        invalidatesTags: ['NotesTemplates'],
    }),
})
