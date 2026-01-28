import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'admin'
export const talentPoolEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getTalentPoolList: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/talentpool/profiles-list`,
            params,
        }),
        providesTags: ['TalentPoolProfiles'],
    }),
    getTalentPoolProfile: builder.query<any, any>({
        query: (id) => ({
            url: `${PREFIX}/talentpoolprofile/${id}/detail`,
        }),
        providesTags: ['TalentPoolProfiles'],
    }),
    getTalentPoolProfilesCount: builder.query<any, void>({
        query: () => ({
            url: `${PREFIX}/talentpool/profiles-count`,
        }),
        providesTags: ['TalentPoolProfiles'],
    }),
    readTalentPoolProfilesCount: builder.mutation<any, void>({
        query: () => ({
            url: `${PREFIX}/talentpool-profiles/read`,
            method: 'PATCH',
        }),
        invalidatesTags: ['TalentPoolProfiles'],
    }),
    deleteTalentPoolProfile: builder.mutation<any, any>({
        query: (id) => ({
            url: `${PREFIX}/talent-pool/profile/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['TalentPoolProfiles'],
    }),
})
