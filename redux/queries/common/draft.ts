import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'messaging'
export const draftEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    setEmailDarft: builder.mutation<
        any,
        { receiver: number; title?: string; content?: string }
    >({
        query: (body) => ({
            url: `${PREFIX}/mail/draft`,
            body,
            method: 'POST',
        }),
        invalidatesTags: ['Draft'],
    }),
    getEmailDarft: builder.query<any, number>({
        query: (id) => `${PREFIX}/mail/draft/${id}`,
        providesTags: ['Draft', 'Mails'],
    }),

    setNoteDarft: builder.mutation<
        any,
        { receiver: number; title?: string; content?: string }
    >({
        query: (body) => ({
            url: `notes/note/draft`,
            body,
            method: 'POST',
        }),
        invalidatesTags: ['Draft'],
    }),
    getNoteDarft: builder.query<any, number>({
        query: (id) => `notes/note/draft/${id}`,
        providesTags: ['Draft'],
    }),
})
