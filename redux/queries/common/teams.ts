// support-team
import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { BulkUpdateMembersRequest } from '@partials/common/teams/types'
const PREFIX = 'support'
export const teamsEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    // ==============================================================
    //   ---------------------- QUERIES -------------------------
    // ==============================================================
    getAllSupportTeams: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}-team`,
            params,
        }),
        providesTags: ['Team'],
    }),
    getTeamCounts: builder.query<any, void>({
        query: () => ({
            url: `${PREFIX}-team/statistics/get`,
        }),
        providesTags: ['Team'],
    }),
    getSupportTeamsList: builder.query<any, void>({
        query: () => ({
            url: `${PREFIX}-team/list/filter-options`,
        }),
        providesTags: ['Team'],
    }),
    getSupportTeamMembersByTeam: builder.query<any, any>({
        query: (id) => ({
            url: `${PREFIX}-team/${id}/list-members`,
        }),
        providesTags: ['Team'],
    }),
    // support-team/members/filter-options
    getSupportTeamMemberList: builder.query<any, void>({
        query: () => ({
            url: `${PREFIX}-team/members/filter-options/list`,
        }),
        providesTags: ['Team'],
    }),
    // Auto tickets
    getAutomatedTickets: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}-task`,
            params,
        }),
        providesTags: ['Team'],
    }),
    // task/statistics/get
    getAutomatedTicketsCount: builder.query<any, void>({
        query: (params) => ({
            url: `${PREFIX}-task/statistics/get`,
            params,
        }),
        providesTags: ['Team'],
    }),

    getAutomatedTicketDetails: builder.query<any, any>({
        query: (id) => ({
            url: `${PREFIX}-task/${id}`,
        }),
        providesTags: ['Team'],
    }),
    getAutomatedTicketNotes: builder.query<any, any>({
        query: (id) => ({
            url: `${PREFIX}-task/${id}/notes/get-all`,
        }),
        providesTags: ['Team', 'Tickets', 'SubAdminStudents'],
    }),
    // student/:userId/list
    getStudentSupportTicketsList: builder.query<any, any>({
        query: ({ params, id }) => ({
            url: `${PREFIX}-task/student/${id}/list`,
            params,
        }),
        providesTags: ['Team'],
    }),
    getTicketsByUserId: builder.query<any, any>({
        query: ({ params, id }) => ({
            url: `${PREFIX}-task/workplace/${id}/tickets-list`,
            params,
        }),
        providesTags: ['Team'],
    }),
    getUserTeam: builder.query<any, void>({
        query: () => `${PREFIX}-team/list-by-user/current`,
        providesTags: ['Team'],
    }),
    getRtosAllowedForTeam: builder.query<any, void>({
        query: () => ({
            url: `rtos/list/with-permission/receive-tickets`,
        }),
        providesTags: ['Team'],
    }),
    getRtosCoordinatorAllowedForTeam: builder.query<any, any>({
        query: (id) => ({
            url: `rtos/${id}/coordinator/list`,
        }),
        providesTags: ['Team'],
    }),
    // ==============================================================
    //   ---------------------- MUTATIONS -------------------------
    // ==============================================================
    // support-team post request
    createSupportTeam: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}-team`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Team'],
    }),
    createRtoSupportTeam: builder.mutation<any, any>({
        query: (body) => ({
            url: `rtos/list/with-permission/receive-tickets`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Team'],
    }),
    // support-task/id/coordinator/id/update
    changeSupportTicketAssignee: builder.mutation<any, any>({
        query: ({ coordId, taskId }) => ({
            url: `${PREFIX}-task/${taskId}/coordinator/${coordId}/update`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Team'],
    }),
    // support-task/delete-multiple/by-ids
    bulkDeleteSupportTickets: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}-task/delete-multiple/by-ids`,
            method: 'DELETE',
            body,
        }),
        invalidatesTags: ['Team'],
    }),
    editSupportTeam: builder.mutation<any, any>({
        query: ({ id, body }) => ({
            url: `${PREFIX}-team/${id}`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['Team'],
    }),
    deleteSupportTeam: builder.mutation<any, any>({
        query: (id) => ({
            url: `${PREFIX}-team/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Team'],
    }),
    // id/severity-update
    updateAutoTicketPriority: builder.mutation<any, any>({
        query: ({ id, params }) => ({
            url: `${PREFIX}-task/${id}/severity-update`,
            method: 'PATCH',
            params,
        }),
        invalidatesTags: ['Team'],
    }),
    updateAutoTicketStatus: builder.mutation<any, any>({
        query: ({ id, body }) => ({
            url: `${PREFIX}-task/${id}/status-update`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['Team'],
    }),
    addAutoTicketNote: builder.mutation<any, any>({
        query: ({ id, body }) => ({
            url: `${PREFIX}-task/${id}/add-note`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Team'],
    }),

    updateCanReceiveTickets: builder.mutation<
        any,
        {
            id: string | number
            canReceiveTickets?: boolean
            ticketTypes?: string[]
        }
    >({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}/member/${id}/update`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['Team'],
    }),
    bulkUpdateMembers: builder.mutation<any, BulkUpdateMembersRequest>({
        query: (body) => ({
            url: `${PREFIX}-team/member/update-receive/tickets`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['Team'],
    }),
})
