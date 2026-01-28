import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { AdminStats, ContactPerson, PaginatedResponse, Rto } from '@types'

const PREFIX = 'rtos'
export const contactPersonEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    contactPersons: builder.query<PaginatedResponse<ContactPerson>, any>({
        query: (params: any) => {
            return {
                url: `${PREFIX}/contact-persons`,
                params,
            }
        },
        providesTags: ['ContactPersons'],
    }),
    addContactPerson: builder.mutation<any, any>({
        query: ({ rto, ...body }) => {
            const params = rto ? { id: rto } : {}
            return {
                url: `${PREFIX}/contactperson/add`,
                method: 'POST',
                params,
                body,
            }
        },
        invalidatesTags: ['ContactPersons'],
    }),
    updateContactPerson: builder.mutation<any, any>({
        query: ({ id, body }) => ({
            url: `${PREFIX}/contact-person/update/${id}`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['ContactPersons'],
    }),
    removeContactPerson: builder.mutation<any, number>({
        query: (id) => {
            return {
                url: `${PREFIX}/contact-person/remove/${id}`,
                method: 'DELETE',
            }
        },
        invalidatesTags: ['ContactPersons'],
    }),
})
