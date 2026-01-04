import { BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import {
    Industry,
    IndustryCourseApproval,
    IndustryInterviewAvailability,
    PaginatedResponse,
    PaginationWithSearch,
    Student,
    UserStatus,
} from '@types'

const PREFIX = 'rtos/'
const INDUSTRIESPREFIX = 'industries/'
export const industriesEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    addSingleRtoIndustry: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}industry/create`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RTOIndustries'],
    }),
    createAvailability: builder.mutation<any, any>({
        query: ({ userId, ...body }) => ({
            url: `${INDUSTRIESPREFIX}availability/create`,
            method: 'POST',
            params: { userId },
            body,
        }),
        invalidatesTags: ['RTOIndustries'],
    }),
    addBulkRtoIndustries: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}industry/bulk-create`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RTOIndustries'],
    }),

    getRtoIndustries: builder.query<
        PaginatedResponse<Industry>,
        PaginationWithSearch
    >({
        query: (params) => ({
            url: `${PREFIX}industries/list-all`,
            params,
        }),
        providesTags: ['RTOIndustries'],
    }),

    getPedingCourseApprovalIndustries: builder.query<
        PaginatedResponse<Industry>,
        PaginationWithSearch
    >({
        query: (params) => ({
            url: `${INDUSTRIESPREFIX}course-approval/requests/list`,
            params,
        }),
        providesTags: ['RTOIndustries'],
    }),

    getIndustriesCounts: builder.query<
        {
            active: number
            pending: number
            allIndustries: number
            partnerIndustries: number
            allPartnerIndustries: number
            nonPartnerIndustries: number
            readyForPlacementIndustries: number
            skiltrakIndustriesReadyForPlacement: number
        },
        void
    >({
        query: () => ({
            url: `${PREFIX}industries/count`,
        }),
        providesTags: ['RTOIndustries'],
    }),

    getRtoIndustryDetail: builder.query<Industry, number>({
        query: (id) => ({
            url: `${INDUSTRIESPREFIX}${id}/get-details`,
        }),
        providesTags: ['RTOIndustries', 'Industry'],
    }),

    getRtoIndustryDataCount: builder.query<
        {
            coursesCount: number
            totalStudents: number
            pending: number
            interview: number
            overAllRating: number
            totalEnrolledStudents: number
            totalSectorCapacity: number
        },
        number
    >({
        query: (id) => ({
            url: `${INDUSTRIESPREFIX}${id}/data-count`,
        }),
        providesTags: ['RTOIndustries'],
    }),

    snoozeIndustryById: builder.mutation<
        any,
        { id: number; startDate?: Date; endDate?: Date }
    >({
        query: ({ id, ...body }) => ({
            url: `${INDUSTRIESPREFIX}${id}/snooze`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['RTOIndustries'],
    }),

    industryUserStatusChange: builder.mutation<
        any,
        { id: number; status: UserStatus }
    >({
        query: ({ id, status }) => ({
            url: `${INDUSTRIESPREFIX}${id}/user-status-update`,
            method: 'PATCH',
            params: { status },
        }),
        invalidatesTags: ['RTOIndustries'],
    }),

    getIndutryAvailableWorkingHours: builder.query<any, number>({
        query: (id) => ({
            url: `${INDUSTRIESPREFIX}working-hours/list`,
            params: { userId: id },
        }),
        providesTags: ['RTOIndustries'],
    }),

    industryStudentsList: builder.query<
        PaginatedResponse<Student>,
        { params: PaginationWithSearch; industryId: number; sectorId: number }
    >({
        query: ({ params, industryId, sectorId }) => ({
            url: `${INDUSTRIESPREFIX}${industryId}/sector/${sectorId}/students-list`,
            params,
        }),
        providesTags: ['RTOIndustries'],
    }),

    industryStudentStats: builder.query<
        {
            totalStudents: number
            completedStudents: number
            inProgress: number
            pending: number
        },
        { industryId: number; sectorId: number }
    >({
        query: ({ industryId, sectorId }) =>
            `${INDUSTRIESPREFIX}${industryId}/sector/${sectorId}/students-count`,
        providesTags: ['RTOIndustries'],
    }),

    industryCoursesDetails: builder.query<
        IndustryCourseApproval[],
        { userId?: number }
    >({
        query: (params) => ({
            url: `${INDUSTRIESPREFIX}courses-details`,
            params,
        }),
        providesTags: ['RTOIndustries'],
    }),

    industryRtoChecklistList: builder.query<
        any,
        { industryId: number; sectorId: number }
    >({
        query: ({ industryId, sectorId }) =>
            `${INDUSTRIESPREFIX}${industryId}/sector/${sectorId}/facility-checklist`,
        providesTags: ['RTOIndustries'],
    }),

    // Industry Courses
    statusChangeCourseFacilityChecklist: builder.mutation<
        any,
        { id: number; status: 'approved' | 'rejected' }
    >({
        query: (params) => ({
            url: `department/course-request-industry/status`,
            method: 'PATCH',
            params,
        }),
        invalidatesTags: ['RTOIndustries'],
    }),

    uploadCourseFacilityChecklist: builder.mutation<
        any,
        { id: number; body: FormData }
    >({
        query: ({ id, body }) => ({
            url: `${INDUSTRIESPREFIX}course-approval/${id}/file/add`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['RTOIndustries', 'RTOCourses'],
    }),

    getAllIndustriesList: builder.query<any, PaginationWithSearch>({
        query: (params) => ({
            url: `${PREFIX}industries`,
            params,
        }),
        providesTags: ['RTOIndustries'],
    }),
    getIndustryAvailabilityV2: builder.query<
        IndustryInterviewAvailability,
        number
    >({
        query: (id) => ({
            url: `students/workplace-requests/workplace/${id}/interview-availability/get`,
        }),
        providesTags: ['RTOIndustries'],
    }),

    updateInterestedType: builder.mutation<
        any,
        { industryId: number; status: 'interested' | 'notInterested' }
    >({
        query: ({ industryId, ...params }) => ({
            url: `${PREFIX}industry/${industryId}/update`,
            method: 'PATCH',
            params,
        }),
        invalidatesTags: ['RTOIndustries'],
    }),
    updateIndustryBio: builder.mutation<any, { id: number; bio: string }>({
        query: ({ id, ...body }) => ({
            url: `${INDUSTRIESPREFIX}${id}/bio/update`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['RTOIndustries', 'Industries'],
    }),

    getIndustryInitiatedESign: builder.query<
        any,
        { id: number; sectorId: number }
    >({
        query: ({ id, sectorId }) => ({
            url: `${INDUSTRIESPREFIX}${id}/sector/${sectorId}/document`,
        }),
        providesTags: ['RTOIndustries', 'Industries'],
    }),
    cancelIndustryInitiatedESign: builder.mutation<any, number>({
        query: (id) => ({
            url: `${INDUSTRIESPREFIX}document/${id}/cancel`,
            method: 'PATCH',
        }),
        invalidatesTags: ['RTOIndustries', 'Industries'],
    }),
    industryInfoMessage: builder.mutation<any, any>({
        query: (body) => ({
            url: `admin/industry-message/create`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['RTOIndustries'],
    }),
    getIndustryInfoMessages: builder.query<any, { userId: number }>({
        query: (params) => ({
            url: `industries/message/by-admin`,
            params,
        }),
        providesTags: ['RTOIndustries'],
    }),

    assignIndustryToCoordinator: builder.mutation<
        any,
        { id: number; subadminId: number }
    >({
        query: ({ id, subadminId }) => ({
            url: `${INDUSTRIESPREFIX}${id}/subadmin/${subadminId}/favoriteBy-update`,
            method: 'PATCH',
        }),
        invalidatesTags: ['RTOIndustries', 'Industry'],
    }),
})
