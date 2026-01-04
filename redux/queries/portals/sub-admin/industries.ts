import { IndustryPlacementStatus } from '@partials/common'
import { BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import {
    Industry,
    PaginatedResponse,
    PaginationWithSearch,
    UserStatus,
} from '@types'

const PREFIX = 'subadmin'
export const subAdminIndustriesEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    subadminIndustryStatisticsCount: builder.query<any, number>({
        query: (id) => `${PREFIX}/industry/students/count/${id}`,
        providesTags: ['Industries'],
    }),

    getSubadminIndustriesCount: builder.query<any, void>({
        query: () => `${PREFIX}/industries/count`,
        providesTags: ['SubAdminIndustries'],
    }),
    getSubAdminIndustries: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/industries/list`,
            params,
        }),
        providesTags: ['SubAdminIndustries'],
    }),
    getStdProvidedWpAppReq: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/student/workplace-approval-requests`,
            params,
        }),
        providesTags: ['SubAdminIndustries'],
    }),
    changeWPProvidedStatus: builder.mutation<
        any,
        { id: number; status: string }
    >({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/student/workplace-approval/${id}/update`,
            params,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdminIndustries'],
    }),

    getRtoCoordinatorsIndustry: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/industries/list/by-students`,
            params,
        }),
        providesTags: ['SubAdminIndustries'],
    }),
    getSnoozedIndustry: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/snoozed-industries/list`,
            params,
        }),
        providesTags: ['SubAdminIndustries'],
    }),
    getFavouriteIndustries: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/favorite-industries/list`,
            params,
        }),
        providesTags: ['SubAdminIndustries'],
    }),

    getMonthlyCallsList: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/industries/on-call-list`,
            params,
        }),
        providesTags: ['SubAdminIndustries'],
    }),

    getMonthlyCallsIndustriesList: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/industries/favorite/list`,
            params,
        }),
        providesTags: ['SubAdminIndustries'],
    }),
    getSubAdminIndustriesProfile: builder.query<
        any,
        { id: number; type?: string }
    >({
        query: ({ id, type }) => ({
            url: `${PREFIX}/industry/profile/${id}`,
            params: { type },
        }),
        providesTags: ['SubAdminIndustries', 'Industries'],
    }),
    getSubAdminIndustryProfile: builder.query<any, any>({
        query: (id) => ({
            url: `${PREFIX}/industry/${id}/profile`,
        }),
        providesTags: ['SubAdminIndustries', 'Industries'],
    }),
    getSubAdminIndustryStudents: builder.query<
        any,
        { industry: number; skip: number; limit: number }
    >({
        query: ({ industry, ...params }) => ({
            url: `${PREFIX}/industry/students/list/${industry}`,
            params,
        }),
        providesTags: ['SubAdminIndustries'],
    }),
    addToFavorite: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/industry/favorite/add/${id}`,
            method: 'POST',
        }),
        invalidatesTags: ['SubAdminIndustries'],
    }),

    changeIndustryStatusChange: builder.mutation<
        any,
        { id: number; status: UserStatus; comment: string }
    >({
        query: ({ id, ...body }) => ({
            url: `shared/industry/status/update`,
            method: 'PATCH',
            params: { id },
            body,
        }),
        invalidatesTags: [
            'Notes',
            'SubAdmin',
            'SubAdminRtos',
            'SubAdminIndustries',
        ],
    }),

    addToPartner: builder.mutation<
        any,
        { industry: number; studentCapacity?: number; note?: string }
    >({
        query: ({ industry, studentCapacity, ...body }) => ({
            url: `${PREFIX}/industry/partner/add/${industry}`,
            body,
            // body: { studentCapacity },
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdminIndustries', 'RTOIndustries'],
    }),
    // confirm course
    confirmCourseDescription: builder.mutation<any, any>({
        query: (id) => ({
            url: `${PREFIX}/course-approval/request/${id}/content/verify`,
            method: 'PATCH',
        }),
        invalidatesTags: ['RequestToAddCourse'],
    }),
    industryCallLog: builder.mutation<
        any,
        {
            industry?: number
            branch?: number
            receiver?: any
            workplaceId?: number
        }
    >({
        query: ({ industry, branch, receiver, workplaceId }) => {
            let body: Record<string, any> = {}
            let params: Record<string, any> | undefined

            if (industry !== undefined) {
                // Industry call
                body = { industry, workplaceId }
                params = { receiver }
            } else if (branch !== undefined) {
                body = { branch, workplaceId }
            }

            return {
                url: `call-log`,
                method: 'POST',
                params,
                body,
            }
        },
        invalidatesTags: ['SubAdminIndustries', 'SubAdminWorkplace'],
    }),

    getIndustryCallLog: builder.query<any, number>({
        query: (industryId) => ({
            url: `call-log`,
            params: { industryId },
        }),
        providesTags: ['SubAdminIndustries'],
    }),

    industryProgress: builder.query<any, number>({
        query: (industryId) =>
            `${PREFIX}/industries/${industryId}/profile-completion/progress`,
        providesTags: ['SubAdminIndustries', 'RTOIndustries'],
    }),

    industryAnsweredCall: builder.mutation<any, { id: number; status: string }>(
        {
            query: ({ id, status }) => ({
                url: `call-log/action/answered/${id}`,
                method: 'PATCH',
                params: { status },
            }),
            invalidatesTags: ['SubAdminIndustries'],
        }
    ),

    makeIndustryHeadquarter: builder.mutation<
        any,
        { headQuarter: number; branch: number }
    >({
        query: (body) => ({
            url: `${PREFIX}/industry/branches/add`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['SubAdminIndustries'],
    }),

    removeIndustryBranch: builder.mutation<any, { branch: number }>({
        query: (body) => ({
            url: `${PREFIX}/industry/branches/remove`,
            method: 'DELETE',
            body,
        }),
        invalidatesTags: ['SubAdminIndustries'],
    }),

    getIndustryBranches: builder.query<
        any,
        { id: number; skip: number; limit: number }
    >({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/industry/branches/list/${id}`,
            params,
        }),
        providesTags: ['SubAdminIndustries'],
    }),

    //
    changeIndustryStudentsAcceptingStatus: builder.mutation<
        any,
        { id: number; status: IndustryPlacementStatus }
    >({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}/industry/${id}/update/placement-status`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['SubAdminIndustries', 'RTOIndustries'],
    }),

    //get indudstry students schedule
    getIndustryStudentsSchedule: builder.query<any, any>({
        query: ({ id, params }) => ({
            url: `industries/${id}/schedules`,
            params,
        }),
        providesTags: ['SubAdminIndustries'],
    }),
    // subadmin/industry/courses-add {body: industry:id,courses: [1,2,3], reference: ['ref', 'ref] }
    requestToAddCoursesToIndustry: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/industry/courses-add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RequestToAddCourse'],
    }),

    addPrevCourseDescription: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/industry/course/add-info`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RequestToAddCourse', 'SubAdminIndustries'],
    }),
    getIndustryRequestedCourses: builder.query<any, any>({
        query: ({ id, params }) => ({
            url: `industries/${id}/course-requests`,
            params,
        }),
        providesTags: ['RequestToAddCourse'],
    }),

    getIndustryCoursesOnAcceptance: builder.query<any, any>({
        query: ({ id, params }) => ({
            url: `industries/${id}/approval-requests`,
            params,
        }),
        providesTags: ['RequestToAddCourse'],
    }),

    getPreviousIndustryCourses: builder.query<any, any>({
        query: (id) => ({
            url: `industries/${id}/courses`,
        }),
        providesTags: ['SubAdminIndustries', 'Industries'],
    }),

    uploadCourseDocForIndustry: builder.mutation<any, any>({
        query: ({ id, body }) => ({
            url: `${PREFIX}/industry-course/${id}/upload-document`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['SubAdminIndustries', 'Industries'],
    }),

    getRejectedDepartmentIndustry: builder.query<any, any>({
        query: (params) => ({
            url: `department/rejected-list`,
            params,
        }),
        providesTags: ['SubAdminIndustries', 'Industries'],
    }),
    getRejectedDepartmentIndustryCount: builder.query<any, void>({
        query: () => ({
            url: `department/rejected-count`,
        }),
        providesTags: ['SubAdminIndustries', 'Industries'],
    }),
    getPendingDepartmentIndustryCount: builder.query<any, void>({
        query: () => ({
            url: `department/pending-count`,
        }),
        providesTags: ['SubAdminIndustries', 'Industries'],
    }),
    getSectorBasedCapacity: builder.query<any, any>({
        query: (id) => ({
            url: `${PREFIX}/industry/${id}/sector-capacity/get`,
        }),
        providesTags: ['SubAdminIndustries', 'Industries'],
    }),

    updateSectorBaseCapacity: builder.mutation<any, any>({
        query: ({ id, body }) => ({
            url: `${PREFIX}/sector-capacity/${id}/update`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['SubAdminIndustries', 'Industries'],
    }),
    updateOldCapacityToSectorBase: builder.mutation<any, any>({
        query: ({ id, body }) => ({
            url: `${PREFIX}/industry/${id}/sector-capacity/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['SubAdminIndustries', 'Industries'],
    }),

    removePartnerIndustryRequest: builder.query<any, PaginationWithSearch>({
        query: (params) => ({
            url: `${PREFIX}/industry/partner-removal-requests`,
            params,
        }),
        providesTags: ['SubAdminIndustries', 'Industries'],
    }),

    updatePartnerRemovalRequestStatus: builder.mutation<any, any>({
        query: ({ id, status }) => ({
            url: `${PREFIX}/industry/partner-removal-request/${id}/update-status`,
            method: 'PATCH',
            params: { status },
        }),
        invalidatesTags: ['SubAdminIndustries', 'Industries'],
    }),

    removalRequestCount: builder.query<any, void>({
        query: () => `${PREFIX}/industry/partner-removal-counts`,
        providesTags: ['SubAdminIndustries', 'Industries'],
    }),
    generateDescription: builder.mutation<any, any>({
        query: ({ indId, courseId }) => ({
            url: `${PREFIX}/industry/${indId}/course/${courseId}/description/update`,
            method: 'PATCH',
        }),
        invalidatesTags: ['RequestToAddCourse', 'SubAdminCourses'],
    }),
    addHodNote: builder.mutation<any, { id: number; comment: string }>({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}/course-approval-request/${id}/hod-comment/add`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['RequestToAddCourse', 'SubAdminCourses'],
    }),

    getAllSubAdminIndustriesList: builder.query<
        PaginatedResponse<Industry>,
        PaginationWithSearch
    >({
        query: (params) => ({
            url: `${PREFIX}/assigned/industries/list`,
            params,
        }),
        providesTags: ['SubAdminIndustries'],
    }),

    getAllStateWiseSubAdminIndustriesList: builder.query<
        PaginatedResponse<Industry>,
        PaginationWithSearch
    >({
        query: (params) => ({
            url: `${PREFIX}/assigned/industries/list/by-state`,
            params,
        }),
        providesTags: ['SubAdminIndustries'],
    }),

    getAllSubAdminIndustriesCount: builder.query<
        {
            partnerIndustries: number
            nonPartnerIndustries: number
            pendingCourseApprovals: number
            monthlyCalled: number
            snoozedIndustries: number
            blockedIndustries: number
            archivedIndustries: number
            rejectedIndustries: number
        },
        void
    >({
        query: () => ({
            url: `${PREFIX}/assigned/industries/count`,
        }),
        providesTags: ['SubAdminIndustries'],
    }),
})
