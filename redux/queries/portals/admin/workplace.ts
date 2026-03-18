import { CancelationRequestEnum } from '@partials/common/WpCancelationRequest/enum'
import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import {
    PaginatedResponse,
    PaginationValues,
    PaginationWithSearch,
    SubAdmin,
} from '@types'
import {
    AdminNeedWorkplaceCount,
    AdminWorkplaceCount,
    IWorkplaceIndustries,
} from '@redux/queryTypes'

const PREFIX = 'admin'
export const workplaceEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    workplacesCount: builder.query<AdminWorkplaceCount, void>({
        query: () => `${PREFIX}/workplace-request/count`,
        providesTags: ['Workplaces'],
    }),
    needWpCount: builder.query<
        AdminNeedWorkplaceCount,
        {
            depId: number | null
            snoozed: boolean
            nonContactable: boolean
            flagged: boolean
        }
    >({
        query: (params) => ({
            url: `${PREFIX}/need-workplaces/count`,
            params,
        }),
        providesTags: ['Workplaces'],
    }),
    filteredWorkplaces: builder.query<
        PaginatedResponse<IWorkplaceIndustries>,
        PaginationWithSearch
    >({
        query: (params) => ({
            url: `${PREFIX}/workplace-request/filter`,
            params,
        }),
        providesTags: ['Workplaces'],
    }),
    assignCourse: builder.mutation<
        IWorkplaceIndustries,
        { workplaceId: number; courseId: number }
    >({
        query: ({ workplaceId, courseId }) => ({
            url: `${PREFIX}/workplace-request/assign-course/${workplaceId}/${courseId}`,
            method: 'POST',
        }),
        invalidatesTags: ['Workplaces'],
    }),
    unAssignedSubAdmins: builder.query<IWorkplaceIndustries, SubAdmin>({
        query: (params) => ({
            url: `${PREFIX}/subadmin/list`,
            params,
        }),
        providesTags: ['Workplaces'],
    }),
    unAssignedWorkplaceList: builder.query<
        PaginatedResponse<IWorkplaceIndustries>,
        PaginationValues
    >({
        query: (params) => ({
            url: `${PREFIX}/workplace-request/unassigned/list`,
            params,
        }),
        providesTags: ['Workplaces'],
    }),
    allStudentProvidedWorkplaceList: builder.query<
        PaginatedResponse<IWorkplaceIndustries>,
        PaginationValues
    >({
        query: (params) => ({
            url: `${PREFIX}/workplace-request/provided-by-student/list`,
            params,
        }),
        providesTags: ['Workplaces'],
    }),
    allRequestedWorkplaceList: builder.query<
        PaginatedResponse<IWorkplaceIndustries>,
        PaginationWithSearch
    >({
        query: (params) => ({
            url: `${PREFIX}/workplace-request/requested/list`,
            params,
        }),
        providesTags: ['Workplaces'],
    }),
    placementStartedWorkplaceList: builder.query<
        PaginatedResponse<IWorkplaceIndustries>,
        PaginationValues
    >({
        query: (params) => ({
            url: `${PREFIX}/workplace-request/list/placement-started`,
            params,
        }),
        providesTags: ['Workplaces'],
    }),
    scheduleCompletedWorkplaceList: builder.query<
        PaginatedResponse<IWorkplaceIndustries>,
        PaginationValues
    >({
        query: (params) => ({
            url: `${PREFIX}/workplace-request/list/placement-completed`,
            params,
        }),
        providesTags: ['Workplaces'],
    }),
    blockedStudentsWorkplaceList: builder.query<
        PaginatedResponse<IWorkplaceIndustries>,
        PaginationValues
    >({
        query: (params) => ({
            url: `${PREFIX}/blocked/students/workplace-requests/list`,
            params,
        }),
        providesTags: ['Workplaces'],
    }),
    wpCancellationRequestsList: builder.query<
        PaginatedResponse<any>,
        PaginationWithSearch
    >({
        query: (params) => ({
            url: `${PREFIX}/get/workplace-cancelation/requests/list`,
            params,
        }),
        providesTags: ['Workplaces'],
    }),
    wpTerminationRequestsList: builder.query<
        PaginatedResponse<any>,
        PaginationWithSearch
    >({
        query: (params) => ({
            url: `${PREFIX}/partially-terminated/workplaces-list`,
            params,
        }),
        providesTags: ['Workplaces'],
    }),
    industryRejectedWpList: builder.query<
        PaginatedResponse<any>,
        PaginationWithSearch
    >({
        query: (params) => ({
            url: `${PREFIX}/pending/rejection-list`,
            params,
        }),
        providesTags: ['Workplaces'],
    }),
    changeStatusIndustryRejectedWpReq: builder.mutation<any, any>({
        query: ({ id, params }) => ({
            url: `students/workplace-requests/${id}/update/status`,
            method: 'PATCH',
            params,
        }),
        invalidatesTags: ['Workplaces'],
    }),
    wpRejectionList: builder.query<PaginatedResponse<any>, PaginationValues>({
        query: (params) => ({
            url: `students/workplace-requests/list/workplace/rejected`,
            params,
        }),
        providesTags: ['Workplaces'],
    }),
    cancelledWorkplaces: builder.query<
        PaginatedResponse<IWorkplaceIndustries>,
        PaginationValues
    >({
        query: (params) => ({
            url: `${PREFIX}/workplace-request/list/cancelled`,
            params,
        }),
        providesTags: ['Workplaces'],
    }),
    assignedRequestList: builder.query<
        PaginatedResponse<IWorkplaceIndustries>,
        PaginationValues
    >({
        query: (params) => ({
            url: `${PREFIX}/workplace-request/assigned/list`,
            params,
        }),
        providesTags: ['Workplaces'],
    }),
    assignedWorkplace: builder.mutation<
        PaginatedResponse<IWorkplaceIndustries>,
        { subadmin: number; workplace: number }
    >({
        query: (body) => ({
            url: `${PREFIX}/subadmin/assign-workplace`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Workplaces'],
    }),
    getSubadminForAssignWorkplace: builder.query<SubAdmin[], void>({
        query: () => `${PREFIX}/subadmin/workplace/list`,
        providesTags: ['Workplaces'],
    }),

    changeStatusForWPCancelationRequest: builder.mutation<
        PaginatedResponse<IWorkplaceIndustries>,
        { id: number; status: CancelationRequestEnum }
    >({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}/workplace-cancelation-request/${id}/update`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['Workplaces', 'RTO', 'StudentsWorkplace'],
    }),
    changeStatusForWPTerminationRequest: builder.mutation<
        PaginatedResponse<IWorkplaceIndustries>,
        { id: number; status: CancelationRequestEnum }
    >({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/workplace-request/${id}/terminate`,
            method: 'PATCH',
            params,
        }),
        invalidatesTags: ['Workplaces', 'RTO', 'StudentsWorkplace'],
    }),
})
