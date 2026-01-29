import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'notes'
export const allCommunicationEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    communications: builder.query<any, any>({
        query: ({ id, params }) => ({
            url: `${PREFIX}/all-communication/${id}`,
            params,
        }),
        providesTags: ['Notes', 'AllCommunications', 'SubAdminStudents'],
        serializeQueryArgs: ({ endpointName }) => endpointName,
        transformResponse: (responseData) => responseData,
        merge: (currentCache, newData) => {
            if (!currentCache) {
                return newData
            }

            return {
                data:
                    newData?.pagination?.currentPage === 1
                        ? newData?.data
                        : [...currentCache?.data, ...newData?.data],
                pagination: newData?.pagination,
            }
        },
        forceRefetch({ currentArg, previousArg }) {
            return currentArg !== previousArg
        },
    }),

    allCommunicationCreate: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}`,
            method: 'POST',
            body: body,
        }),
        invalidatesTags: ['Notes', 'AllCommunications'],
    }),

    allCommunicationUpdate: builder.mutation<any, any>({
        query: (body: any) => ({
            url: `${PREFIX}/${body.id}`,
            method: 'PATCH',
            body: body,
        }),
        invalidatesTags: ['Notes', 'AllCommunications'],
    }),

    allCommunicationRemove: builder.mutation<any, any>({
        query: (id) => ({
            url: `${PREFIX}/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Notes', 'AllCommunications'],
    }),
})
