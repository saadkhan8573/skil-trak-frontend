import { NotesTemplateType } from '@partials/admin/noteTemplates/enum'
import { NotesTemplateStatus } from '@partials/common/Notes/forms'
import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { EndpointBuilder } from '@reduxjs/toolkit/query'
import {
    PaginatedResponse,
    PaginationValues,
    PaginationWithSearch,
    ProvideIndustryDetail,
    Student,
    StudentStatusEnum,
    UserStatus,
    WorkplaceTypes,
} from '@types'
import { IWorkplaceIndustries } from '@redux/queryTypes'
import { workplaceQuestionsKeys } from '@partials/common'

const PREFIX = 'subadmin'
export const studentsEndpoints = (
    builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
    subAdminStudentCount: builder.query<any, void>({
        query: () => `${PREFIX}/students/count`,
        providesTags: [
            'SubAdminStudents',
            'SubAdminWorkplace',
            'BulkUsersDelete',
            'BulkStatus',
        ],
    }),
    getSubAdminStudents: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/students/list-all`,
            params,
        }),
        providesTags: [
            'SubAdminStudents',
            'BulkUsersDelete',
            'BulkStatus',
            'Students',
        ],
    }),
    getSubAdminIncompleteSubmissionStudents: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/students/incomplete-submission/list`,
            params,
        }),
        providesTags: [
            'SubAdminStudents',
            'BulkUsersDelete',
            'BulkStatus',
            'Students',
        ],
    }),
    getSubAdminSnoozedStudents: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/snoozed/students/list`,
            params,
        }),
        providesTags: [
            'SubAdminStudents',
            'BulkUsersDelete',
            'BulkStatus',
            'Students',
        ],
    }),
    getSubAdminFlaggedStudents: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/students/reported/list`,
            params,
        }),
        providesTags: [
            'SubAdminStudents',
            'BulkUsersDelete',
            'BulkStatus',
            'Students',
        ],
    }),
    getRtoSubadminStudents: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/students/list-all`,
            params,
        }),
        providesTags: [
            'SubAdminStudents',
            'BulkUsersDelete',
            'BulkStatus',
            'Students',
        ],
    }),
    getSubAdminUrgentStudents: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/students/urgent/list`,
            params,
        }),
        providesTags: [
            'SubAdminStudents',
            'BulkUsersDelete',
            'BulkStatus',
            'Students',
        ],
    }),
    subadminCompletedStudents: builder.query<
        PaginatedResponse<Student>,
        PaginationValues
    >({
        query: (params) => ({
            url: `${PREFIX}/completed-students/list`,
            params,
        }),
        providesTags: ['Students', 'SubAdminStudents'],
    }),
    subadminStudentAssignCourses: builder.mutation({
        query: (body) => ({
            url: `admin/student/course/assign`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['SubAdminStudents'],
    }),

    subadminStudentUnassignCourses: builder.mutation<
        any,
        { id: number; courseId: number }
    >({
        query: (body) => ({
            url: `admin/student/course/delete/${body.courseId}`,
            params: { student: body.id },
            method: 'DELETE',
        }),
        invalidatesTags: ['SubAdminStudents'],
    }),

    subAdminFilteredStudents: builder.query<PaginatedResponse<any>, any>({
        query: (params: any) => ({
            url: `${PREFIX}/student-list/filter`,
            params,
        }),
        providesTags: ['SubAdminStudents'],
    }),

    getSubAdminMyStudents: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/my-students/list`,
            params,
        }),
        providesTags: ['SubAdminStudents'],
    }),
    getFavouriteIndustryStudents: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/students/placed/favorite-industries`,
            params,
        }),
        providesTags: ['SubAdminStudents'],
    }),
    getUpcomingAppointmentsStudents: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/students/appointment-list`,
            params,
        }),
        providesTags: ['SubAdminStudents'],
    }),

    myStudentsWeeklyCallsList: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/students/on-call-list`,
            params,
        }),
        providesTags: ['SubAdminStudents'],
    }),
    getSubAdminMyStudentsCallLog: builder.query<any, number>({
        query: (id) => `call-log/get/student/${id}/last`,
        providesTags: ['SubAdminStudents'],
    }),

    getRtoCoordinatorStudents: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/list-by/rto-coordinator`,
            params,
        }),
        providesTags: ['SubAdminStudents'],
    }),

    getSubAdminNonContactableStudents: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/students/list/not-contactable`,
            params,
        }),
        providesTags: ['SubAdminStudents'],
    }),

    getPlacementStartedStudents: builder.query<any, any>({
        query: (params) => ({
            url: `${PREFIX}/students/list/placement-started`,
            params,
        }),
        providesTags: ['SubAdminStudents'],
    }),

    updateSubAdminCourseDuration: builder.mutation<any, any | null>({
        query: ({ id, body }) => ({
            url: `${PREFIX}/student/course/timing/${id}`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['SubAdminStudents', 'SubAdminWorkplace'],
    }),

    setNotContactable: builder.mutation<any, { id: number; comment?: string }>({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}/student/update-not-contactable/${id}`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['SubAdminStudents', 'SubAdminWorkplace'],
    }),
    calledStudent: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/student/update-to-called/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdminStudents', 'SubAdminWorkplace'],
    }),

    getSubAdminStudentCourses: builder.query<any, number>({
        query: (id) => `${PREFIX}/student/course/list-result/${id}`,
        providesTags: ['SubAdminStudents', 'SubAdminWorkplace'],
    }),

    getSubAdminMyRto: builder.query<any, string>({
        query: (id) => ({
            url: `${PREFIX}/student/view/${id}`,
            params: { id },
        }),
        providesTags: ['SubAdminStudents', 'SubAdminWorkplace'],
    }),
    getSubAdminStudentDetail: builder.query<Student, number>({
        query: (id) => `${PREFIX}/student/view/${id}`,
        providesTags: [
            'Notes',
            'SubAdminStudents',
            'AllCommunications',
            'AssessmentEvidence',
            'SubAdminWorkplace',
        ],
    }),

    addLastVisitProfile: builder.query<Student, number>({
        query: (id) => `${PREFIX}/update/student/${id}/last-contacted-at`,
        providesTags: [
            'Notes',
            'SubAdminStudents',
            'AllCommunications',
            'AssessmentEvidence',
            'SubAdminWorkplace',
        ],
    }),

    getSubAdminStudentRtoDetail: builder.query<any, number>({
        query: (id) => `${PREFIX}/student/${id}/rto-details`,
        keepUnusedDataFor: 0,
        providesTags: [
            'Notes',
            'SubAdminStudents',
            'AllCommunications',
            'AssessmentEvidence',
            'SubAdminWorkplace',
        ],
    }),

    updateStudentDate: builder.mutation<
        any,
        { id: number; range: { startDate: Date; endDate: Date } }
    >({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}/update/student/${id}/data`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['SubAdminStudents', 'Notes', 'Mails'],
    }),

    getSubAdminStudentWorkplaceDetail: builder.query<any, number>({
        query: (id) => `${PREFIX}/workplace-request/view/${id}`,
        providesTags: [
            'Notes',
            'SubAdminStudents',
            'AllCommunications',
            'AssessmentEvidence',
            'SubAdminWorkplace',
        ],
    }),

    getWorkplaceIndustryDetail: builder.query<any, number>({
        query: (id) => `${PREFIX}/workplace-request/${id}/details`,
        providesTags: [
            'SubAdminStudents',
            'Notes',
            'AllCommunications',
            'AssessmentEvidence',
            'SubAdminWorkplace',
        ],
    }),

    getWorkplaceRequestLogs: builder.query<any, number>({
        query: (id) => `students/workplace-requests/${id}/logs-list`,
        providesTags: [
            'SubAdminStudents',
            'Notes',
            'AllCommunications',
            'AssessmentEvidence',
            'SubAdminWorkplace',
        ],
    }),

    rerunAutomation: builder.mutation<any, number>({
        query: (id) => ({
            url: `students/workplace-requests/${id}/refresh`,
            method: 'POST',
        }),
        invalidatesTags: ['SubAdminStudents', 'SubAdminWorkplace'],
    }),

    confirmWpCapacity: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/approval-request/${id}/confirm-capacity/workplace`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdminStudents', 'SubAdminWorkplace'],
    }),

    confirmWpCapacityThroughtEmail: builder.mutation<
        any,
        { courseId: number; wpApprovalId: number }
    >({
        query: ({ courseId, wpApprovalId }) => ({
            url: `students/workplace-requests/course/${courseId}/capacity-confirmation/${wpApprovalId}/send-email`,
            method: 'POST',
        }),
        invalidatesTags: ['SubAdminStudents', 'SubAdminWorkplace'],
    }),

    getWorkplaceStudentDetail: builder.query<any, number>({
        query: (id) => `${PREFIX}/workplace-request/${id}/student-details`,
        providesTags: [
            'SubAdminStudents',
            'Notes',
            'AllCommunications',
            'AssessmentEvidence',
            'SubAdminWorkplace',
        ],
    }),

    getWorkplaceForSchedule: builder.query<IWorkplaceIndustries[], number>({
        query: (id) => `${PREFIX}/student/${id}/industries`,
        providesTags: [
            'SubAdminStudents',
            'AllCommunications',
            'AssessmentEvidence',
            'SubAdminWorkplace',
        ],
    }),

    getSubAdminStudentWorkplace: builder.query<any, number>({
        query: (id) => `${PREFIX}/student/workplace-request/${id}`,
        providesTags: ['SubAdminStudents', 'SubAdminWorkplace'],
    }),

    getSubAdminStudentWorkplaceHistory: builder.query<any, { student: number }>(
        {
            query: ({ student }) =>
                `subadmin/activity-logger/view-by-object-id/${student}`,
            providesTags: ['SubAdminStudents', 'SubAdminWorkplace'],
        }
    ),

    assignStudentsToSubAdmin: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/student/assign-subadmin/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdminStudents'],
    }),
    subAdminRequestWorkplace: builder.mutation<any, any>({
        query: (body) => ({
            url: `students/workplace-requests`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['SubAdmin-Students', 'Notes'],
    }),
    createAutomatedWp: builder.mutation<any, any>({
        query: (body) => ({
            // url: `students/workplace-requests/automated/add`,
            url: `students/workplace-requests/automated/v2/create`,

            method: 'POST',
            body,
        }),
        invalidatesTags: ['SubAdmin-Students', 'Notes'],
    }),

    subAdminRequestIndustryWorkplace: builder.mutation<any, any>({
        query: (id) => ({
            url: `${PREFIX}/student/workplace-request/apply/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdminStudents', 'SubAdminWorkplace'],
    }),

    updateWorkplaceCourse: builder.mutation<
        any,
        { wpId: number; courseId: number }
    >({
        query: ({ wpId, courseId }) => ({
            url: `admin/workplace/${wpId}/course/update`,
            method: 'PATCH',
            params: { courseId },
        }),
        invalidatesTags: ['SubAdminStudents', 'SubAdminWorkplace'],
    }),

    subAdminCancelStudentWorkplaceRequest: builder.mutation<any, any>({
        query: (id) => ({
            url: `${PREFIX}/student/workplace-request/cancel/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdminStudents'],
    }),
    getStudentCancelledWP: builder.query<any, any>({
        query: (id) =>
            `${PREFIX}/student/${id}/workplace-request/get/cancelled`,
        providesTags: ['SubAdminStudents'],
    }),

    getAllStudentCancelledWorkplaces: builder.query<any, any>({
        query: (id) => `${PREFIX}/student/${id}/cancelled-workplace-requests`,
        providesTags: ['SubAdminStudents'],
    }),

    getStudentCallLog: builder.query<any, number>({
        query: (studentId) => ({
            url: `call-log`,
            params: { studentId },
        }),
        providesTags: ['SubAdminStudents'],
    }),

    getSingleStudentCallLog: builder.query<any, number>({
        query: (id) => `${PREFIX}/student/${id}/view-call/log`,
        providesTags: ['SubAdminStudents'],
    }),
    getStudentPreferredCallTime: builder.query<
        {
            id: number
            isActive: boolean
            createdAt: string
            updatedAt: string
            question: string
            answer: string
            type: workplaceQuestionsKeys
        }[],
        number
    >({
        query: (id) => `${PREFIX}/student/${id}/question/get`,
        providesTags: ['SubAdminStudents'],
    }),

    studentCallLog: builder.mutation<any, { student: number }>({
        query: (body) => ({
            url: `call-log`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['SubAdminStudents'],
    }),

    studentAnsweredCall: builder.mutation<any, any>({
        query: ({ id, status, isListing, body }) => ({
            url: `call-log/action/answered/${id}`,
            method: 'PATCH',
            params: { status, ...(isListing !== undefined && { isListing }) },
            body,
        }),
        invalidatesTags: [
            'SubAdminStudents',
            'Industries',
            'SubAdminIndustries',
            'SubAdminWorkplace',
        ],
    }),

    getRequiredDocs: builder.query<any, any>({
        query: ({ id, course, user }) => ({
            url: `${PREFIX}/student/required-document/${id}`,
            params: { course, user },
        }),
        providesTags: ['SubAdminStudents', 'SubAdminWorkplace'],
    }),

    getRequiredFolders: builder.query<
        any,
        { courseId: number; industryId: number }
    >({
        query: ({ courseId, industryId }) =>
            `${PREFIX}/student/required-document/${courseId}/${industryId}`,
        providesTags: [
            'SubAdminStudents',
            'IndustryWorkplace',
            'SubAdminWorkplace',
        ],
    }),

    addCourseStartEndDate: builder.mutation<
        any,
        {
            courseId: number
            startTime: Date
            endTime: Date
            studentId: number
        }
    >({
        query: ({ courseId, startTime, endTime, studentId }) => ({
            url: `${PREFIX}/student/course-hours/${studentId}`,
            method: 'POST',
            body: {
                course: courseId,
                startDate: startTime,
                endDate: endTime,
            },
        }),

        invalidatesTags: [
            'SubAdminStudents',
            'IndustryWorkplace',
            'SubAdminWorkplace',
        ],
    }),

    updateCourseStartEndDate: builder.mutation<
        any,
        {
            id: number
            startTime: Date
            endTime: Date
        }
    >({
        query: ({ id, startTime, endTime }) => ({
            url: `${PREFIX}/student/course-hours/update/${id}`,
            method: 'PATCH',
            body: {
                startDate: startTime,
                endDate: endTime,
            },
        }),

        invalidatesTags: [
            'SubAdminStudents',
            'IndustryWorkplace',
            'SubAdminWorkplace',
        ],
    }),

    getRequiredDocsResponse: builder.query<
        any,
        { selectedFolderId: number; studentId: number }
    >({
        query: ({ selectedFolderId, studentId }) =>
            `${PREFIX}/student/document-response/${selectedFolderId}/${studentId}`,
        providesTags: [
            'SubAdminStudents',
            'IndustryWorkplace',
            'SubAdminWorkplace',
        ],
    }),

    uploadRequiredDocs: builder.mutation<any, any>({
        query: ({ id, workplaceId, user, body }) => ({
            url: `${PREFIX}/student/workplace/response`,
            method: 'POST',
            params: { docs: [id], wpId: workplaceId, student: user },
            body,
        }),
        invalidatesTags: ['SubAdminStudents'],
    }),

    // uploadIndustryChecks: builder.mutation<any, any>({
    //     query: ({ id, workplaceId, user, body }) => ({
    //         url: `${PREFIX}/workplace/response`,
    //         method: 'POST',
    //         params: { docs: [id], wpId: workplaceId, user },
    //         body,
    //     }),
    //     invalidatesTags: ['SubAdminStudents'],
    // }),

    findByAbnWorkplace: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/student/industry/find-by-abn`,
            method: 'POST',
            params: { abn: body },
        }),
        invalidatesTags: ['SubAdminStudents'],
    }),

    applyWorkplaceOnExistingIndustry: builder.mutation<
        any,
        {
            student: number
            IndustryId: number
            courseId: number
            location?: number
            document: number
            answer?: string
        }
    >({
        query: ({ IndustryId, ...params }) => ({
            url: `${PREFIX}/student/workplace/existing-industry/${IndustryId}`,
            method: 'POST',
            params,
        }),
        invalidatesTags: ['SubAdminStudents'],
    }),
    addCustomIndustyForWorkplace: builder.mutation<any, any>({
        query: ({ id, document, body }) => ({
            url: `${PREFIX}/student/add/workplace`,
            method: 'POST',
            params: { student: id, document },
            body,
        }),
        invalidatesTags: ['SubAdminStudents'],
    }),
    studentCourses: builder.query<any, number>({
        query: (id) => `${PREFIX}/student/course/list/${id}`,
        providesTags: ['SubAdminStudents'],
    }),
    changeStudentPassword: builder.mutation<any, any>({
        query: (body) => ({
            url: `${PREFIX}/student/update-password`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['SubAdminStudents'],
    }),
    updateStudentDetail: builder.mutation<any, any>({
        query: ({ id, body }) => ({
            url: `${PREFIX}/student/edit-profile/${id}`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['SubAdminStudents'],
    }),
    changeStudentStatus: builder.mutation<
        Student,
        { id: number; status: UserStatus }
    >({
        query: ({ id, status }) => ({
            url: `${PREFIX}/students/status`,
            method: 'PATCH',
            params: { id },
            body: { status },
        }),
        invalidatesTags: ['Students', 'SubAdminStudents'],
    }),
    changeStudentCurrentStatus: builder.mutation<
        Student,
        { id: number; status: StudentStatusEnum }
    >({
        query: ({ id, status }) => ({
            url: `${PREFIX}/student/status/update/${id}`,
            method: 'POST',
            body: { status },
        }),
        invalidatesTags: ['Students', 'SubAdminStudents'],
    }),
    addSecondWorkplace: builder.mutation<
        any,
        { industryId: number; courseId: number; studentId: number }
    >({
        query: ({ industryId, courseId, studentId }) => ({
            url: `students/workplace-requests/add/another/${industryId}`,
            method: 'POST',
            body: { course: courseId, studentId },
        }),
        invalidatesTags: ['Students', 'SubAdminStudents'],
    }),
    addCustomSecondWorkplace: builder.mutation<
        any,
        ProvideIndustryDetail & {
            studentId: number
        }
    >({
        query: ({ studentId, ...body }) => ({
            url: `subadmin/add-another/workplace/${studentId}`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Students', 'SubAdminStudents'],
    }),

    getWorkplaceContactedIndustries: builder.query<
        any,
        { workpaceId: number; stdId: number }
    >({
        query: ({ workpaceId, stdId }) => ({
            url: `${PREFIX}/student/${stdId}/workplace-request/${workpaceId}/list/contacted-workplaces`,
        }),
        providesTags: ['Workplace'],
    }),

    downloadStudentCSV: builder.mutation<any, void>({
        query: () => ({
            url: `subadmin/students/download/csv`,
            method: 'POST',
        }),
        invalidatesTags: ['Students', 'SubAdminStudents'],
    }),
    getSubAdminTicketStudentsList: builder.query<any, void>({
        query: () => `${PREFIX}/students/list`,
        providesTags: ['SubAdminStudents'],
    }),
    sendPasswordToStudentMail: builder.mutation<any, string>({
        query: (email) => ({
            url: `${PREFIX}/users/password/send`,
            body: { email },
            method: 'POST',
        }),
        invalidatesTags: ['Students', 'SubAdminStudents'],
    }),
    problamaticStudent: builder.mutation<any, any>({
        query: ({ studentId, body }) => ({
            url: `shared/student/${studentId}/has-issue/toggle`,
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['Students', 'SubAdminStudents', 'Notes'],
    }),

    snoozeStudent: builder.mutation<Student, { id: number; date: Date }>({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}/student/snooze/${id}`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Students', 'SubAdminStudents', 'Notes'],
    }),

    unSnoozeStudent: builder.mutation<Student, number>({
        query: (id) => ({
            url: `${PREFIX}/student/reactivate/${id}`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Students', 'SubAdminStudents'],
    }),

    sendStudentMssage: builder.mutation<
        Student,
        { message: string; phoneNumber: string; recipient: number }
    >({
        query: (body) => ({
            url: `twilio-messages/send`,
            body,
            method: 'POST',
        }),
        invalidatesTags: ['StudentMessages'],
    }),

    getStudentMessagesList: builder.query<any, number>({
        query: (id) => `twilio-messages/user/${id}`,
        providesTags: ['StudentMessages'],
    }),
    // TODO: working on this endpoint
    getIncompleteSubmissionsForWorkplace: builder.query<any, any>({
        query: ({ studentId, courseId }) => `twilio-messages/user/`,
        providesTags: ['Students'],
    }),

    releaseStudentLogbook: builder.mutation<Student, number>({
        query: (wpId) => ({
            url: `${PREFIX}/assessment-tool/${wpId}`,
            method: 'POST',
        }),
        invalidatesTags: ['Students', 'SubAdminStudents'],
    }),

    addStudentNote: builder.mutation<
        Student,
        {
            id: number
            status: NotesTemplateStatus
            type: NotesTemplateType | null
            stdId: number
            templateId: number
        }
    >({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/student-note/${id}/update-status`,
            params,
            method: 'PATCH',
        }),
        invalidatesTags: ['Students', 'SubAdminStudents'],
    }),

    getSubAdminDepartmentCoordinators: builder.query<any, void>({
        query: () => ({
            url: `department/members/list`,
        }),
        providesTags: ['SubAdminStudents'],
    }),
    getWpTypeByRtoAndCourse: builder.query<
        any,
        { courseId: number; stdId: number }
    >({
        query: ({ courseId, stdId }) => {
            const params = stdId ? { stdId } : {}
            return {
                url: `${PREFIX}/workplace-type/${courseId}`,
                params,
            }
        },
        providesTags: ['SubAdminStudents'],
    }),

    updateStudentCourses: builder.mutation<
        Student,
        {
            id: number
            courses: number[]
        }
    >({
        query: ({ id, ...body }) => ({
            url: `${PREFIX}/student/${id}/update-courses`,
            body,
            method: 'PATCH',
        }),
        invalidatesTags: ['Students', 'SubAdminStudents'],
    }),

    studentActionsApprovalRequests: builder.query<any, PaginationWithSearch>({
        query: (params) => ({
            url: `${PREFIX}/student/update-requests`,
            params,
        }),
        providesTags: ['SubAdminStudents'],
    }),

    studentActionsRequestCount: builder.query<any, void>({
        query: () => `${PREFIX}/student/update-requests/count`,
        providesTags: ['SubAdminStudents'],
    }),

    updateStudentApprovalActions: builder.mutation<any, any>({
        query: ({ id, status }) => ({
            url: `${PREFIX}/student-request/${id}/update-status`,
            method: 'PATCH',
            params: { status },
        }),
        invalidatesTags: ['SubAdminStudents'],
    }),

    updateWpIndustryEligibility: builder.mutation<any, number>({
        query: (id) => ({
            url: `${PREFIX}/approval-request/${id}/industry-eligibility/update`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdminStudents'],
    }),
    subAdminStudentCancelledWorkplaces: builder.query<any, any>({
        query: ({ params, id }) => ({
            url: `students/workplace-requests/std/${id}/list/workplace/rejected`,
            params,
        }),
        providesTags: ['SubAdminStudents'],
    }),

    skipWorkplace: builder.mutation<any, number>({
        query: (id) => ({
            url: `students/workplace-requests/${id}/skip`,
            method: 'POST',
        }),
        invalidatesTags: ['SubAdminStudents'],
    }),

    skipWorkplaceAndApplyAnother: builder.mutation<
        any,
        {
            wpId: number
            wpAppReqId: number
        }
    >({
        query: ({ wpId, wpAppReqId }) => ({
            url: `students/workplace-requests/${wpId}/approval-request/${wpAppReqId}/skip-current/workplace`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdminStudents', 'SubAdminWorkplace'],
    }),

    getWorkplaceAppointment: builder.query<any, number>({
        query: (id) => `${PREFIX}/workplace-request/${id}/get-appointment`,
        providesTags: ['SubAdminStudents'],
    }),

    skippedIndustriesList: builder.query<any, number>({
        query: (id) =>
            `students/workplace-requests/${id}/skipped-workplace/list`,
        providesTags: ['SubAdminStudents'],
    }),

    esignDocumentsFoldersList: builder.query<any, number>({
        query: (id) => `${PREFIX}/workplace-request/${id}/get-agreement/list`,
        providesTags: ['SubAdminStudents'],
    }),

    checkExistingIndustryRtoDoc: builder.query<any, number>({
        query: (id) => `${PREFIX}/workplace/${id}/check-document`,
        providesTags: ['SubAdminStudents'],
    }),

    sendExistingDocument: builder.mutation<any, { id: number; url: string }>({
        query: ({ id, ...params }) => ({
            url: `${PREFIX}/workplace/${id}/document-add`,
            params,
            method: 'POST',
        }),
        invalidatesTags: ['SubAdminStudents'],
    }),

    // ind/:id/workplace/:wpId/emails
    getIndustryInRadiusWorkplaceEmails: builder.query<any, any>({
        query: ({ wpId }) => ({
            url: `subadmin/workplace/${wpId}/emails`,
        }),
        providesTags: ['SubAdminStudents', 'Mails'],
    }),
    getIndustryInRadiusWorkplaceCallLogs: builder.query<any, any>({
        query: ({ wpId }) => ({
            url: `subadmin/workplace/${wpId}/call-logs`,
        }),
        providesTags: [
            'SubAdminStudents',
            'SubAdmin',
            'Workplace',
            'Industries',
        ],
    }),
    // subadmin/workplace/:wpId/listing-emails
    getFutureIndustryInRadiusWorkplaceEmails: builder.query<any, any>({
        query: ({ wpId }) => ({
            url: `subadmin/workplace/${wpId}/listing-emails`,
        }),
        providesTags: ['SubAdminStudents', 'Industries'],
    }),

    getStudentCapacityWhenApproveIndustry: builder.query<any, number>({
        query: (id) => ({
            url: `students/workplace-requests/capacity-approval-request/${id}/retrieve`,
        }),
        providesTags: ['SubAdminStudents', 'Industries'],
    }),

    acceptStudentCapacityByIndustry: builder.mutation<
        any,
        { approvalId: number; capacity: number }
    >({
        query: ({ approvalId, ...body }) => ({
            url: `students/workplace-requests/capacity-approval-request/${approvalId}/confirm`,
            method: 'POST',
            body,
        }),
        invalidatesTags: ['SubAdminStudents', 'Industries'],
    }),

    studentRtoWpTypes: builder.query<
        WorkplaceTypes[],
        { courseId: number; rtoId: number }
    >({
        query: ({ courseId, rtoId }) =>
            `subadmin/course/${courseId}/rto/${rtoId}/workplace-types`,
        providesTags: ['SubAdminStudents', 'Industries'],
    }),
    resendWorkplaceApprovalEmail: builder.mutation<any, number>({
        query: (id) => ({
            url: `students/workplace-requests/approval-request/${id}/email-resend`,
            method: 'PATCH',
        }),
        invalidatesTags: ['SubAdminStudents', 'SubAdminWorkplace'],
    }),
})
