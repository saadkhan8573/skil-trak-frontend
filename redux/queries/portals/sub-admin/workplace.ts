import { WorkplaceRequestWarningEnum } from '@partials/common/StudentProfileDetail/components'
import { WPApprovalStatus } from '@partials/student/workplace/components/WorkplaceApproval/enum'
import { providesTagsOnSuccess } from '@redux/utils'
import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import {
    PaginatedResponse,
    PaginationValues,
    PaginationWithSearch,
} from '@types'
import { WorkplaceCurrentStatus } from '@utils'

const PREFIX = 'subadmin/'
export const workplaceEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    workplaceCount: builder.query<any, void>({
        query: () => `${PREFIX}workplace-request/count`,
        providesTags: ['SubAdminWorkplace'],
    }),
    getSubAdminWorkplaces: builder.query<any, PaginationWithSearch>({
        query: (params) => ({
            url: `${PREFIX}workplace-request/list`,
            params,
        }),
        providesTags: ['SubAdminWorkplace'],
    }),
    getSubAdminFilteredWorkplaces: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}workplace-request/filter`,
            params,
        }),
        providesTags: ['SubAdminWorkplace'],
    }),
    getAddedByStudentsWorkplaces: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}workplace-request/list/abn`,
            params,
        }),
        providesTags: ['SubAdminWorkplace'],
    }),
    blockedStudentsWorkplacesList: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}blocked/students/workplaces-list`,
            params,
        }),
        providesTags: ['SubAdminWorkplace'],
    }),
    getMyStudentsWorkplaces: builder.query<any, PaginationValues>({
        query: (params) => ({
            url: `${PREFIX}my-workplace-request/list`,
            params,
        }),
        providesTags: ['SubAdminWorkplace'],
    }),
    getPlacementStartedWorkplaces: builder.query<
        any,
        PaginationValues & { status?: WorkplaceCurrentStatus }
    >({
        query: (params) => ({
            url: `${PREFIX}my-workplace-request/placement-started/list`,
            params,
        }),
        providesTags: ['SubAdminWorkplace'],
    }),
    assignToSubAdmin: builder.mutation<
        any,
        { industry: number; id: number; subAdmin?: number; comment: string }
    >({
        query: ({ comment, ...params }) => ({
            url: `${PREFIX}assign-workplace-request`,
            params,
            body: { comment },
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdminWorkplace', 'Notes'],
    }),

    usAssignSubAdmin: builder.mutation<any, number>({
        query: (workplaceId) => ({
            url: `${PREFIX}un-assign/workplace-request/${workplaceId}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdminWorkplace'],
    }),
    sendInterviewNotification: builder.mutation<
        any,
        { workIndustry: number; workplace: number }
    >({
        query: (params) => ({
            url: `${PREFIX}interview-case-officer`,
            params,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdminWorkplace', 'SubAdminStudents', 'Students'],
    }),
    sendMeetingNotification: builder.mutation<
        any,
        { workplace: number; workIndustry: number }
    >({
        query: (params) => ({
            url: `${PREFIX}workplace-request/book-appointment`,
            params,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdminWorkplace', 'SubAdminStudents', 'Students'],
    }),
    forwardWorkplaceToIndustry: builder.mutation({
        query: ({ industryId, id }) => ({
            url: `${PREFIX}forward-industry-request/${industryId}/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdminWorkplace'],
    }),
    industryResponse: builder.mutation({
        query: ({ status, industryId }) => ({
            url: `${PREFIX}industry-response/${industryId}`,
            method: 'PATCH',
            body: { status },
        }),
        invalidatesTags: ['SubAdminWorkplace'],
    }),
    agrementSign: builder.mutation({
        query: ({ course, studentId, appliedIndustryId, body }) => ({
            url: `${PREFIX}sign/agreement/${appliedIndustryId}`,
            method: 'POST',
            params: { std: studentId, course },
            body,
        }),
        invalidatesTags: ['SubAdminWorkplace'],
    }),

    changeStatustoSigned: builder.mutation<any, number>({
        query: (wpId) => ({
            url: `${PREFIX}workplace/update/${wpId}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdminWorkplace'],
    }),

    startPlacement: builder.mutation({
        query: (id) => ({
            url: `${PREFIX}workplace-started/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdminWorkplace'],
    }),

    terminatePlacement: builder.mutation({
        query: (id) => ({
            url: `${PREFIX}terminate-workplace-request/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdminWorkplace'],
    }),
    completePlacement: builder.mutation({
        query: (id) => ({
            url: `${PREFIX}complete-workplace-request/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdminWorkplace'],
    }),
    addWorkplaceNote: builder.mutation({
        query: (body) => ({
            url: `${PREFIX}workplace-request/note/add`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['SubAdminWorkplace'],
    }),
    getWorkplaceFolders: builder.query<any, any>({
        query: ({ workplaceId, appliedIndustryId, courseId }) =>
            `${PREFIX}workplace-request/docs/${workplaceId}/${appliedIndustryId}/${courseId}`,
        providesTags: ['SubAdminWorkplace'],
    }),
    getCancelledWorkplaces: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}cancelled-workplace-request/list`,
            params,
        }),
        providesTags: ['SubAdminWorkplace'],
    }),
    subadminWpCancellationRequestsList: builder.query<
        PaginatedResponse<any>,
        PaginationWithSearch
    >({
        query: (params) => ({
            url: `${PREFIX}get/workplace-cancelation/requests/list`,
            params,
        }),
        providesTags: ['SubAdminWorkplace'],
    }),
    cancelWorkplaceStatus: builder.mutation<
        any,
        { id: number; comment: string }
    >({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}student/workplace/update/${id}`,
            body,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdminWorkplace', 'Notes'],
    }),
    cancelRequestWorkplace: builder.mutation<
        any,
        { id: number; comment: string }
    >({
        query: ({ id, comment }) => ({
            url: `${PREFIX}workplace-request/${id}/request-for-cancel`,
            body: { comment },
            method: 'POST',
        }),
        invalidatesTags: ['SubAdminWorkplace'],
    }),

    updateWorkplaceStatus: builder.mutation<
        any,
        { id: number; response: string }
    >({
        query: ({ id, response }) => ({
            url: `${PREFIX}workplace-request/industry-response/${id}`,
            params: { response },
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdminWorkplace'],
    }),
    updateWorkplaceIndustryStatus: builder.mutation<
        any,
        { id: number; status: string; comment?: string }
    >({
        query: ({ id, comment, ...params }) => ({
            // url: `students/workplace-requests/${id}/response/add`,
            url: `students/workplace-requests/${id}/update/status`,
            params,
            body: { comment },
            method: 'POST',
        }),
        invalidatesTags: providesTagsOnSuccess([
            'SubAdminWorkplace',
            'SubAdminStudents',
            'IndustryWorkplace',
            'RTOIndustries',
            'WaitingForStudents',
            'StudentsWorkplace',
        ]),
    }),

    updateWorkplaceIndustryStatusFromEmail: builder.mutation<
        any,
        { id: number; status: string; comment?: string }
    >({
        query: ({ id, comment, ...params }) => ({
            url: `students/workplace-requests/${id}/response/add`,
            params,
            body: { comment },
            method: 'POST',
        }),
        invalidatesTags: providesTagsOnSuccess([
            'SubAdminWorkplace',
            'SubAdminStudents',
            'IndustryWorkplace',
            'RTOIndustries',
            'WaitingForStudents',
        ]),
    }),

    updateWpAppliedIndustry: builder.mutation<any, number>({
        query: (id) => ({
            url: `students/workplace-requests/${id}/update`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdminWorkplace', 'SubAdminStudents'],
    }),
    checkIsIndustryPerformedAction: builder.query<
        any,
        { wpId: number; wiId: number }
    >({
        query: ({ wpId, wiId }) =>
            `students/workplace-requests/${wpId}/awaiting-workplace-request/${wiId}/get`,
        providesTags: ['IndustryResponseAdded'],
    }),
    approveStudentFromIndustry: builder.query<
        any,
        { wpr: number; wiId: number; status: 'accept' }
    >({
        query: (params) => ({
            url: `students/workplace-requests/api/v1/response/action`,
            params,
        }),
        providesTags: ['IndustryResponseAdded'],
    }),

    subAdminApplyStudentWorkplace: builder.mutation<
        any,
        { industry: number; id: number }
    >({
        query: ({ industry, id }) => ({
            url: `${PREFIX}apply-industry-request/${industry}/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdminWorkplace'],
    }),
    showExistingIndustries: builder.query<any, void>({
        query: () => `${PREFIX}course-industries/list`,
        providesTags: ['SubAdminWorkplace'],
    }),
    addExistingIndustries: builder.mutation<any, any>({
        query: ({ workplaceId, industryId, branch, type, ...body }) => ({
            url: `${PREFIX}industry/select/${workplaceId}/${industryId}`,
            method: 'POST',
            params: { type, branch }, // send `type` only if it exists
            body, // send the rest in body
        }),
        invalidatesTags: ['SubAdminWorkplace'],
    }),
    assignSubadminWorkplaceCourse: builder.mutation<any, any>({
        query: ({ workplaceId, courseId }) => ({
            url: `${PREFIX}workplace-request/assign-course/${workplaceId}/${courseId}`,
            method: 'POST',
        }),
        invalidatesTags: ['Workplaces'],
    }),
    addCustomIndustry: builder.mutation<any, any>({
        query: ({ id, body }) => ({
            url: `${PREFIX}custom-industry/add/${id}`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['SubAdminWorkplace'],
    }),
    changeCustomIndustryStatus: builder.mutation<any, any>({
        query: ({ industryId, status, workplaceId }) => ({
            url: `${PREFIX}custom-workplace-request/action/${industryId}/${workplaceId}`,
            method: 'PATCH',
            params: { status },
        }),
        invalidatesTags: ['SubAdminWorkplace'],
    }),
    removeAppliedIndustry: builder.mutation<
        any,
        { workplaceIndustryId: number; studentId: number }
    >({
        query: ({ workplaceIndustryId, studentId }) => ({
            url: `${PREFIX}workplace-request/remove/work-industry/${workplaceIndustryId}/${studentId}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['SubAdminWorkplace'],
    }),
    removeAppliedIndustryFromWorkplace: builder.mutation<
        any,
        { workplaceIndustryId: number; studentId: number }
    >({
        query: ({ workplaceIndustryId, studentId }) => ({
            url: `${PREFIX}workplace-request/remove/work-industry/${workplaceIndustryId}/${studentId}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['SubAdminWorkplace'],
    }),
    viewMoreIndustries: builder.query<any, number>({
        query: (workplaceId) =>
            `students/workplace-requests/other/find-industry/${workplaceId}`,
        providesTags: ['SubAdminWorkplace'],
    }),
    findSuggestedIndustries: builder.query<any, any>({
        query: (params) => ({
            url: `shared/industries/search`,
            params,
        }),
        providesTags: ['SubAdminWorkplace'],
    }),
    getStudentWorkplaceAvailability: builder.query<any, number>({
        query: (wpId) =>
            `students/workplace-requests/${wpId}/get/general-availability`,
        providesTags: ['SubAdminWorkplace'],
    }),
    getStudentWorkplaceAnswers: builder.query<any, number>({
        query: (wpId) => `students/workplace-requests/${wpId}/get/questions`,
        providesTags: ['SubAdminWorkplace'],
    }),
    getStudentWorkplacePlacementAnswers: builder.query<any, number>({
        query: (wpId) => `students/workplace-requests/${wpId}/get-feedback`,
        providesTags: ['SubAdminWorkplace'],
    }),
    // Suggested Industries show on map
    getSubAdminMapSuggestedIndustryDetail: builder.query<
        any,
        { industryId: number; workplaceId?: number }
    >({
        query: ({ industryId, ...params }) => ({
            url: `industries/industry/${industryId}/detail/for-map`,
            params,
        }),
        providesTags: ['SubAdminWorkplace', 'Mails'],
    }),
    getSubAdminMapIndustryBranchDetail: builder.query<any, any>({
        query: (arg) => {
            let id: string | number | undefined
            let params: Record<string, any> | undefined

            if (typeof arg === 'string' || typeof arg === 'number') {
                // case 1: only id passed
                id = arg
            } else if (arg && typeof arg === 'object') {
                // case 2: object with id + params
                id = arg.id
                params = arg.params
            }

            return {
                url: `industries/location/${id}/find-details`,
                params,
            }
        },
        providesTags: ['SubAdminWorkplace', 'SubAdminIndustries'],
    }),

    getWorkplaceCourseIndustries: builder.query<any, any>({
        query: ({ id, wpId, params = {} }) => ({
            url: `subadmin/course/${id}/list/industries/${wpId}`,
            params,
        }),
        providesTags: [
            'SubAdminWorkplace',
            'SubAdminIndustries',
            'Industries',
            'SubAdminStudents',
        ],
    }),
    // course/:id/workplace-request/:wpId/listing/list
    getWorkplaceListedIndustries: builder.query<any, any>({
        query: ({ id, wpId, params = {} }) => ({
            url: `subadmin/course/${id}/workplace-request/${wpId}/listing/list`,
            params,
        }),
        providesTags: [
            'SubAdminWorkplace',
            'SubAdminIndustries',
            'Industries',
            'SubAdminStudents',
        ],
    }),

    getMapIndustriesInRadiusCount: builder.query<any, any>({
        query: ({ id, wpId }) =>
            `subadmin/course/${id}/list/industries/${wpId}/count`,
        providesTags: ['SubAdminWorkplace', 'SubAdminIndustries'],
    }),

    changeWorkplaceApprovalReqStatus: builder.mutation<
        any,
        { id: number; body?: any; status: WPApprovalStatus }
    >({
        query: ({ id, body, ...params }) => ({
            url: `${PREFIX}industry/approve/${id}`,
            method: 'PATCH',
            params,
            body,
        }),
        invalidatesTags: ['Workplace'],
    }),

    contactWorkplaceIndustry: builder.mutation<
        any,
        {
            studentId: number
            wpId: number
            industryId?: number
            isListing?: boolean
            branchId?: number
        }
    >({
        query: ({ studentId, wpId, ...params }) => ({
            url: `${PREFIX}students/${studentId}/workplace-requests/${wpId}`,
            method: 'POST',
            params,
        }),
        invalidatesTags: ['Workplace'],
    }),

    removeWorkplaceRequestApproval: builder.mutation<any, number>({
        query: (id) => ({
            url: `students/workplace-requests/approval/${id}/delete`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Workplace'],
    }),

    getWarningPlacementAndInsuranceDocNote: builder.query<
        any,
        {
            industryId: number
            workplaceId: number
            type: WorkplaceRequestWarningEnum
        }
    >({
        query: ({ workplaceId, industryId, ...params }) => ({
            url: `${PREFIX}find-existing/warning-note/${workplaceId}/${industryId}`,
            params,
        }),
        providesTags: ['SubAdminWorkplace'],
    }),
    // subadmin/rto/workplace-approval/pending/list
    getRtoWpApprovalRequestPendingList: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}rto/workplace-approval/pending/list`,
            params,
        }),
        providesTags: ['Workplace'],
    }),
    // subadmin/rto/workplace-approval/list
    getRtoWpApprovalRequestApprovedList: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}rto/workplace-approval/list`,
            params,
        }),
        providesTags: ['Workplace'],
    }),
    // subadmin/rto/workplace-approval/count
    getRtoWpApprovalRequestCount: builder.query<any, void>({
        query: (params) => ({
            url: `${PREFIX}rto/workplace-approval/count`,
            params,
        }),
        providesTags: ['Workplace'],
    }),
})
