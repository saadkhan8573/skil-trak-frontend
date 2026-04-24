import { apiSlice } from '../empty.query'
import { approvalRequestEndpoints } from './approval-request'
import { availableServicesEndpoints } from './availableServices'
import { coursesEndPoints } from './courses'
import { dashboardEndpoints } from './dashboard'
import { industriesEndpoints } from './industries'
import { placementRequestsEndPoints } from './placementRequests'
import { rtoIndustryCreditsEndpoints } from './rto-credits'
import { studentDocumentsEndpoints } from './student-documents'
import { studentsEndpoints } from './students'
import { studentsWorkplaceEndpoints } from './students-workplace'
export const rtoV2Api = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        ...coursesEndPoints(build),
        ...studentsEndpoints(build),
        ...dashboardEndpoints(build),
        ...industriesEndpoints(build),
        ...approvalRequestEndpoints(build),
        ...studentDocumentsEndpoints(build),
        ...placementRequestsEndPoints(build),
        ...availableServicesEndpoints(build),
        ...studentsWorkplaceEndpoints(build),
        ...industriesEndpoints(build),
        ...rtoIndustryCreditsEndpoints(build),
    }),
    // overrideExisting: true,
})

export const {
    // Dashboard
    useAutoWpCountQuery,
    useAdminMessageQuery,
    useNavBarCountsQuery,
    useLast24HoursWpQuery,
    useRtoDashboardCountsQuery,

    // Available Services
    useGetPremiumFeaturesQuery,
    useSubmitAvailableServiceFormMutation,

    // Student Placement Requests
    useGetStudentPlacementRequestListQuery,
    useGetStudentPlacementRequestStatsQuery,
    useGetStudentPlacementProfileDetailsQuery,
    useGetStudentPlacementDetailsQuery,
    useGetStudentPlacementProgressQuery,
    useGetStudentPlacementIndustryDetailsQuery,
    useGetStudentPlacementCourseQuery,
    useGetIndustryPlacementHighlightedTasksQuery,
    useGetStudentPlacementComplianceQuery,
    useGetStudentPlacementCourseProgramsQuery,
    useGetStudentPlacementStatusCheckNotesQuery,
    useAddManualNoteMutation,
    useConfirmHighlightedTaskMutation,
    useGetRtoCourseWpTypesQuery,
    useRemoveRtoStudentFromBlackListMutation,
    useRemoveIndustryFromBlackListMutation,

    // Courses
    useRtoCoursesQuery,
    useCreateRtoWpTypeMutation,
    useAddCourseDocumentMutation,
    useUpdateFacilityChecklistMutation,
    useUpdateAgreementFileMutation,
    useUpdateLogbookFileMutation,
    useUpdateCourseSummaryMutation,
    useAddCourseHighlightedTaskMutation,
    useRemoveCourseHighlightedTaskMutation,
    useAddAICourseDifferenceMutation,
    useRemoveAICourseDifferenceMutation,
    useGetCourseWorkplaceTypesQuery,
    useUpdateSupervisorRequirementsMutation,
    useSetupConfirmationPercentageQuery,
    useUpdateCourseApprovalStatusMutation,

    // ---- Students ---- //
    useRtoStudentHistoryQuery,
    useImportStudentsMutation,
    useGetWpForAutoMatchingQuery,
    useStudentInfoMessageMutation,
    useGetStudentInfoMessagesQuery,
    useStudentOnTrackCountsQuery,
    useGetStudentTicketsCountQuery,
    useGetStudentAppointmentsCountQuery,
    useAddSingleStudentWithPlacementTypeMutation,
    useRunAutomationForAvailabeleStudentsMutation,
    useBookAppointmentExternallyMutation,
    useGetStudentRejectedIndustriesQuery,
    useDownloadAllActiveStudentsMutation,
    useDownloadInProgressStudentsMutation,
    useDownloadNoWorkplaceStudentsMutation,
    useDownloadPlacementStartedStudentsMutation,
    useDownloadScheduleCompletedStudentsMutation,
    useDownloadReportedStudentsMutation,
    useDownloadNonContactableStudentsMutation,
    useDownloadExpiredStudentsMutation,
    useDownloadSnoozedStudentsMutation,

    // ---- Students Workplace ---- //
    useGetStudentWorkplaceListQuery,
    useGetStudentWorkplaceCountQuery,
    useGetStudentWorkplacesByCourseQuery,
    useGetIndustryAvailabilityForStudentQuery,
    useGetStudentProfileWorkplaceApprovalRequestQuery,

    // ---- Approval Requests ---- //
    useGetWpProgramsQuery,
    useQuickReviewRequestQuery,
    useApprovalRequestDetailQuery,
    useGetRtoCourseChecklistQuery,
    useRtoApprovalRequestCourseQuery,
    useGetSkiltrakCourseChecklistQuery,
    useApprovalRequestSupervisorsQuery,
    useApprovalRequestHighlightedTasksQuery,

    // ---- Student Documents ---- //
    useFileStatusChangeMutation,
    useAllFilesStatusChangeMutation,
    useGetStudentDocumentsListQuery,
    useGetStudentDocumentFilesQuery,
    useGetStudentDocumentsCountQuery,
    useUploadStudentDocumentFileMutation,
    useSendEmailOnIndustryChecksMutation,

    // ---- Industries ---- //
    useGetRtoIndustriesQuery,
    useSnoozeIndustryByIdMutation,
    useIndustryCoursesDetailsQuery,
    useGetRtoIndustryDetailQuery,
    useIndustryStudentsListQuery,
    useGetAllIndustriesListQuery,
    useIndustryStudentStatsQuery,
    useGetIndustriesCountsQuery,
    useCreateAvailabilityMutation,
    useAddSingleRtoIndustryMutation,
    useIndustryRtoChecklistListQuery,
    useConfirmIndustryHighlightedTaskMutation,
    useConfirmBulkIndustryHighlightedTasksMutation,
    useAddBulkRtoIndustriesMutation,
    useGetIndustryAvailabilityV2Query,
    useGetIndustryInitiatedESignQuery,
    useCancelIndustryInitiatedESignMutation,
    useIndustryUserStatusChangeMutation,
    useGetIndustryCancelledStudentsQuery,
    useGetIndustryTerminatedStudentsQuery,
    useGetIndutryAvailableWorkingHoursQuery,
    useGetPedingCourseApprovalIndustriesQuery,
    useStatusChangeCourseFacilityChecklistMutation,
    useUploadCourseFacilityChecklistMutation,
    useUpdateInterestedTypeMutation,
    useGetRtoIndustryDataCountQuery,
    useUpdateIndustryBioMutation,
    useIndustryInfoMessageMutation,
    useGetIndustryInfoMessagesQuery,
    useAssignIndustryToCoordinatorMutation,
    useGetHighlightedTasksQuery,
    useUpdateIndustryAvailabilityMutation,
    useGetIndustryWaitingStudentsQuery,
    useGetIndustryRejectedStudentsQuery,
    useUpdateIndustryPlacementUrlMutation,
    useIndustryPlacementReadyMutation,
    useGenerateIndustryBioMutation,
    useGetIndustryWaitingForRtoStudentsQuery,
    useToggleIndustryCourseStatusMutation,
    useResendEmailIndustryAwaitingStudentMutation,
    useGetStudentAppointmentDetailQuery,
    useManuallyUpdateWorkplaceStatusMutation,
    // ---- RTO Credits ---- //
    useGetRtoCreditsQuery,
    useChangeRtoNetworkMutation,
    useCreateIndustryCreditMutation,
    useConfirmRtoWorkplacePaymentMutation,
    useAddExpectedDelayMutation,
} = rtoV2Api

export const RtoV2Api = {
    Dashboard: {
        autoWpCount: useAutoWpCountQuery,
        adminMessage: useAdminMessageQuery,
        navBarCounts: useNavBarCountsQuery,
        last24HoursWp: useLast24HoursWpQuery,
        rtoDashboardCounts: useRtoDashboardCountsQuery,
    },
    AvailableServices: {
        premiumFeatures: useGetPremiumFeaturesQuery,
        submitAvailableService: useSubmitAvailableServiceFormMutation,
    },
    PlacementRequests: {
        useStudentPlacementRequestList: useGetStudentPlacementRequestListQuery,
        useStudentPlacementRequestStats:
            useGetStudentPlacementRequestStatsQuery,
        // Details
        useStudentPlacementProfileDetails:
            useGetStudentPlacementProfileDetailsQuery,
        useStudentPlacementDetails: useGetStudentPlacementDetailsQuery,
        useStudentPlacementProgress: useGetStudentPlacementProgressQuery,
        useStudentPlacementIndustryDetails:
            useGetStudentPlacementIndustryDetailsQuery,
        useStudentPlacementCourse: useGetStudentPlacementCourseQuery,
        useIndustryPlacementHighlightedTasks:
            useGetIndustryPlacementHighlightedTasksQuery,
        useStudentPlacementCompliance: useGetStudentPlacementComplianceQuery,
        useStudentPlacementCoursePrograms:
            useGetStudentPlacementCourseProgramsQuery,
        useStudentPlacementStatusCheckNotes:
            useGetStudentPlacementStatusCheckNotesQuery,
        useAddManualNote: useAddManualNoteMutation,
        useConfirmHighlightedTask: useConfirmHighlightedTaskMutation,
        useManuallyUpdateWorkplaceStatus:
            useManuallyUpdateWorkplaceStatusMutation,
        removeRtoStudentFromBlackList: useRemoveRtoStudentFromBlackListMutation,
        removeIndustryFromBlackList: useRemoveIndustryFromBlackListMutation,
    },
    Courses: {
        rtoCourses: useRtoCoursesQuery,
        useAddCourseDocument: useAddCourseDocumentMutation,
        useUpdateFacilityChecklist: useUpdateFacilityChecklistMutation,
        createRtoWpType: useCreateRtoWpTypeMutation,
        useUpdateAgreementFile: useUpdateAgreementFileMutation,
        useUpdateLogbookFile: useUpdateLogbookFileMutation,
        useUpdateCourseSummary: useUpdateCourseSummaryMutation,
        useAddCourseHighlightedTask: useAddCourseHighlightedTaskMutation,
        useRemoveCourseHighlightedTask: useRemoveCourseHighlightedTaskMutation,
        useAddAICourseDifference: useAddAICourseDifferenceMutation,
        useRemoveAICourseDifference: useRemoveAICourseDifferenceMutation,
        useCourseWorkplaceTypes: useGetCourseWorkplaceTypesQuery,
        useUpdateSupervisorRequirements:
            useUpdateSupervisorRequirementsMutation,
        setupConfirmationPercentage: useSetupConfirmationPercentageQuery,
        useRtoCourseWpTypes: useGetRtoCourseWpTypesQuery,
        useUpdateCourseApprovalStatus: useUpdateCourseApprovalStatusMutation,
    },
    Students: {
        importStudents: useImportStudentsMutation,
        rtoStudentHistory: useRtoStudentHistoryQuery,
        studentInfoMessage: useStudentInfoMessageMutation,
        getWpForAutoMatching: useGetWpForAutoMatchingQuery,
        studentOnTrackCounts: useStudentOnTrackCountsQuery,
        getStudentInfoMessages: useGetStudentInfoMessagesQuery,
        getStudentTicketsCount: useGetStudentTicketsCountQuery,
        getStudentAppointmentsCount: useGetStudentAppointmentsCountQuery,
        addIndividualStudent: useAddSingleStudentWithPlacementTypeMutation,
        runAutomationForAvailabeleStudents:
            useRunAutomationForAvailabeleStudentsMutation,
        useBookAppointmentExternally: useBookAppointmentExternallyMutation,
        useGetStudentRejectedIndustries: useGetStudentRejectedIndustriesQuery,
        useGetStudentAppointmentDetail: useGetStudentAppointmentDetailQuery,
        addExpectedDelay: useAddExpectedDelayMutation,
        useDownloadAllActiveStudents: useDownloadAllActiveStudentsMutation,
        useDownloadInProgressStudent: useDownloadInProgressStudentsMutation,
        useDownloadNoWorkplaceStudent: useDownloadNoWorkplaceStudentsMutation,
        useDownloadPlacementStartedStudent:
            useDownloadPlacementStartedStudentsMutation,
        useDownloadScheduleCompletedStudent:
            useDownloadScheduleCompletedStudentsMutation,
        useDownloadReportedStudent: useDownloadReportedStudentsMutation,
        useDownloadNonContactableStudent:
            useDownloadNonContactableStudentsMutation,
        useDownloadExpiredStudent: useDownloadExpiredStudentsMutation,
        useDownloadSnoozedStudent: useDownloadSnoozedStudentsMutation,
    },
    StudentsWorkplace: {
        getStudentWorkplaceList: useGetStudentWorkplaceListQuery,
        getStudentWorkplaceCount: useGetStudentWorkplaceCountQuery,
        getStudentWorkplacesByCourse: useGetStudentWorkplacesByCourseQuery,
        useIndustryAvailabilityForStudent:
            useGetIndustryAvailabilityForStudentQuery,
        useStudentProfileWorkplaceApprovalRequest:
            useGetStudentProfileWorkplaceApprovalRequestQuery,
    },
    ApprovalRequest: {
        getWpPrograms: useGetWpProgramsQuery,
        quickReviewRequest: useQuickReviewRequestQuery,
        approvalRequestDetail: useApprovalRequestDetailQuery,
        getRtoCourseChecklist: useGetRtoCourseChecklistQuery,
        highlightedTasks: useApprovalRequestHighlightedTasksQuery,
        rtoApprovalRequestCourse: useRtoApprovalRequestCourseQuery,
        getSkiltrakCourseChecklist: useGetSkiltrakCourseChecklistQuery,
        approvalRequestSupervisors: useApprovalRequestSupervisorsQuery,
    },
    StudentDocuments: {
        fileStatusChange: useFileStatusChangeMutation,
        allFilesStatusChange: useAllFilesStatusChangeMutation,
        getStudentDocumentsList: useGetStudentDocumentsListQuery,
        getStudentDocumentFiles: useGetStudentDocumentFilesQuery,
        getStudentDocumentsCount: useGetStudentDocumentsCountQuery,
        uploadStudentDocumentFile: useUploadStudentDocumentFileMutation,
        useSendEmailOnIndustryChecks: useSendEmailOnIndustryChecksMutation,
    },
    Industries: {
        createAvailability: useCreateAvailabilityMutation,
        getRtoIndustries: useGetRtoIndustriesQuery,
        snoozeIndustry: useSnoozeIndustryByIdMutation,
        getIndustriesCounts: useGetIndustriesCountsQuery,
        industryStudentsList: useIndustryStudentsListQuery,
        getAllIndustriesList: useGetAllIndustriesListQuery,
        getRtoIndustryDetail: useGetRtoIndustryDetailQuery,
        industryStudentStats: useIndustryStudentStatsQuery,
        addSingleRtoIndustry: useAddSingleRtoIndustryMutation,
        addBulkRtoIndustries: useAddBulkRtoIndustriesMutation,
        industryCoursesDetails: useIndustryCoursesDetailsQuery,
        industryRtoChecklistList: useIndustryRtoChecklistListQuery,
        useConfirmHighlightedTask: useConfirmIndustryHighlightedTaskMutation,
        useConfirmBulkHighlightedTasks:
            useConfirmBulkIndustryHighlightedTasksMutation,
        useIndustryAvailabilityV2: useGetIndustryAvailabilityV2Query,
        industryUserStatusChange: useIndustryUserStatusChangeMutation,
        getIndustryCancelledStudents: useGetIndustryCancelledStudentsQuery,
        getIndustryTerminatedStudents: useGetIndustryTerminatedStudentsQuery,
        getIndustryInitiatedESign: useGetIndustryInitiatedESignQuery,
        cancelIndustryInitiatedESign: useCancelIndustryInitiatedESignMutation,
        useGetIndutryAvailableHours: useGetIndutryAvailableWorkingHoursQuery,
        statusChangeCourseFacilityChecklist:
            useStatusChangeCourseFacilityChecklistMutation,
        getPedingCourseApprovalIndustry:
            useGetPedingCourseApprovalIndustriesQuery,
        uploadCourseFacilityChecklist: useUploadCourseFacilityChecklistMutation,
        updateInterestedType: useUpdateInterestedTypeMutation,
        getRtoIndustryDataCount: useGetRtoIndustryDataCountQuery,
        updateIndustryBio: useUpdateIndustryBioMutation,
        industryInfoMessage: useIndustryInfoMessageMutation,
        getIndustryInfoMessages: useGetIndustryInfoMessagesQuery,
        assignIndustryToCoordinator: useAssignIndustryToCoordinatorMutation,
        useGetHighlightedTasks: useGetHighlightedTasksQuery,
        updateIndustryAvailability: useUpdateIndustryAvailabilityMutation,
        updateIndustryPlacementUrl: useUpdateIndustryPlacementUrlMutation,
        getIndustryWaitingStudents: useGetIndustryWaitingStudentsQuery,
        getIndustryWaitingForRtoStudents:
            useGetIndustryWaitingForRtoStudentsQuery,
        industryPlacementReady: useIndustryPlacementReadyMutation,
        generateIndustryBio: useGenerateIndustryBioMutation,
        toggleIndustryCourseStatus: useToggleIndustryCourseStatusMutation,
        useResendEmailIndustryAwaitingStudent:
            useResendEmailIndustryAwaitingStudentMutation,

        useIndustryRejectedStudents: useGetIndustryRejectedStudentsQuery,
    },
    RtoCredits: {
        getRtoCredits: useGetRtoCreditsQuery,
        changeRtoNetwork: useChangeRtoNetworkMutation,
        confirmPayment: useConfirmRtoWorkplacePaymentMutation,
        createIndustryCredit: useCreateIndustryCreditMutation,
    },
}
