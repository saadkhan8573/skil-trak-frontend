import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'subadmin'
export const setUnavailabilityEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    addUnavailability: builder.mutation<any, any | null>({
        query: (body: any) => {
            return {
                url: `${PREFIX}/un-availability/add`,
                method: 'POST',
                body,
            }
        },
        invalidatesTags: ['SetUnAvailability'],
    }),
    getUnAvailabilities: builder.query<any, any>({
        query: (params) => {
            return {
                url: `${PREFIX}/un-availability/list`,
                params,
            }
        },
        providesTags: ['SetUnAvailability'],
    }),
    removeUnAvailability: builder.mutation<any, number>({
        query: (id) => {
            return {
                url: `${PREFIX}/un-availability/remove/${id}`,
                method: 'DELETE',
            }
        },
        invalidatesTags: ['SetUnAvailability'],
    }),
})
