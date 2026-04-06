import { Rto } from '@types'
import { apiSlice } from '../empty.query'
import { coursesEndpoints } from './course'
import { documentsEndpoints } from './documents'
import { profileEndpoints } from './profile'
import { studentsScheduleEndpoints } from './schedule'
import { studentEndpoints } from './studentAppointment'
import { studentAssessmentEvidenceEndpoints } from './studentAssessmentEvidence'
import { assessmentToolEndpoints } from './studentAssessmentTool'
import { studentJobEndpoints } from './studentsJobs'
import { talentPoolEndpoints } from './talentPool'
import { workplaceEndpoints } from './workplace'

export const studentApi = apiSlice.injectEndpoints({
    // ---------- RTO ENDPOINTS ---------- //
    endpoints: (build) => ({
        rtoProfile: build.query<Rto, void>({
            query: () => `rtos/profile/view`,
            providesTags: ['RTO'],
        }),
        ...coursesEndpoints(build),
        ...studentEndpoints(build),
        ...profileEndpoints(build),
        ...workplaceEndpoints(build),
        ...documentsEndpoints(build),
        ...studentJobEndpoints(build),
        ...talentPoolEndpoints(build),
        ...assessmentToolEndpoints(build),
        ...studentsScheduleEndpoints(build),
        ...studentAssessmentEvidenceEndpoints(build),
    }),
    overrideExisting: true,
})

export const {
    // ------ COURSES ------ //
    useGetStudentCoursesQuery,

    // --- STUDENT APPOINTMENT --- //
    useGetJobsQuery,
    useGetStudentTimeSlotesQuery,
    useGetStudentAppointmentsQuery,
    useGetStudentFavoriteJobsQuery,
    useCreateStudentAppointmentMutation,

    useGetCoordinatorsForStudentQuery,
    useGetStudentPastAppointmentsQuery,
    useGetCoordinatorsAvailabilityQuery,
    useGetStudentUpcomingAppointmentsQuery,

    // -- STUDENT ASSESSMENT TOOLS -- //
    useGetStudentAssessmentToolQuery,

    // ---- ASSESSMENT EVIDENCE ---- //
    useGetAssessmentsCoursesQuery,
    useGetOtherDocAssessmentResponseForStudentQuery,
    useGetAssessmentsFoldersQuery,
    useUploadFolderDocsMutation,
    useArchiveAssessmentFilesMutation,
    useGetAssessmentsFolderDetailQuery,
    useSubmitStudentAssessmentMutation,

    // ---- PROFILE ---- //
    useGetStudentProfileDetailQuery,
    useUpdateStudentProfileMutation,
    useGetIndustriesForFeedbackQuery,
    useAddFeedForIndustryMutation,

    // ----- JOB ----- //
    useSaveJobMutation,
    useApplyForJobMutation,
    useGetStudentJobsQuery,
    useGetStudentJobDetailQuery,
    useGetStudentUploadedResumeQuery,

    // ---- WORKPLACE ---- //
    useGetWpIndustryChecksQuery,
    useRejectIndustryFromEmailMutation,
    useGetStudentIndustriesQuery,
    useGetCourseDocumentsQuery,
    useGetWorkplaceIndustriesQuery,
    useGetPlacementProgressQuery,
    useWorkPlaceRequestMutation,
    useUploadDocumentsMutation,
    useUploadAgreementMutation,
    useCancelWorkplaceRequestMutation,
    useGetWorkplaceApprovalRequestQuery,
    useGetIndustryFoldersQuery,
    useApplyForWorkplaceMutation,
    useUpdateFindAbnMutation,
    useAddWorkplaceMutation,
    useGetWPContractQuery,
    useUploadWPContractMutation,
    useChangeStatusWpApprrovalReqQuery,
    useApplyWorkplaceWithAbnIndustryMutation,
    useGetWpApprovalRequestIndustryChecksQuery,
    useCompleteWorkplaceApprovalRequestMutation,

    // ----- SCHEDULE ----- //
    useRescheduleShiftMutation,
    useAddScheduleNoteMutation,
    useGetStudentScheduleQuery,
    useCancelScheduleShiftMutation,
    useEditStudentScheduleMutation,
    useCreateStudentScheduleMutation,
    useGetStudentScheduleTimeSlotsQuery,

    // ----- DOCUMENTS ----- //
    useGetStudentDocumentsQuery,

    // ----- TALENT POOL ----- //
    useGetTalentPoolStudentProfileQuery,
    useApplyForTalentPoolMutation,
    useGetTalentPoolStudentQuery,
    useGetAppliedTalentPoolStudentProfileQuery,
    useGetIndustriesRequestQuery,
    useUploadTalentPoolRequiredDocsMutation,
    useIndustryRequestStatusMutation,
    useGetAcceptedTalentPoolIndustryProfileQuery,
    useGetTalentPoolRequiredDocsResponseQuery,
    useGetConnectionRequiredDocsQuery,
    useUpdateTalentPoolProfileMutation,
    useGetIndustryRequestCountQuery,
    useReadIndustryRequestMutation,
    useGetStudentWorkplaceQuestionsQuery,
    useUpdateStudentWorkplaceQuestionMutation,
    useGetTalentPoolConnectionRequestCountQuery,
} = studentApi

export const StudentApi = {
    Profile: {
        useGetStudentProfileDetailQuery,
        useUpdateStudentProfileMutation,
        useIndustriesForFeedback: useGetIndustriesForFeedbackQuery,
        useAddFeedForIndustry: useAddFeedForIndustryMutation,
    },
    Courses: {
        useList: useGetStudentCoursesQuery,
    },
    Student: {
        useGetJobsQuery,
        useGetStudentTimeSlotesQuery,
        useGetStudentAppointmentsQuery,
        studentFavoriteJobs: useGetStudentFavoriteJobsQuery,
        useCreateStudentAppointmentMutation,
        useGetCoordinatorsForStudentQuery,
        useGetStudentPastAppointmentsQuery,
        useGetCoordinatorsAvailabilityQuery,
        useGetStudentUpcomingAppointmentsQuery,
    },
    AssessmentTool: {
        useGetStudentAssessmentToolQuery,
    },
    AssessmentEvidence: {
        useGetAssessmentsCoursesQuery,
        otherStudentDocs: useGetOtherDocAssessmentResponseForStudentQuery,
        useGetAssessmentsFoldersQuery,
        useUploadFolderDocsMutation,
        useArchiveAssessmentFilesMutation,
        useGetAssessmentsFolderDetailQuery,
        useSubmitStudentAssessmentMutation,
    },
    Job: {
        useGetStudentJobsQuery,
        useGetStudentJobDetailQuery,
        useSaveJobMutation,
        useApplyJob: useApplyForJobMutation,
        useGetStudentUploadedResume: useGetStudentUploadedResumeQuery,
    },
    Workplace: {
        useGetStudentIndustriesQuery,
        getWpIndustryChecks: useGetWpIndustryChecksQuery,
        rejectIndustryFromEmail: useRejectIndustryFromEmailMutation,
        useGetCourseDocumentsQuery,
        useGetWorkplaceIndustriesQuery,
        useGetPlacementProgressQuery,
        useWorkPlaceRequestMutation,
        useUploadDocumentsMutation,
        useUploadAgreementMutation,
        useCancelWorkplaceRequestMutation,
        wpApprovalRequest: useGetWorkplaceApprovalRequestQuery,

        useApplyForWorkplaceMutation,
        useUpdateFindAbnMutation,
        useAddWorkplaceMutation,
        uploadWPContract: useUploadWPContractMutation,
        getWPContract: useGetWPContractQuery,
        changeStatusWpApprroval: useChangeStatusWpApprrovalReqQuery,
        useApplyWorkplaceWithAbnIndustryMutation,
        useGetIndustryFoldersQuery,
        useWpApprovalRequestIndustryChecks:
            useGetWpApprovalRequestIndustryChecksQuery,
        useCompleteWorkplaceApprovalRequest:
            useCompleteWorkplaceApprovalRequestMutation,
        useGetStudentWorkplaceQuestions: useGetStudentWorkplaceQuestionsQuery,
        useUpdateStudentWorkplaceQuestionMutation,
    },
    Schedule: {
        useAddScheduleNote: useAddScheduleNoteMutation,
        useCancelSchedule: useCancelScheduleShiftMutation,
        useGetStudentSchedule: useGetStudentScheduleQuery,
        useCreateStudentSchedule: useCreateStudentScheduleMutation,
        scheduleTimeSlots: useGetStudentScheduleTimeSlotsQuery,
        useEditStudentSchedule: useEditStudentScheduleMutation,
        useRescheduleShift: useRescheduleShiftMutation,
    },
    Documents: {
        useStudentDocuments: useGetStudentDocumentsQuery,
    },
    TalentPool: {
        useTalentPoolStudentProfile: useGetTalentPoolStudentProfileQuery,
        useAppliedTalentPoolStudentProfile:
            useGetAppliedTalentPoolStudentProfileQuery,
        useIndustriesConnectionRequests: useGetIndustriesRequestQuery,
        useTalentPoolStudent: useGetTalentPoolStudentQuery,
        useApplyTalentPool: useApplyForTalentPoolMutation,
        useUploadTalentPoolRequiredDocs:
            useUploadTalentPoolRequiredDocsMutation,
        useIndustryRequestStatus: useIndustryRequestStatusMutation,
        useAcceptedTalentPoolIndustryProfile:
            useGetAcceptedTalentPoolIndustryProfileQuery,
        useRequiredDocsResponse: useGetTalentPoolRequiredDocsResponseQuery,
        useConnectionRequiredDocs: useGetConnectionRequiredDocsQuery,
        useUpdateTalentPoolProfile: useUpdateTalentPoolProfileMutation,
        useIndustryRequestCount: useGetIndustryRequestCountQuery,
        useReadIndustryRequest: useReadIndustryRequestMutation,
        useTalentPoolCount: useGetTalentPoolConnectionRequestCountQuery,
    },
}
