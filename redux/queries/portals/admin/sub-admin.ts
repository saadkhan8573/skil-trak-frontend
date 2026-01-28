import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import {
    Course,
    PaginatedResponse,
    PaginationValues,
    PaginationWithSearch,
    Rto,
    SubAdmin,
    SubAdminProfileCount,
    SubadminCount,
    SubadminFromType,
    ViewSummaryType,
} from '@types'

const PREFIX = 'admin'
export const subAdminEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    createSubAdmin: builder.mutation<SubAdmin, SubadminFromType>({
        query: (body) => ({
            url: `${PREFIX}/subadmin/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['SubAdmins'],
    }),

    updateSubAdmin: builder.mutation<
        SubAdmin,
        { id: number; userId: number; body: SubadminFromType }
    >({
        query: ({ id, userId, body }) => ({
            url: `${PREFIX}/subadmin/update/${id}/${userId}`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['SubAdmins'],
    }),

    subAdmins: builder.query<
        PaginatedResponse<SubAdmin>,
        PaginationWithSearch | undefined
    >({
        query: (params) => ({
            url: `${PREFIX}/subadmin/list`,
            params,
        }),
        providesTags: ['SubAdmins'],
    }),

    subAdminsFilterList: builder.query<SubAdmin[], void>({
        query: () => `${PREFIX}/coordinator/list-all`,
        providesTags: ['SubAdmins'],
    }),
    subAdminAsAdminList: builder.query<any, void>({
        query: () => ({
            url: `${PREFIX}/can-admin/list`,
        }),
        providesTags: ['SubAdmins'],
    }),
    subAdminExtendedStudentsList: builder.query<
        any,
        PaginationValues & {
            id: number
        }
    >({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/subadmin/${id}/get/extended`,
            params,
        }),
        providesTags: ['SubAdmins'],
    }),

    subAdminProfile: builder.query<SubAdmin, number>({
        query: (id) => `${PREFIX}/subadmin/profile/${id}`,
        providesTags: ['SubAdmins'],
    }),

    subadminWorkplaceList: builder.query<
        any,
        PaginationValues & {
            id: number
            status?: string
        }
    >({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/subadmin/${id}/workplace-request/list`,
            params,
        }),
        providesTags: ['SubAdmins'],
    }),

    subAdminCount: builder.query<SubadminCount, void>({
        query: () => `${PREFIX}/subadmin/list/count`,
        providesTags: ['SubAdmins'],
    }),

    subAdminProfileCount: builder.query<SubAdminProfileCount, number>({
        query: (id) => ({
            url: `subadmin/dashboard/count`,
            params: { user: id },
        }),
        providesTags: ['SubAdmins'],
    }),

    subAdminCourses: builder.query<Course[], number>({
        query: (id) => `${PREFIX}/subadmin/${id}/courses`,
        providesTags: ['SubAdmins', 'Rto-Coordinators'],
    }),
    coordinatorRatingsList: builder.query<any, any>({
        query: ({ id, params }) => ({
            url: `rating/for-subadmin/${id}`,
            params,
        }),
        providesTags: ['SubAdmins'],
    }),
    coordinatorOverallRating: builder.query<any, any>({
        query: (id) => `rating/for-subadmin/${id}/over-all`,
        providesTags: ['SubAdmins'],
    }),

    subAdminAssignCourses: builder.mutation<
        SubAdmin,
        { subadmin: number; courses: number[] }
    >({
        query: (body) => ({
            url: `${PREFIX}/subadmin/assign-course`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['SubAdmins', 'Rto-Coordinators'],
    }),

    associatedWithRto: builder.mutation<
        SubAdmin,
        { id: number; rtoId: number }
    >({
        query: ({ id, rtoId }) => ({
            url: `${PREFIX}/coordinator/${id}/rto/${rtoId}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins', 'Rto-Coordinators'],
    }),
    removeWithRto: builder.mutation<SubAdmin, number>({
        query: (id) => ({
            url: `${PREFIX}/coordinator/${id}/working-with-update`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins', 'Rto-Coordinators'],
    }),

    subAdminUnAssignCourses: builder.mutation<
        SubAdmin,
        { id: number; courseId?: number; course?: number }
    >({
        query: (body) => ({
            url: `${PREFIX}/sub-admin/course/un-assign/${body.id}`,
            method: 'POST',
            params: { course: body.course },
        }),
        invalidatesTags: ['SubAdmins', 'Rto-Coordinators'],
    }),

    subAdminRtos: builder.query<Rto[], number>({
        query: (id) => `${PREFIX}/subadmin/${id}/rtos`,
        providesTags: ['SubAdmins'],
    }),

    subAdminAssignRto: builder.mutation<
        null,
        {
            subadmin: number
            rto: number
        }
    >({
        query: (body) => ({
            url: `${PREFIX}/subadmin/assignrto`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['SubAdmins'],
    }),

    subAdminUnassignRto: builder.mutation<
        { message: string },
        {
            id: number
            subAdmin: number
        }
    >({
        query: (body) => ({
            url: `${PREFIX}/rto/subadmin/remove/${body.id}`,
            params: { subadmin: body.subAdmin },
            method: 'DELETE',
            body,
        }),
        invalidatesTags: ['SubAdmins'],
    }),
    viewSummary: builder.query<ViewSummaryType, number>({
        query: (id) => `${PREFIX}/summary-report/generate/${id}`,
        providesTags: ['SubAdmins'],
    }),
    subadminRemove: builder.mutation<SubAdmin, number>({
        query: (id) => ({
            url: `${PREFIX}/user/remove/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['SubAdmins'],
    }),
    toggleAutoWorkplaceAssignment: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/auto-assignment/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['AutoAssignWorkplace'],
    }),
    toggleSubadminPlacement: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/toggle-listing/remove-on-placement-started/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins'],
    }),
    toggleWPCancelationRequest: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/subadmin/${id}/can-cancel-request/toggle`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins'],
    }),

    toggleCanAccessRTOProfile: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/subadmin/${id}/can-access/rto-profile/toggle`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins'],
    }),

    toggleCanDownloadReport: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/subadmin/${id}/can-download-report/toggle`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins'],
    }),

    toggleCanViewStudentDetail: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/subadmin/${id}/can-view-student/toggle`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins'],
    }),

    toggleCanViewIndustryDetail: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/subadmin/${id}/can-view-industry/toggle`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins'],
    }),

    toggleCanAccessRPLDetail: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/subadmin/${id}/can-access-rpl/toggle`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins'],
    }),

    toggleCanAccessTalentPool: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/subadmin/${id}/can-access-talent-pool/toggle`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins'],
    }),

    toggleCanAccessQueries: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/subadmin/${id}/can-access-queries/toggle`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins'],
    }),

    toggleCanAccessBlogs: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/subadmin/${id}/can-access-blogs/toggle`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins'],
    }),
    toggleCanAccessSubAdmins: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/subadmin/${id}/can-view-subadmin/toggle`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins'],
    }),
    toggleCanAddStudents: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/subadmin/${id}/can-add-students/toggle`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins'],
    }),
    toggleCanViewAllStudents: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/subadmin/${id}/can-view-students/toggle`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins'],
    }),
    toggleCanCreateInternalTicket: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/subadmin/${id}/can-create-internal/ticket`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins'],
    }),
    toggleCanViewRtoList: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/subadmin/${id}/can-view-rto/list`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins'],
    }),
    toggleCanGlobalSearch: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/subadmin/${id}/global-search-access/toggle`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins'],
    }),

    toggleIsManager: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/subadmin/${id}/toggle-manager-status`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins'],
    }),
    toggleRtoWpApproval: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/subadmin/${id}/allow-rto-workplace-approval`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins'],
    }),

    isTodoEnabled: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/subadmin/${id}/todo-enable`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins'],
    }),

    toggleIndustriesAssignment: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/subadmin/${id}/allow-industry-assignment`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins'],
    }),

    updateFavIndustries: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/subadmin/${id}/industries/redistribute`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins'],
    }),

    canApproveRtoWorkplace: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/subadmin/${id}/allow-workplace-approval`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins'],
    }),

    canImportIndustryListing: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/subadmin/${id}/can-import-industry-listing`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins'],
    }),

    canOnPremiumFeature: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/subadmin/${id}/can-on-premium-feature`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdmins'],
    }),
})
