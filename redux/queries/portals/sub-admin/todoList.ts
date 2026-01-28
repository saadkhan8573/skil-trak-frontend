import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { PaginationValues, PaginationWithSearch } from '@types'

const PREFIX = 'todos'

type ListingType = PaginationWithSearch & {
    id?: number
}

export const todoListEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    todoListCount: builder.query<any, { date: string }>({
        query: (params) => ({
            url: `${PREFIX}/count/all`,
            params,
        }),
        providesTags: ['TODO'],
    }),

    highPriorityTodoList: builder.query<any, ListingType>({
        query: (params) => ({
            url: `${PREFIX}/high-priority/data`,
            params,
        }),
        providesTags: ['TODO'],
    }),

    appointmentTodoList: builder.query<any, ListingType>({
        query: (params) => ({
            url: `${PREFIX}/appointment/data`,
            params,
        }),
        providesTags: ['TODO'],
    }),

    ticketTodoList: builder.query<any, ListingType>({
        query: (params) => ({ url: `${PREFIX}/open-tickets/data`, params }),
        providesTags: ['TODO'],
    }),

    workplaceTodoList: builder.query<any, ListingType>({
        query: (params) => ({
            url: `${PREFIX}/workplace-requests/data`,
            params,
        }),
        providesTags: ['TODO'],
    }),

    weeklyFollowUp: builder.query<any, ListingType>({
        query: (params) => ({
            url: `${PREFIX}/student-follow-up/data`,
            params,
        }),
        providesTags: ['TODO'],
    }),

    monthlyPartnerIndustriesFollowUp: builder.query<any, ListingType>({
        query: (params) => ({
            url: `${PREFIX}/partner-industries/data`,
            params,
        }),
        providesTags: ['TODO'],
    }),
    quarterlyListedIndustries: builder.query<any, ListingType>({
        query: (params) => ({
            url: `${PREFIX}/listed-industries/data`,
            params,
        }),
        providesTags: ['TODO'],
    }),

    biMonthlyNonPartnerIndustries: builder.query<any, ListingType>({
        query: (params) => ({
            url: `${PREFIX}/non-partner-industries/data`,
            params,
        }),
        providesTags: ['TODO'],
    }),

    updateTodoStatus: builder.mutation<
        any,
        { id: number; status: string; date: string }
    >({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/${id}`,
            method: 'PATCH',
            params,
        }),
        invalidatesTags: ['TODO'],
    }),

    managerTodoAppointments: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/appointments/for-manager`,
            params,
        }),
        providesTags: ['TODO'],
    }),
    managerTodoStudents: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/students/for-manager`,
            params,
        }),
        providesTags: ['TODO'],
    }),

    createWorkplaceTodo: builder.mutation<
        any,
        { workplaceId: number; userId: number }
    >({
        query: ({ workplaceId, ...params }) => ({
            url: `${PREFIX}/workplace/${workplaceId}/create`,
            params,
            method: 'POST',
        }),
        invalidatesTags: ['TODO'],
    }),

    // beta
    addAllNewTodos: builder.mutation<any, void>({
        query: () => ({
            url: `${PREFIX}/create`,
            method: 'POST',
        }),
        invalidatesTags: ['TODO'],
    }),
    removeAllTodos: builder.mutation<any, void>({
        query: () => ({
            url: `${PREFIX}/remove-all`,
            method: 'DELETE',
        }),
        invalidatesTags: ['TODO'],
    }),
})
