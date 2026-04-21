import { talentPoolEndpoints } from './talentPool'
import { apiSlice } from '../empty.query'
import { appointmentsEndpoints } from './appointment'

import { availableShiftsEndpoints } from './availableShifts'
import { branchesEndpoints } from './branches'
import { coursesEndpoints } from './courses'
import { employeeEndpoints } from './employee'
import { employeeTaskEndpoints } from './employeeTask'
import { foldersEndpoints } from './folders'
import { headQuarterEndpoints } from './head-quarter'
import { jobEndpoints } from './job'
import { messageEndpoints } from './message'
import { mouEndpoints } from './mou'
import { notificationsEndpoints } from './notifications'
import { rplEndpoints } from './rpl'
import { studentsEndpoints } from './students'
import { supervisorsEndpoints } from './supervisors'
import { volunteerEndpoints } from './volunteer'
import { workplaceEndpoints } from './workplace'
import { insuranceEndpoints } from './insurance'
import { galleryEndpoints } from './gallery'

export const industryApi = apiSlice.injectEndpoints({
    // export const industryApi = createApi({
    //     reducerPath: 'industryApi',
    //     baseQuery: fetchBaseQuery({
    //         baseUrl: `${process.env.NEXT_PUBLIC_END_POINT}/`,
    //         prepareHeaders: (headers, { getState }) => {
    //             const token = AuthUtils.getToken()
    //             if (token) {
    //                 headers.set('authorization', `Bearer ${token}`)
    //             }
    //             return headers
    //         },
    //     }),
    //     keepUnusedDataFor: 200,
    //     refetchOnMountOrArgChange: 100,
    //     refetchOnReconnect: true,
    //     // refetchOnFocus: true,
    //     tagTypes: [
    //         'RPL',
    //         'Course',
    //         'Employee',
    //         'Employee',
    //         'Students',
    //         'Document',
    //         'Industries',
    //         'EmployeeTask',
    //         'AvailableShifts',
    //     ],

    // ---------- RTO ENDPOINTS ---------- //
    endpoints: (build) => ({
        industryProfile: build.query<any, void>({
            query: () => 'industries/profile/get',
            providesTags: ['Industries'],
        }),
        getIndustryFavByCoordinator: build.query<any, void>({
            query: () => 'industries/favorite-by',
            providesTags: ['Industries'],
        }),
        // industries/onboarding/industry/:id
        getIndustryOnboarding: build.query<any, any>({
            query: (id) => `industries/onboarding/industry/${id}`,
            providesTags: ['Industries'],
        }),
        // shared/sector/:id/workplace-types-list
        getSectorsWorkplaceTypeOnboarding: build.query<any, string[]>({
            query: (ids) => ({
                url: 'shared/sector/workplace-types-list',
                method: 'POST',
                body: { ids: ids },
            }),
            providesTags: ['Industries'],
        }),
        updateIndustryProfile: build.mutation<any, any>({
            query: ({ id, body }) => ({
                url: 'industries/profile/update',
                method: 'PATCH',
                params: { industry: id },
                body,
            }),
            invalidatesTags: ['Industries', 'RTOIndustries'],
        }),
        updateIndustryData: build.mutation<any, any>({
            query: ({ id, body }) => ({
                url: `industries/${id}/update/data`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Industries', 'RTOIndustries'],
        }),
        // get industry fav by coordinator

        ...mouEndpoints(build),
        ...jobEndpoints(build),
        ...rplEndpoints(build),
        ...coursesEndpoints(build),
        ...messageEndpoints(build),
        ...foldersEndpoints(build),
        ...employeeEndpoints(build),
        ...galleryEndpoints(build),
        ...studentsEndpoints(build),
        ...branchesEndpoints(build),
        ...workplaceEndpoints(build),
        ...volunteerEndpoints(build),
        ...insuranceEndpoints(build),
        ...talentPoolEndpoints(build),
        ...supervisorsEndpoints(build),
        ...headQuarterEndpoints(build),
        ...employeeTaskEndpoints(build),
        ...appointmentsEndpoints(build),
        ...notificationsEndpoints(build),
        ...availableShiftsEndpoints(build),
    }),
    // overrideExisting: true,
})

export const {
    // ---- PROFILE ---- //
    useIndustryProfileQuery,
    useGetIndustryFavByCoordinatorQuery,
    useUpdateIndustryProfileMutation,
    useUpdateIndustryDataMutation,
    useGetIndustryOnboardingQuery,
    useGetSectorsWorkplaceTypeOnboardingQuery,

    // ------ AVAILABLE SHIFTS ------ //
    useGetShiftsQuery,
    useAddShiftMutation,
    useRemoveShiftMutation,
    useGetAvailableShiftsQuery,
    useAddWorkingHoursMutation,

    // ---- COURSES ---- //
    useAddCourseMutation,
    useAddCoursesMutation,
    useGetAllIndustryCoursesQuery,
    useGetCourseDetailQuery,
    useRemoveCourseMutation,
    useUpdateCourseMutation,
    useGetIndustryCoursesQuery,
    useGetIndustrySectorsQuery,

    // --- EMPLOYEE --- //
    useGetEmployeeQuery,
    useGetEmployeeDetailQuery,
    useAddEmployeeMutation,
    useRemoveEmployeeMutation,
    useUpdateEmployeeMutation,
    useAddEmployeeTaskMutation,
    useDeleteEmployeeTaskMutation,
    useUpdateEmployeeTaskOnDragMutation,
    useChangeEmployeeTaskPriorityMutation,

    // --- EMPLOYEE TASK --- //
    useGetEmployeeTaskQuery,

    // ---- FOLDERS ---- //
    useGetIndustryDocumentsQuery,
    useAddFolderMutation,
    useAddDocumentMutation,
    useUpdateFolderMutation,
    useRemoveFolderMutation,
    useAddChecklistMutation,
    useDeleteDocumentMutation,
    useRemoveChecklistMutation,
    useUpdateChecklistMutation,
    useGetIndustrySectorRequiredDocsQuery,
    useAddIndustrySectorDocsOptionalMutation,
    useAddCustomIndustrySectorDocsOptionalMutation,
    useAddCustomIndustrySectorDocsMutation,
    useAddOrUpdateRequiredDocumentMutation,
    useUpdateCustomIndustrySectorDocsMutation,
    useRemoveCustomIndustrySectorDocsMutation,

    // --- STUDENTS ---//
    useIndustryStudentCountQuery,

    useGetIndustryStudentsQuery,
    useGetFutureCandidatesQuery,
    useGetIndustryStudentProfileQuery,

    // --- WORKPLACE --- //
    useSignAgreementMutation,
    useCompleteWorkplaceMutation,
    useAddNoteByIndustryMutation,
    useTerminateWorkplaceMutation,
    useAddFeedbackMutation,
    useAddReportMutation,
    useCancelWorkplaceMutation,
    useGetIndustryWorkplaceQuery,
    useGetIndustryWorkplaceDetailQuery,
    useGetIndustryPendingWorkplaceQuery,
    useGetAssessmentFoldersQuery,
    useAssessmentFolderResponseQuery,
    useGetIndustryRequiredDocsQuery,
    useGetIndustryStudentScheduleQuery,
    useUpdateScheduleForStudentMutation,
    useCreateScheduleForStudentMutation,
    useGetIndustryRequiredDocsResponseQuery,
    useWorkplaceActionsMutation,
    useGetIndustryWorkplaceFoldersQuery,
    useStartPlacementByIndustryMutation,

    // --- APPOINTMENTS --- //
    useGetIndustryAppointmentsQuery,
    useCreateIndustryAppointmentMutation,
    useIndustryCoordinatorAvailabilityQuery,

    // ----- JOB ----- //
    useAddJobMutation,
    useGetAllJobsQuery,
    useUpdateJobMutation,
    useRemoveJobMutation,
    useGetJobDetailQuery,
    useGetIndustryJobsQuery,
    useGetJobAppliedUserQuery,
    useJobChangeStatusMutation,
    useGetBrowseCandidatesQuery,

    // --- MESSAGE --- //
    useGetIndustryMessagesQuery,
    useSendIndustryMessageMutation,

    // ----- MOU ----- //
    useGetIndustryMOUQuery,
    useGetIndustryMOUDetailQuery,
    useGetDefaultMouContentQuery,
    useCreateMouByIndustryMutation,
    useCancelIndustryMOUMutation,
    useRejectIndustryMOUMutation,
    useAcceptMouByIndustryMutation,

    // --- NOTIFICATIONS --- //
    useGetIndustryNotificationsQuery,
    useGetNotificationDetailQuery,
    useReadNotificationMutation,

    // ----- RPL ----- //
    useGetRplQuery,
    useAddRplMutation,

    // ---- VOLUNTEER ---- //
    useRequestAVolunteerMutation,
    useVolunteerRequestsListQuery,
    useCancelVolunteerRequestMutation,

    // ---- SUPERVISORS ---- //
    useGetSupervisorQuery,
    useAddSupervisorMutation,
    useEditSupervisorMutation,
    useGetSupervisorBySectorQuery,
    useLazyGetSupervisorBySectorQuery,
    useRemoveSupervisorMutation,
    useGetCoursesBySupervisorLevelQuery,

    // ----- BRANCHES ----- //
    useGetBranchesQuery,

    // ----- HEADQUARTER ----- //
    useGetIndustryHeadQuarterQuery,

    // ----- TALENT POOL ---- //
    useGetMatchingProfilesListQuery,
    useGetMatchingProfileDetailQuery,
    useGetTalentPoolRequiredDocsQuery,
    useGetTalentPoolHiredProfilesQuery,
    useGetTalentPoolCountBySectorQuery,
    useSentConnectionRequestMutation,
    useGetTalentPoolProfileCountQuery,
    useReadTalentPoolProfileCountMutation,

    // ---- INSURANCE ---- //
    useGetIndustryInsuranceDocsQuery,
    useRequiredIndustryInsuranceTypeMutation,
    useGetIndustryInsuraceByIdQuery,

    // ---- GALLERY ---- //
    useIndustryGalleryQuery,
    useIndustryGalleryCountQuery,
    useAddIndustryGalleryMutation,
    useRemoveIndustryGalleryMutation,
} = industryApi

export const IndustryApi = {
    Profile: {
        useIndustryProfileQuery,
        useUpdateIndustryProfileMutation,
        useUpdateIndustryDataMutation,
        useIndustryFavByCoordinator: useGetIndustryFavByCoordinatorQuery,
        useIndustryOnboarding: useGetIndustryOnboardingQuery,
        useSectorsWorkplaceTypeOnboarding:
            useGetSectorsWorkplaceTypeOnboardingQuery,
    },
    AvailableShifts: {
        useGetShiftsQuery,
        useAddShiftMutation,
        useRemoveShiftMutation,
        useGetAvailableShiftsQuery,
        useAddWorkingHoursMutation,
    },
    Courses: {
        useGetAllIndustryCoursesQuery,
        useGetCourseDetailQuery,
        useAddCourseMutation,
        useAddCoursesMutation,
        useRemoveCourseMutation,
        useGetIndustryCoursesQuery,
        useGetIndustrySectorsQuery,
        useUpdateCourseMutation,
    },
    Employee: {
        useGetEmployeeQuery,
        useGetEmployeeDetailQuery,
        useAddEmployeeMutation,
        useRemoveEmployeeMutation,
        useUpdateEmployeeMutation,
        useAddEmployeeTaskMutation,
        useDeleteEmployeeTaskMutation,
        useUpdateEmployeeTaskOnDragMutation,
        useChangeEmployeeTaskPriorityMutation,
    },
    EmployeeTask: {
        useGetEmployeeTaskQuery,
    },
    Folders: {
        useGetIndustryDocumentsQuery,
        useAddFolderMutation,
        useAddDocumentMutation,
        useUpdateFolderMutation,
        useRemoveFolderMutation,
        useAddChecklistMutation,
        useDeleteDocumentMutation,
        useRemoveChecklistMutation,
        useUpdateChecklistMutation,
        useAddOrUpdateRequiredDocumentMutation,
        removeCustomDoc: useRemoveCustomIndustrySectorDocsMutation,
        updateIndustrySectorDoc: useUpdateCustomIndustrySectorDocsMutation,
        addCustomIndustryDocs: useAddCustomIndustrySectorDocsMutation,
        getIndustryRequiredDocs: useGetIndustrySectorRequiredDocsQuery,
        customeIndustryOptional: useAddCustomIndustrySectorDocsOptionalMutation,
        addIndustrySectorDocsOptional: useAddIndustrySectorDocsOptionalMutation,
    },
    Students: {
        useStudentCount: useIndustryStudentCountQuery,
        useGetIndustryStudentsQuery,
        useGetFutureCandidatesQuery,
        useGetIndustryStudentProfileQuery,
    },
    Workplace: {
        useSignAgreementMutation,
        useCompleteWorkplaceMutation,
        useAddNoteByIndustryMutation,
        useTerminateWorkplaceMutation,
        useAddFeedbackMutation,
        useAddReportMutation,
        useCancelWorkplaceMutation,
        useGetIndustryWorkplaceQuery,
        useResponse: useGetIndustryRequiredDocsResponseQuery,
        useRequiredDocs: useGetIndustryRequiredDocsQuery,
        useStudentSchedule: useGetIndustryStudentScheduleQuery,
        useUpdateSchedule: useUpdateScheduleForStudentMutation,
        useCreateSchedule: useCreateScheduleForStudentMutation,
        useFoldersResponse: useAssessmentFolderResponseQuery,
        useAssessmentFolders: useGetAssessmentFoldersQuery,
        usePendingWorkplaces: useGetIndustryPendingWorkplaceQuery,
        useWorkplaceDetail: useGetIndustryWorkplaceDetailQuery,
        useWorkplaceActionsMutation,
        useGetIndustryWorkplaceFoldersQuery,
        useStartPlacementByIndustryMutation,
    },
    Appointments: {
        useGetIndustryAppointmentsQuery,
        useCreateIndustryAppointmentMutation,
        useIndustryCoordinatorAvailabilityQuery,
    },
    Job: {
        useAddJobMutation,
        useGetAllJobsQuery,
        useUpdateJobMutation,
        useRemoveJobMutation,
        useGetJobDetailQuery,
        useGetIndustryJobsQuery,
        useAppliedUser: useGetJobAppliedUserQuery,
        useJobChangeStatusMutation,
        useGetBrowseCandidatesQuery,
    },
    Messages: {
        useGetIndustryMessagesQuery,
        useSendIndustryMessageMutation,
    },
    Mou: {
        useGetIndustryMOUQuery,
        useGetIndustryMOUDetailQuery,
        useGetDefaultMouContentQuery,
        useCreateMouByIndustryMutation,
        useCancelIndustryMOUMutation,
        useRejectIndustryMOUMutation,
        useAcceptMouByIndustryMutation,
    },
    Notification: {
        useGetIndustryNotificationsQuery,
        useGetNotificationDetailQuery,
        useReadNotificationMutation,
    },
    Rpl: {
        useGetRplQuery,
        useAddRplMutation,
    },
    Volunteer: {
        useRequestAVolunteerMutation,
        requestsList: useVolunteerRequestsListQuery,
        cancelVolunteerRequest: useCancelVolunteerRequestMutation,
    },
    Supervisor: {
        useGetSupervisor: useGetSupervisorQuery,
        addSupervisor: useAddSupervisorMutation,
        editSupervisor: useEditSupervisorMutation,
        getSupervisorBySector: useGetSupervisorBySectorQuery,
        useLazyGetSupervisorBySectorQuery: useLazyGetSupervisorBySectorQuery,
        removeSupervisor: useRemoveSupervisorMutation,
        useCoursesBySupervisorLevel: useGetCoursesBySupervisorLevelQuery,
    },
    Branches: {
        useBranchesList: useGetBranchesQuery,
    },
    HeadQuarter: {
        useHeadQuarterList: useGetIndustryHeadQuarterQuery,
    },
    TalentPool: {
        useMatchingProfilesList: useGetMatchingProfilesListQuery,
        useMatchingProfileDetail: useGetMatchingProfileDetailQuery,
        useRequiredDocsList: useGetTalentPoolRequiredDocsQuery,
        useSentRequestConnection: useSentConnectionRequestMutation,
        useTalentPoolHiredProfiles: useGetTalentPoolHiredProfilesQuery,
        useTalentPoolCountBySector: useGetTalentPoolCountBySectorQuery,
        useTalentPoolProfileCount: useGetTalentPoolProfileCountQuery,
        useReadTalentPoolProfileCount: useReadTalentPoolProfileCountMutation,
    },
    Insurance: {
        industryInsuranceDocs: useGetIndustryInsuranceDocsQuery,
        requiredInduranceDoc: useRequiredIndustryInsuranceTypeMutation,
        useIndustryInsuraceById: useGetIndustryInsuraceByIdQuery,
    },
    Gallery: {
        industryGallery: useIndustryGalleryQuery,
        addIndustryGallery: useAddIndustryGalleryMutation,
        industryGalleryCount: useIndustryGalleryCountQuery,
        removeIndustryGallery: useRemoveIndustryGalleryMutation,
    },
}
