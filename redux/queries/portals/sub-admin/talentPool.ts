import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'subadmin'
export const talentPoolEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getSubAdminTalentPoolList: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/talentpool/profiles`,
            params,
        }),
        providesTags: ['TalentPoolProfiles'],
    }),
})
