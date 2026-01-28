import { NotesTemplateType } from '@partials/admin/noteTemplates/enum'
import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { Note } from '@types'

const PREFIX = 'notes'
export const notesEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    notesPinned: builder.query<Note[], number | any>({
        query: (id) => `${PREFIX}/pinned/${id}`,
        providesTags: ['Notes', 'AllCommunications'],
    }),

    notes: builder.query<Note[], { id: number; isPinned?: boolean }>({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/${id}`,
            params,
        }),
        providesTags: ['Notes', 'AllCommunications'],
    }),

    noteStatusChange: builder.mutation<Note, number>({
        query: (id) => ({
            url: `${PREFIX}/pin/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Notes', 'AllCommunications'],
    }),

    noteCreate: builder.mutation({
        query: (body) => ({
            url: PREFIX,
            method: 'POST',
            body: body,
        }),
        invalidatesTags: ['Notes', 'AllCommunications'],
    }),

    noteUpdate: builder.mutation({
        query: (body: any) => ({
            url: `${PREFIX}/${body.id}`,
            method: 'PATCH',
            body: body,
        }),
        invalidatesTags: ['Notes', 'AllCommunications'],
    }),

    noteRemove: builder.mutation({
        query: (id) => ({
            url: `${PREFIX}/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Notes', 'AllCommunications'],
    }),

    getNotesTemplate: builder.query<
        any,
        { type: NotesTemplateType | null; wpId: number }
    >({
        query: (params) => ({
            url: 'notes-template/list',
            params,
        }),
        providesTags: ['Notes'],
    }),
})
