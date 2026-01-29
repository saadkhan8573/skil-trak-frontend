import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { Note } from '@types'

const PREFIX = 'subadmin/'
export const notesEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getNotes: builder.query<any, any>({
        query: ({ id, pinned }) => ({
            url: `${PREFIX}notes/${id}`,
            params: { pinned },
        }),
        providesTags: ['Notes'],
    }),
    subadminNotes: builder.query<Note[], { id: number; pinned?: boolean }>({
        query: ({ id, pinned }) => ({
            url: `${PREFIX}notes/${id}`,
            params: { pinned },
        }),
        providesTags: ['Notes'],
    }),
    noteAdd: builder.mutation<any, any | null>({
        query: (body: any) => {
            return {
                url: `${PREFIX}note/add`,
                method: 'POST',
                body,
            }
        },
        invalidatesTags: ['Notes'],
    }),
    updateNote: builder.mutation<any, any | null>({
        query: ({ id, status }: any) => ({
            url: `${PREFIX}student/update-status/${id}`,
            method: 'PATCH',
            body: { status },
        }),
        invalidatesTags: ['Notes'],
    }),
    subadminNoteStatusChange: builder.mutation<Note, number>({
        query: (id) => ({
            url: `${PREFIX}notes/update-status/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Notes'],
    }),
    noteDelete: builder.mutation({
        query: (id) => ({
            url: `${PREFIX}note/remove/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Notes'],
    }),
})
