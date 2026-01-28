import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'

const PREFIX = 'talentpool'
export const talentPoolEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    getTalentPoolStudentProfile: builder.query<any, void>({
        query: () => `${PREFIX}/student/profile`,
        providesTags: ['StudentProfile'],
    }),
    getTalentPoolStudent: builder.query<any, void>({
        query: () => `${PREFIX}/student/get`,
        providesTags: ['StudentProfile'],
    }),
    getAppliedTalentPoolStudentProfile: builder.query<any, void>({
        query: () => `${PREFIX}/profile/get`,
        providesTags: ['StudentProfile'],
    }),
    getIndustriesRequest: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/connection-requests/list`,
            params,
        }),
        providesTags: ['StudentProfile'],
    }),
    applyForTalentPool: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/profile-create`,
            method: 'POST',

            body,
        }),
        invalidatesTags: ['StudentProfile'],
    }),
    updateTalentPoolProfile: builder.mutation<any, any>({
        query: ({ id, body }) => ({
            url: `${PREFIX}/${id}/update`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['StudentProfile'],
    }),
    uploadTalentPoolRequiredDocs: builder.mutation<any, any>({
        query: ({ body, folderId }) => ({
            url: `${PREFIX}/required-document/response-file/upload/${folderId}`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['TalentPoolRequiredDocs', 'StudentProfile'],
        // FIle name should be file:, talentPoolProfileId:
    }),
    industryRequestStatus: builder.mutation<any, any>({
        query: ({ status, conId }) => ({
            url: `${PREFIX}/connection-request/${conId}/update-status`,
            method: 'PATCH',
            body: { status },
        }),
        invalidatesTags: ['StudentProfile', 'MatchingProfiles'],
    }),
    getAcceptedTalentPoolIndustryProfile: builder.query<any, any>({
        query: (id: any) => ({
            url: `${PREFIX}/connection-request/${id}/detail`,
        }),
        providesTags: ['StudentProfile'],
    }),
    getTalentPoolConnectionRequestCount: builder.query<any, void>({
        query: () => ({
            url: `${PREFIX}/connection-requests/count`,
        }),
        providesTags: ['StudentProfile'],
    }),
    getConnectionRequiredDocs: builder.query<any, any>({
        query: (id: any) => ({
            url: `${PREFIX}/connection-request/${id}/detail`,
        }),
        providesTags: ['StudentProfile'],
    }),
    getTalentPoolRequiredDocsResponse: builder.query<any, any>({
        query: (id) => ({
            url: `${PREFIX}/required-document/${id}/response-list`,
        }),
        providesTags: ['TalentPoolRequiredDocs', 'StudentProfile'],
    }),
    getIndustryRequestCount: builder.query<any, void>({
        query: () => `${PREFIX}/connection-requests/count`,
        providesTags: ['TalentPoolRequiredDocs', 'StudentProfile'],
    }),
    readIndustryRequest: builder.mutation<any, void>({
        query: () => ({
            url: `${PREFIX}/connection-request/read`,
            method: 'PATCH',
        }),
        invalidatesTags: ['TalentPoolRequiredDocs', 'StudentProfile'],
    }),
})
