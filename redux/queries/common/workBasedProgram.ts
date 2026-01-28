import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

export const workBasedProgramEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getWorkBasedProgram: builder.query<any, any>({
        query: (params) => ({
            url: 'queries/work-based/list',
            params,
        }),
        providesTags: ['WorkBased'],
    }),
    getContactUsQueries: builder.query<any, any>({
        query: (params) => ({
            url: 'website-messages',
            params,
        }),
        providesTags: ['WorkBased'],
    }),
    getWorkBasedProgramCount: builder.query<any, void>({
        query: () => 'admin/work-based/queries-count',
        providesTags: ['WorkBased'],
    }),
    getContactUsQueriesCount: builder.query<any, void>({
        query: () => 'website-messages/count',
        providesTags: ['WorkBased'],
    }),
    bookADemo: builder.mutation<any, void>({
        query: (body) => ({
            url: `website-messages/book-demo`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['WorkBased'],
    }),
    listBookDemo: builder.query<any, any>({
        query: (params) => ({
            url: 'website-messages/list-demo',
            params,
        }),
        providesTags: ['WorkBased'],
    }),
    getWorkBasedProgramAndTraineeshipCount: builder.query<any, void>({
        query: () => 'admin/queries/count-both',
        providesTags: ['WorkBased'],
    }),
    addWorkBasedProgram: builder.mutation<any, void>({
        query: (body) => ({
            url: `queries/work-based/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['WorkBased'],
    }),
    contactWorkBasedProgram: builder.mutation<any, number>({
        query: (id) => ({
            url: `admin/work-based/query/${id}/read`,
            method: 'PATCH',
        }),
        invalidatesTags: ['WorkBased'],
    }),
    contactContactUsQueries: builder.mutation<any, number>({
        query: (id) => ({
            url: `website-messages/${id}/read`,
            method: 'PATCH',
        }),
        invalidatesTags: ['WorkBased'],
    }),
})
