import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { Industry, PaginationValues } from '@types'

export const industriesEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    registerByFutureIndustry: builder.mutation<any, any>({
        query: (body) => ({
            url: `industries/create/by-listing`,
            method: 'POST',
            body,
        }),
    }),

    isIndustryHiring: builder.mutation<Industry, number | undefined>({
        query: (id) => {
            const params = id ? { id } : {}
            return {
                url: `industries/toggle/hiring-status`,
                method: 'PATCH',
                params,
            }
        },
        invalidatesTags: ['Industries', 'RTOIndustries'],
    }),

    getAllIndustries: builder.query<any, void>({
        query: () => `filter/industries/all`,
        providesTags: ['Industry'],
    }),

    allGetIndustriesList: builder.query<any, void>({
        query: () => `shared/industries/list`,
        providesTags: ['Industry'],
    }),

    getBulkEmailSubadminIndustries: builder.query<any, void>({
        query: () => `subadmin/industries/courses/all`,
        providesTags: ['Industry'],
    }),

    getAllAdvertisedJobs: builder.query<any, any>({
        query: ({ industry }) => ({
            url: `jobs/list`,
            params: { industry },
        }),
        providesTags: ['Industry'],
    }),

    snoozeIndustry: builder.mutation<
        Industry,
        { id: number; date: Date; comment?: string }
    >({
        query: ({ id, ...body }) => ({
            url: `shared/industry/snooze/${id}`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Industries'],
    }),

    unSnoozeIndustry: builder.mutation<
        Industry,
        { comment?: string; id: number }
    >({
        query: ({ id, ...body }) => ({
            url: `shared/industry/reactivate/${id}`,
            body,
            method: 'PATCH',
        }),
        invalidatesTags: ['Industries'],
    }),

    applyForJobFromHomePage: builder.mutation<any, any>({
        query: ({ id, body }) => {
            return {
                url: `students/job/apply/from-website/${id}`,
                method: 'POST',
                body,
            }
        },
        invalidatesTags: ['Industry'],
    }),
    getAdvertisedJobDetail: builder.query<any, any>({
        query: (id) => `jobs/view-related/${id}`,
        providesTags: ['Industry'],
    }),
    getAdvertisedJobCount: builder.query<any, number>({
        query: (id) => `jobs/${id}/increment-views`,
        providesTags: ['Industry'],
    }),

    // Industry Custom Address
    industryBranchesAddressList: builder.query<any, any>({
        query: ({ id, ...params }) => ({
            url: `locations/industry/${id}/list`,
            params,
        }),
        providesTags: ['IndustryBranchesAddress'],
    }),

    industryBranchesCounts: builder.query<
        {
            totalBranches: number
            totalEnrolledStudents: number
        },
        number
    >({
        query: (id) => `industries/${id}/branches/data-count`,
        providesTags: ['IndustryBranchesAddress'],
    }),

    addIndustryBranchesAddress: builder.mutation<any, any>({
        query: (body) => {
            return {
                url: `locations/add`,
                method: 'POST',
                body,
            }
        },
        invalidatesTags: ['IndustryBranchesAddress'],
    }),

    updateIndustryBranchAddress: builder.mutation<any, any>({
        query: ({ id, ...body }) => {
            return {
                url: `locations/update/${id}`,
                method: 'PATCH',
                body,
            }
        },
        invalidatesTags: ['IndustryBranchesAddress'],
    }),

    removeIndustryBranchAddress: builder.mutation<any, number>({
        query: (id) => ({
            url: `locations/remove/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['IndustryBranchesAddress'],
    }),
    addProfileVisitor: builder.query<any, number>({
        query: (id) => `activity-logger/profile/${id}/add-profile-visitor`,
        providesTags: ['IndustriesAddProfile'],
    }),
    viewProfileVisitor: builder.query<
        any,
        PaginationValues & {
            userId: number
        }
    >({
        query: ({ userId, ...params }) => ({
            url: `activity-logger/profile/${userId}/visitor-get`,
            params,
        }),
        providesTags: ['IndustriesAddProfile'],
    }),

    getIndustriesWPTypeList: builder.query<any, number | undefined>({
        query: (userId) => {
            const params = userId ? { userId } : null
            return {
                url: `admin/workplace-types-list/for-industries`,
                params,
            }
        },
        providesTags: ['Industry'],
    }),
    getIndustryWPType: builder.query<any, number | undefined>({
        query: (userId) => {
            const params = userId ? { userId } : null
            return {
                url: `industries/workplace-type`,
                params,
                keepUnusedDataFor: 0,
            }
        },
        providesTags: ['Industry', 'IndustryWorkplaceType'],
    }),

    addIndustryWpType: builder.mutation<
        any,
        { userId?: number; wpTypeId: number }
    >({
        query: ({ wpTypeId, ...params }) => {
            return {
                url: `industries/workplace-type/${wpTypeId}/add`,
                method: 'POST',
                params,
            }
        },
        invalidatesTags: ['Industry', 'IndustryWorkplaceType'],
    }),

    removeIndustryWPType: builder.mutation<any, number | undefined>({
        query: (userId) => {
            const params = userId ? { userId } : null
            return {
                url: `industries/workplace-type/remove`,
                method: 'PATCH',
                params,
            }
        },
        invalidatesTags: ['Industry', 'RTOIndustries', 'IndustryWorkplaceType'],
    }),
    // Industry Eligibility Criteria
    getIndustryEligibilityCriteria: builder.query<any, any>({
        query: (id) => ({
            url: `shared/industry/${id}/get/placement/eligibility-criteria`,
        }),

        providesTags: ['Industry'],
    }),

    updateIndustryEligibilityCriteria: builder.mutation<any, any>({
        query: ({ id, body }) => {
            return {
                url: `shared/industry/${id}/placement/eligibility-criteria`,
                method: 'PATCH',
                body,
            }
        },
        invalidatesTags: ['Industry'],
    }),
    // =============================== Premium Feature =======================================
    // premium-features/list
    getIndustryPremiumFeatures: builder.query<any, { params?: any } | void>({
        query: (arg) => ({
            url: 'premium-features/list',
            ...(arg?.params && { params: arg.params }),
        }),
        providesTags: ['PremiumFeatures'],
    }),
    // premium-features/list-all
    getPremiumFeaturesList: builder.query<any, void>({
        query: () => ({
            url: 'premium-features/list-all',
        }),
        providesTags: ['PremiumFeatures'],
    }),
    getPremiumFeatureFlag: builder.query<any, any>({
        query: (id) => ({
            url: `shared/industry/${id}/premium-check`,
        }),
        providesTags: ['PremiumFeatures'],
    }),

    toggleIndustryPremiumFeature: builder.mutation<any, any>({
        query: ({ id }) => {
            return {
                url: `admin/industry/${id}/premium-activate`,
                method: 'PATCH',
            }
        },
        invalidatesTags: ['PremiumFeatures'],
    }),

    toggleIndustryPremiumSubFeatures: builder.mutation<any, any>({
        query: ({ body }) => ({
            url: `/premium-features/industry/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['PremiumFeatures'],
    }),
})
