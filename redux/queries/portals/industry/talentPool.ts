import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'industries'
export const talentPoolEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getMatchingProfilesList: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/talentpool/profiles`,
            params,
        }),
        providesTags: ['MatchingProfiles'],
    }),
    getMatchingProfileDetail: builder.query<any, any>({
        query: (id) => ({
            url: `talentpool/profile/${id}/detail`,
        }),
        providesTags: ['MatchingProfiles'],
    }),
    getTalentPoolRequiredDocs: builder.query<any, void>({
        query: () => ({
            url: `talentpool/list-documents`,
        }),
        providesTags: ['MatchingProfiles'],
    }),
    getTalentPoolHiredProfiles: builder.query<any, any>({
        query: (id) => ({
            url: `talentpool/sector/${id}/detail`,
        }),
        providesTags: ['MatchingProfiles'],
    }),
    getTalentPoolCountBySector: builder.query<any, void>({
        query: () => ({
            url: `talentpool/count/by-sector`,
        }),
        providesTags: ['MatchingProfiles'],
    }),
    // connection-request/add

    sentConnectionRequest: builder.mutation<any, any>({
        query: (body) => ({
            url: `talentpool/connection-request/add`,
            method: 'POST',
            body,
            // talentPoolProfile: id of profile
        }),
        invalidatesTags: ['MatchingProfiles'],
    }),
    // Count
    getTalentPoolProfileCount: builder.query<any, void>({
        query: () => ({
            url: `${PREFIX}/talentpool/count`,
        }),
        providesTags: ['TalentPoolCount'],
    }),
    readTalentPoolProfileCount: builder.mutation<any, void>({
        query: () => ({
            url: `${PREFIX}/talentpool-profile/read`,
            method: 'PATCH',
        }),
        invalidatesTags: ['TalentPoolCount'],
    }),
    // getIndustryAppointments: builder.query<any, any>({
    //     query: (params) => ({
    //         url: 'my-appointments/view',
    //         params,
    //     }),
    //     providesTags: ['IndustryAppointment'],
    // }),
})
