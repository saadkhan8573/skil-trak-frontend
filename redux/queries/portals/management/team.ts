import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'management'
export const teamEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    // Get Queries
    getTeamsList: builder.query<any, void>({
        query: () => `${PREFIX}/teams/list`,
        providesTags: ['TeamManagement', 'RemoveTeam'],
    }),
    getSubAdminList: builder.query<any, void>({
        query: () => `subadmin/list-all`,
        providesTags: ['TeamManagement'],
    }),
    getSectorsList: builder.query<any, void>({
        query: () => `${PREFIX}/sectors/list`,
        providesTags: ['TeamManagement'],
    }),
    getTeamMembersList: builder.query<any, any>({
        query: (id) => `${PREFIX}/team/${id}/list-members`,
        providesTags: ['TeamManagement', 'TeamMembers'],
    }),
    getTeamMembersDetail: builder.query<any, any>({
        query: ({ id, params }) => ({
            url: `${PREFIX}/member/${id}/detail`,
            params,
        }),
        providesTags: ['TeamManagement', 'KpiReportDocument', 'KpiReportList'],
    }),
    // sectors/list

    // Mutation
    createTeam: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/team/add`,
            method: 'POST',
            body: body, // name, sector
        }),
        invalidatesTags: ['TeamManagement'],
    }),
    updateTeamLead: builder.mutation<any, any>({
        query: (id) => ({
            url: `${PREFIX}/member/${id}/make-lead`,
            method: 'PATCH',
        }),
        invalidatesTags: ['TeamManagement'],
    }),
    updateTeamName: builder.mutation<any, any>({
        query: ({ id, body }) => ({
            url: `${PREFIX}/team/${id}/update`,
            method: 'PATCH',
            body: body,
        }),
        invalidatesTags: ['TeamManagement'],
    }),
    updateMemberTeam: builder.mutation<any, any>({
        query: ({ id, body }) => ({
            url: `${PREFIX}/member/${id}/update`,
            method: 'PATCH',
            body: body,
        }),
        invalidatesTags: ['TeamManagement'],
    }),
    // member/id/update
    createTeamMembers: builder.mutation<any, any>({
        query: ({ id, body }) => {
            return {
                url: `${PREFIX}/team/${id}/add-members`,
                method: 'POST',
                body: body, // team: teamId, subadmin: id
            }
        },
        invalidatesTags: ['TeamManagement'],
    }),
    // ${PREFIX}/subadmin/${id}/kpi-reports
})
