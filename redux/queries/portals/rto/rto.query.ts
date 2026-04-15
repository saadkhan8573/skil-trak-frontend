import { apiSlice } from '../empty.query'
import { appointmentsEndpoints } from './appointments'
import { assessmentToolsEndpoints } from './assessmentTools'
import { contactPersonEndpoints } from './contactPerson'
import { coordinatorEndpoints } from './coordinator'
import { coursesEndpoints } from './courses'
import { industriesEndpoints } from './industries'
import { insuranceEndpoints } from './insurance'
import { mouEndpoints } from './mou'
import { profileEndpoints } from './profile'
import { rtoDocumentsEndpoints } from './rtoDocuments'
import { studentEndpoints } from './student'
import { submissionsEndpoints } from './submissions'
import { workplaceEndpoints } from './workplace'

export const rtoApi = apiSlice.injectEndpoints({
    // ---------- RTO ENDPOINTS ---------- //
    endpoints: (build) => ({
        rtoMyProfile: build.query<any, void>({
            query: () => `rtos/profile/view`,
            providesTags: ['RTOCourses', 'RTO', 'Avatar', 'Profile', 'RTOS'],
        }),
        dashboard: build.query<any, void>({
            query: () => `rtos/dashboard/count`,
            providesTags: ['RTO'],
        }),

        rtoWeelyReport: build.query<any, void>({
            query: () => `rtos/weekly-report/list`,
            providesTags: ['RTO'],
        }),

        ...mouEndpoints(build),
        ...profileEndpoints(build),
        ...coursesEndpoints(build),
        ...studentEndpoints(build),
        ...workplaceEndpoints(build),
        ...insuranceEndpoints(build),
        ...industriesEndpoints(build),
        ...submissionsEndpoints(build),
        ...coordinatorEndpoints(build),
        ...appointmentsEndpoints(build),
        ...rtoDocumentsEndpoints(build),
        ...contactPersonEndpoints(build),
        ...assessmentToolsEndpoints(build),
    }),
    // overrideExisting: true,
})

export const {
    // ---- REPORT ----- //
    useRtoWeelyReportQuery,

    // ------ SELF ------ //
    useRtoMyProfileQuery,
    useRtoDashboardStudentsLogsListQuery,
    useDashboardQuery,
    useGetRtoMapIndustriesQuery,
    useUpdateRTOProfileMutation,
    useGetRtoProgressByCourseQuery,
    useGetRtoSelfPaymentQuery,

    // ------ Contact Persons ------ //
    useContactPersonsQuery,
    useAddContactPersonMutation,
    useRemoveContactPersonMutation,
    useUpdateContactPersonMutation,

    // ------ STUDENT ------ //
    useStudentsCountQuery,
    useGetRtoStudentsListQuery,
    useUpdateReportedStudentCommentMutation,
    useGetIncompleteSubmissionStudentsQuery,
    useStudentsImportMutation,
    useAddStudentMutation,
    useRtoCompletedStudentsQuery,
    useSendVerificationCodeMutation,
    useCompareVerificationCodeMutation,
    useGetNotContactableStudentsQuery,
    useGetArchivedStudentsReportQuery,
    useGetCompletedWorkplaceReportQuery,
    useGetPlacementStartedReportQuery,
    useGetStudentsResultsReportQuery,
    useGetTerminatedWorkplaceReportQuery,
    useGetRtoReportedStudentsListQuery,

    // ------ COORDINATOR ------ //
    useGetRtoCoordinatorsQuery,
    useRemoveCoordinatorMutation,
    useCoordinatorCreateMutation,
    useCoordinatorUpdateMutation,
    useGetRtoCoordinatorsDetailQuery,
    useGetRtoAssignedCoordinatorsQuery,
    useGetRtoAssignedCoordinatorsListQuery,
    useHasAccessAllStudentsMutation,

    // --- APPOINTMENTS --- //
    useGetRTOAppointmentsQuery,
    useGetCoordinatorsForRTOQuery,
    useCreateRTOAppointmentMutation,
    useGetRtoSearchedUsersQuery,
    useGetRtoSearchedUserCourseQuery,
    useCreateRtoAppointmentMutation,
    useGetRtoAppointmentsCountQuery,

    //  --- ASSESSMENT TOOLS --- //
    useGetAssessmentToolQuery,
    useGetAssessmentToolDetailQuery,
    useGetAssessmentToolByCourseQuery,
    useCreateRtoAssessmentToolsMutation,
    useUpdateAssessmentToolArchiveMutation,
    useRemoveRTOAssessmentToolsMutation,

    //  --- COURSES --- //

    useGetRTOCoursesQuery,
    useAddRtoCourseInfoMutation,
    useUpdateCourseHoursMutation,
    useAddRtoCustomCourseRequirementsMutation,

    // --- INDUSTRIES --- //
    useGetIndustriesListQuery,
    useRemoveFromBlackListMutation,
    useGetBlackListedIndustriesQuery,

    // --- MOU --- //
    useGetRtoMOUListQuery,
    useGetRtoMOUDetailQuery,
    useCreateMOUbyRTOMutation,
    useAcceptMOUbyRTOMutation,
    useCancelMOUByRTOMutation,
    useRejectMOUByRTOMutation,

    // --- STUDENTS --- //
    useGetActiveStudentsListQuery,
    useGetPendingStudentsListQuery,
    useGetInProgressStudentsListQuery,
    useGetSkiltrakFlaggedStudentsListQuery,
    useGetNoWorkplaceStudentsListQuery,
    useGetPlacementStartedStudentsListQuery,
    useGetScheduleCompletedStudentsListQuery,
    useGetExpiredStudentsListQuery,
    useGetBlockedStudentsListQuery,
    useGetQualificationIssuedStudentsListQuery,
    useGetRtoStudentsQuery,
    useGetNonContactableStudentsListQuery,
    useGetRtoResolveIssuesStudentsQuery,
    useRtoResolveIssueMutation,
    useGetRtoResolveIssuesStudentsCountQuery,
    useRemoveRTOStudentMutation,
    useGetRtoStudentProfileQuery,
    useGetRtoProblematicStudentsQuery,
    useChangeRTOStudentsStatusMutation,
    useGetNewStudentsReportQuery,
    useGetCancelledWorkplaceReportQuery,
    useGetBlockedStudentsReportQuery,
    useGetWorkplaceRequestsReportQuery,
    useGetWithoutWorkplaceReportQuery,
    useGetAppointmentsReportQuery,
    useGetReportedStudentsReportQuery,
    useAssignRtoCoordinatorToStudentsMutation,
    useAssignRtoCoordinatorToMultiStudentsMutation,
    useGetReportDownloadLinkQuery,
    useGetRtoMyReportDownloadQuery,
    useGetExportStudentListQuery,

    // --- WORKPLACES --- //
    useGetRTOWorkplacesQuery,
    useWpApprovalRequestQuery,
    useWpApprovalRequestByStatusQuery,
    useGetRTOWorkplaceDetailQuery,
    useWpApprovalRequestCountQuery,
    useWpApprovalRequestChangeStatusMutation,

    // ---- DOCUMENTS ---- //
    useGetRtoDocumentsQuery,
    useAddRtoDocumentsMutation,

    // ---- INSURANCE ---- //
    useGetRtoInsuranceTypeQuery,
    useUploadRtoInsuranceDocsMutation,

    // ---- SUBMISSIONS ---- //
    useGetRtoSubmissionsQuery,
    useGetRtoSubmissionsCountQuery,
    useChangeRtoSubmissionStatusMutation,
} = rtoApi

export const RtoApi = {
    Report: {
        useRtoWeelyReport: useRtoWeelyReportQuery,
    },
    Rto: {
        useProfile: useRtoMyProfileQuery,
        rtoStudentLogs: useRtoDashboardStudentsLogsListQuery,
        useContactPersons: useContactPersonsQuery,
        useDashboard: useDashboardQuery,
        rtoMapIndustries: useGetRtoMapIndustriesQuery,
        useUpdateProfile: useUpdateRTOProfileMutation,
        useAddContactPerson: useAddContactPersonMutation,
        useRemoveContactPerson: useRemoveContactPersonMutation,
        useUpdateContactPerson: useUpdateContactPersonMutation,
        useRtoProgressByCourse: useGetRtoProgressByCourseQuery,
        useRtoSelfPayment: useGetRtoSelfPaymentQuery,
    },
    Students: {
        useActiveStudentsList: useGetActiveStudentsListQuery,
        usePendingStudentsList: useGetPendingStudentsListQuery,
        useInProgressStudentsList: useGetInProgressStudentsListQuery,
        useSkiltrakFlaggedStudentsList: useGetSkiltrakFlaggedStudentsListQuery,
        useNoWorkplaceStudentsList: useGetNoWorkplaceStudentsListQuery,
        usePlacementStartedStudentsList:
            useGetPlacementStartedStudentsListQuery,
        useScheduleCompletedStudentsList:
            useGetScheduleCompletedStudentsListQuery,
        useExpiredStudentsList: useGetExpiredStudentsListQuery,
        useBlockedStudentsList: useGetBlockedStudentsListQuery,
        useQualificationIssuedStudentsList:
            useGetQualificationIssuedStudentsListQuery,
        useCount: useStudentsCountQuery,
        useRtoResolveIssuesStudents: useGetRtoResolveIssuesStudentsQuery,
        useRtoResolveIssuesStudentsCount:
            useGetRtoResolveIssuesStudentsCountQuery,
        useRtoResolveIssue: useRtoResolveIssueMutation,
        useImportStudents: useStudentsImportMutation,
        useRtoStudentsList: useGetRtoStudentsListQuery,
        useGetNonContactableStudentsListQuery:
            useGetNonContactableStudentsListQuery,
        useAddStudent: useAddStudentMutation,
        useRtoCompletedStudents: useRtoCompletedStudentsQuery,
        useCompareCode: useCompareVerificationCodeMutation,
        useSendVerificationCode: useSendVerificationCodeMutation,
        useGetNotContactableStudents: useGetNotContactableStudentsQuery,
        useNewStudentsReport: useGetNewStudentsReportQuery,
        useProblematicStudentsList: useGetRtoProblematicStudentsQuery,
        useCancelledWorkplaceReport: useGetCancelledWorkplaceReportQuery,
        useBlockedStudentsReport: useGetBlockedStudentsReportQuery,
        useArchivedStudentsReport: useGetArchivedStudentsReportQuery,
        useCompletedWorkplaceReport: useGetCompletedWorkplaceReportQuery,
        usePlacementStartedReport: useGetPlacementStartedReportQuery,
        useStudentsResultsReport: useGetStudentsResultsReportQuery,
        useTerminatedWorkplaceReport: useGetTerminatedWorkplaceReportQuery,
        useWorkplaceRequestReport: useGetWorkplaceRequestsReportQuery,
        useWithoutWorkplaceReport: useGetWithoutWorkplaceReportQuery,
        useAppointmentsReport: useGetAppointmentsReportQuery,
        useReportedStudentsReport: useGetReportedStudentsReportQuery,
        useAssignCoordinatoToStudent: useAssignRtoCoordinatorToStudentsMutation,
        assignMultiStudentToCoordinator:
            useAssignRtoCoordinatorToMultiStudentsMutation,
        useReportDownloadLink: useGetReportDownloadLinkQuery,
        getRtoMyReportDownload: useGetRtoMyReportDownloadQuery,
        useExportStudentList: useGetExportStudentListQuery,
        useRtoReportedStudentsList: useGetRtoReportedStudentsListQuery,
        useUpdateReportedStudentComment:
            useUpdateReportedStudentCommentMutation,
        incompleteSubmissionStudents: useGetIncompleteSubmissionStudentsQuery,
    },
    Coordinator: {
        useCreate: useCoordinatorCreateMutation,
        useUpdate: useCoordinatorUpdateMutation,
        useList: useGetRtoCoordinatorsQuery,
        useRtoAssignedCoordinators: useGetRtoAssignedCoordinatorsListQuery,
        useDetail: useGetRtoCoordinatorsDetailQuery,
        useAssignedCoordinators: useGetRtoAssignedCoordinatorsQuery,
        useRemove: useRemoveCoordinatorMutation,
        useHasAccessAllStudents: useHasAccessAllStudentsMutation,
    },
    Courses: {
        useRtoCourses: useGetRTOCoursesQuery,
        addRtoCourseInfo: useAddRtoCourseInfoMutation,
        useUpdateCourseHours: useUpdateCourseHoursMutation,
        useAddRtoCustomCourseRequirements:
            useAddRtoCustomCourseRequirementsMutation,
    },
    Appointments: {
        useRtoSearchedUsers: useGetRtoSearchedUsersQuery,
        useRtoSearchedUserCourse: useGetRtoSearchedUserCourseQuery,
        useCreateRtoAppointment: useCreateRtoAppointmentMutation,
        useRtoAppointmentsCount: useGetRtoAppointmentsCountQuery,
    },
    RtoDocument: {
        useGetRtoDocuments: useGetRtoDocumentsQuery,
        useAddRtoDocuments: useAddRtoDocumentsMutation,
    },
    Insurance: {
        rtoInsuranceList: useGetRtoInsuranceTypeQuery,
        uploadInsuranceDocs: useUploadRtoInsuranceDocsMutation,
    },
    Workplace: {
        wpApprovalRequest: useWpApprovalRequestQuery,
        wpApprovalRequestCount: useWpApprovalRequestCountQuery,
        wpApprovalRequestByStatus: useWpApprovalRequestByStatusQuery,
        wpAppReqChangeStatus: useWpApprovalRequestChangeStatusMutation,
    },
    Industry: {
        removeFromBlackList: useRemoveFromBlackListMutation,
        getBlackListedIndustries: useGetBlackListedIndustriesQuery,
    },
    Submissions: {
        getRtoSubmissions: useGetRtoSubmissionsQuery,
        getRtoSubmissionsCount: useGetRtoSubmissionsCountQuery,
        changeSubmissionStatus: useChangeRtoSubmissionStatusMutation,
    },
}
