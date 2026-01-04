import { allCommunicationEndpoints } from './allCommunication'
import { appointmentsEndpoints } from './appointments'
import { changeProfileImageEndpoints } from './changeProfileImage'
import { coursesEndpoints } from './courses'
import { impersonationEndpoints } from './impersonation'
import { industriesEndpoints } from './industries'
import { mailsEndpoints } from './mails'
import { notesEndpoints } from './notes'
import { notificationsEndpoints } from './notifications'
import { rtosEndpoints } from './rtos'
import { teamsEndpoints } from './teams'

import { LogoutType } from '@hooks'
import { apiSlice } from '@queries/portals/empty.query'
import { PaginationValues, UserStatus } from '@types'
import { agreementsEndpoints } from './agreement'
import { allowLoginEndpoints } from './allowLogin'
import { draftEndpoints } from './draft'
import { eSignEndpoints } from './eSign'
import { findWorkplaceEndpoints } from './findWorkplaces'
import { studentAssessmentGalleryEndpoints } from './studentAssessmentGallery'
import { studentFeedbackEndpoints } from './studentFeedback'
import { ticketEndpoints } from './ticket.query'
import { traineeshipProgramEndpoints } from './traineeshipProgram'
import { workBasedProgramEndpoints } from './workBasedProgram'
import { aiAssistantEndpoints } from './ai-assistant'
import { callManagementLoginEndpoints } from './callManagement'

export const commonApi = apiSlice.injectEndpoints({
    // ---------- COMMON ENDPOINTS ---------- //
    endpoints: (build) => ({
        getSerchedPlaces: build.query<any, any>({
            query: (text) =>
                `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${text}&key=${process.env.NEXT_PUBLIC_MAP_KEY}`,
            providesTags: ['Documents'],
        }),
        downloadAssessmentTool: build.query<any, number>({
            query: (id) => `shared/assessment-tool/download/${id}`,
            providesTags: ['Documents'],
        }),
        updateExpiryDate: build.mutation<
            any,
            {
                id: number | undefined
                body: { expiryDate: Date; comment: string }
            }
        >({
            query: ({ id, body }) => ({
                url: `shared/student/update-expiry/${id}`,
                method: 'POST',
                body: body,
            }),
            invalidatesTags: [
                'Students',
                'SubAdminStudents',
                'Notes',
                'AllCommunications',
            ],
        }),
        bulkUserRemove: build.mutation({
            query: (ids: number[]) => ({
                url: `shared/bulk/users/remove`,
                method: 'DELETE',
                params: { users: ids },
            }),
            invalidatesTags: ['BulkUsersDelete'],
        }),
        bulkStatus: build.mutation<any, any>({
            query: ({ ids, status }) => ({
                url: `admin/user/status/update`,
                method: 'PATCH',
                params: { status },
                body: { ids },
            }),
            invalidatesTags: ['BulkStatus', 'Industries', 'Students'],
        }),
        getCommonDocuments: build.query<any, void>({
            query: () => `admin/documents/list`,
            providesTags: ['Documents'],
        }),
        getCountries: build.query<any, any>({
            query: () => `country`,
            providesTags: ['Country'],
        }),
        getCountriesList: build.query<any, void>({
            query: () => `country/list/name`,
            providesTags: ['Country'],
        }),
        getStates: build.query<any, PaginationValues>({
            query: (params) => ({
                url: `country/states`,
                params,
            }),
            providesTags: ['States'],
        }),
        getCountryStates: build.query<any, any>({
            query: (id) => `country/states/list/${id}`,
            providesTags: ['States'],
        }),
        getUserWebsiteCount: build.query<any, void>({
            query: () => `admin/students/industries/active-count`,
            providesTags: ['States'],
        }),
        countryAdd: build.mutation<any, any>({
            query: (body: any) => ({
                url: `country`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Country'],
        }),
        stateAdd: build.mutation<any, any>({
            query: (body: any) => ({
                url: `country/states`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Country'],
        }),
        deleteState: build.mutation<any, any>({
            query: (id: any) => ({
                url: `country/state/remove/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Country'],
        }),
        deleteCountry: build.mutation<any, any>({
            query: (id: any) => ({
                url: `country/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Country'],
        }),
        getSpecificUserDocuments: build.query<any, number>({
            query: (id) => ({
                url: `admin/documents/for-student/list`,
                params: { rto: id },
            }),
            providesTags: ['Documents'],
        }),
        getCoursesFolders: build.query<any, void>({
            query: () => ({
                url: `shared/industry/courses/folder`,
            }),
            providesTags: ['Documents'],
        }),

        getRecentActivities: build.query<
            any,
            {
                search?: string
                currentDate?: number
                startDate?: string
                endDate?: string
                last7days?: any
                skip?: number
                limit?: number
                coordinator?: number
                objectId?: number
            }
        >({
            query: (params) => ({
                url: `activity-logger`,
                params,
            }),
            providesTags: ['RecentActivities'],
        }),
        getSubAdminActivitiesAsAdmin: build.query<
            any,
            {
                search?: string
                currentDate?: number
                startDate?: string
                endDate?: string
                last7days?: any
                skip?: number
                limit?: number
                coordinator?: any
                // objectId?: number
            }
        >({
            query: (params) => ({
                url: `activity-logger/list`,
                params,
            }),
            providesTags: ['RecentActivities'],
        }),

        perFormAcivityOnLogout: build.mutation<
            any,
            { type?: LogoutType | undefined }
        >({
            query: (body) => ({
                url: 'auth/log/out',
                method: 'POST',
                body,
            }),
        }),

        getRecentActivitiesCount: build.query<
            any,
            {
                search?: string
                currentDate?: number
                startDate?: string
                endDate?: string
                last7days?: any
                user?: number
            }
        >({
            query: (params) => ({
                url: `subadmin/activity-logger/count`,
                params,
            }),
            providesTags: ['RecentActivities'],
        }),
        getIndustryRecentActivities: build.query<
            any,
            {
                search?: string
                currentDate?: number
                startDate?: string
                endDate?: string
                last7days?: any
                skip?: number
                limit?: number
                id?: number
            }
        >({
            query: ({ id, ...params }) => ({
                url: `shared/industry/history/${id}`,
                params,
            }),
            providesTags: ['RecentActivities'],
        }),

        changeUserStatus: build.mutation<
            any,
            { id: number; status: UserStatus }
        >({
            query: ({ id, status }) => ({
                url: `shared/user/status/update`,
                method: 'PATCH',
                params: { id },
                body: { status },
            }),
            invalidatesTags: ['User', 'SubAdmins'],
        }),

        getUserPassword: build.query<any, number>({
            query: (id) => `auth/view/password/${id}`,
            providesTags: ['User'],
        }),
        contactUs: build.mutation<any, any>({
            query: (body) => ({
                url: 'website-messages/create',
                method: 'POST',
                body,
            }),
        }),

        ourStoryContactUs: build.mutation<any, any>({
            query: (body) => ({
                url: 'website-messages/our-story',
                method: 'POST',
                body,
            }),
        }),

        // Sit map industries
        getSiteMapIndustries: build.query<any, any>({
            query: (params) => {
                return {
                    url: `industries/home-page/list`,
                    params,
                }
            },
            providesTags: ['Industries'],
        }),
        // Site map students
        getStudentsSubAdminMap: build.query<any, any>({
            query: (params) => {
                return {
                    url: `/students/list/for-map`,
                    params,
                }
            },
            providesTags: ['Students'],
        }),
        // Blog detail page
        getSingleBlog: build.query<any, any>({
            query: (slugUrl) => {
                return {
                    url: `/blogs/slug/${slugUrl}`,
                }
            },
            providesTags: ['Blogs'],
        }),
        // Verify Email
        getVerifyEmailHistory: build.query<any, any>({
            query: (id) => {
                return {
                    url: `shared/user/${id}/email-verification-history`,
                }
            },
            providesTags: ['Blogs'],
        }),
        verifyUserEmail: build.mutation<any, any>({
            query: ({ userId, body }) => ({
                url: `/shared/user/${userId}/email-verify`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: [
                'SubAdminIndustries',
                'Industries',
                'SubAdminRtos',
                'SubAdminStudents',
                'RTOIndustries',
            ],
        }),
        // shared/coordinator/retrieve/by-role
        getCoordinatorByRole: build.query<any, void>({
            query: () => ({
                url: `/shared/coordinator/retrieve/by-role`,
            }),
            providesTags: ['TeamMembers'],
        }),

        ...rtosEndpoints(build),
        ...draftEndpoints(build),
        ...notesEndpoints(build),
        ...mailsEndpoints(build),
        ...eSignEndpoints(build),
        ...ticketEndpoints(build),
        ...coursesEndpoints(build),
        ...industriesEndpoints(build),
        ...allowLoginEndpoints(build),
        ...agreementsEndpoints(build),
        ...aiAssistantEndpoints(build),
        ...appointmentsEndpoints(build),
        ...notificationsEndpoints(build),
        ...findWorkplaceEndpoints(build),
        ...impersonationEndpoints(build),
        ...studentFeedbackEndpoints(build),
        ...workBasedProgramEndpoints(build),
        ...allCommunicationEndpoints(build),
        ...changeProfileImageEndpoints(build),
        ...traineeshipProgramEndpoints(build),
        ...studentAssessmentGalleryEndpoints(build),
        ...teamsEndpoints(build),
        ...callManagementLoginEndpoints(build),
    }),
    // overrideExisting: true,
})

const {
    useGetUserWebsiteCountQuery,
    useGetCoordinatorByRoleQuery,
    useRegisterByFutureIndustryMutation,

    useGetUserPasswordQuery,

    usePerFormAcivityOnLogoutMutation,

    useDownloadAssessmentToolQuery,
    useBulkUserRemoveMutation,
    useContactUsMutation,
    useOurStoryContactUsMutation,

    useGetSerchedPlacesQuery,
    useVerifyUserEmailMutation,
    useGetVerifyEmailHistoryQuery,
    // Site MAP
    useGetSiteMapIndustriesQuery,
    useGetStudentsSubAdminMapQuery,
    useGetSingleBlogQuery,
    // ---- EXPIRY DATE ---- //
    useUpdateExpiryDateMutation,

    // ------ Industry ------ //
    useGetAllIndustriesQuery,
    useSnoozeIndustryMutation,
    useAddProfileVisitorQuery,
    useViewProfileVisitorQuery,
    useUnSnoozeIndustryMutation,
    useIsIndustryHiringMutation,
    useAllGetIndustriesListQuery,
    useGetAllAdvertisedJobsQuery,
    useGetAdvertisedJobCountQuery,
    useGetAdvertisedJobDetailQuery,
    useApplyForJobFromHomePageMutation,
    useIndustryBranchesAddressListQuery,
    useIndustryBranchesCountsQuery,
    useRemoveIndustryBranchAddressMutation,
    useUpdateIndustryBranchAddressMutation,
    useAddIndustryBranchesAddressMutation,
    useGetBulkEmailSubadminIndustriesQuery,
    useGetCoursesFoldersQuery,
    useAddIndustryWpTypeMutation,
    useRemoveIndustryWPTypeMutation,
    useGetIndustryWPTypeQuery,
    useGetIndustriesWPTypeListQuery,
    useGetIndustryEligibilityCriteriaQuery,
    useUpdateIndustryEligibilityCriteriaMutation,
    useToggleIndustryPremiumFeatureMutation,
    useGetIndustryPremiumFeaturesQuery,
    useToggleIndustryPremiumSubFeaturesMutation,
    useGetPremiumFeaturesListQuery,
    useGetPremiumFeatureFlagQuery,

    useGetAllRtosQuery,
    useGetRtosListQuery,
    useGetRtoWpTypesQuery,
    useAddRtoWpTypeMutation,
    useRemoveRtoWpTypeMutation,
    useGetFilterSubAdminRtosQuery,

    useGetAllCoursesQuery,

    // ----- AVATAR ----- //
    useChangeProfileMutation,
    useRemoveProfileMutation,

    // ------ NOTES ------ //
    useNotesQuery,
    useNotesPinnedQuery,
    useNoteCreateMutation,
    useNoteUpdateMutation,
    useNoteRemoveMutation,
    useGetNotesTemplateQuery,
    useNoteStatusChangeMutation,

    // --- COMMUNICATIONS --- //
    useCommunicationsQuery,

    // --- MAILS --- //
    useGetMessagesQuery,
    useSendMessageMutation,
    useGetAllMailsQuery,
    useIsSeenMutation,
    useMultiplesMailsSeenMutation,
    useGetMailDetailQuery,
    useGetRecentMailsQuery,
    useSendCustomEmailMutation,
    useGetAllConversationsQuery,
    useGetUsersAllMailQuery,
    useRemoveMailMutation,
    useRemoveMultipleMailMutation,
    useGetSingleChatQuery,
    useCountUnreadMessageQuery,
    useGetAllMailsListQuery,
    useGetAllSentMailsListQuery,
    useGetMailsByStatusQuery,
    useGetAllTemplatesQuery,
    useGetTemplateQuery,
    useSendBulkMailMutation,
    useUpdateEmailDraftMutation,
    useSearchBulkMailStudentsQuery,
    useSearchBulkMailSubadminRTOsQuery,
    useSearchBulkMailSubadminStudentsQuery,
    useCreateNewDraftMutation,
    useRemoveDraftMutation,

    // -- APPOINTMENTS -- //
    useGetAppointmentsTypesQuery,
    useCreateAppointmentMutation,
    useGetBookedAppointmntsQuery,
    useAppointmentDetailQuery,
    useCancellAppointmentMutation,
    useAddNoteOnAppointmentMutation,
    useApprovePendingAppointmentMutation,
    useGetAppointmentsAvailableSlotsQuery,
    useUpdateAppointmentSuccessfullStatusMutation,
    useGetRescheduleAppointmentsAvailableSlotsQuery,
    useAllCoordinatorsQuery,
    useCoordinatorAvailablityQuery,
    useGetUpcommingAppointmentQuery,
    useRescheduleAppointmentMutation,
    useGetAppointmentCompletionStatusQuery,
    useGetAppointmentCompletionStatusIndustryQuery,
    useGetStudentAgreementAndScheduleStatusQuery,

    // ------ Notifications ------ //
    useGetNotificationsQuery,
    useIsReadNotificationMutation,
    useGetPlacementNotificationsQuery,

    // ------ Bulk Status ------ //
    useBulkStatusMutation,
    // ------ Recent Activities ------ //
    useGetRecentActivitiesQuery,
    useGetSubAdminActivitiesAsAdminQuery,
    useGetRecentActivitiesCountQuery,
    useGetIndustryRecentActivitiesQuery,

    // ---- DOCUMENTS ---- //
    useGetCommonDocumentsQuery,
    useGetSpecificUserDocumentsQuery,
    // ---- COUNTRIES ---- //
    useGetCountriesQuery,
    useGetCountriesListQuery,
    useGetStatesQuery,
    useGetCountryStatesQuery,
    useCountryAddMutation,
    useStateAddMutation,
    useDeleteStateMutation,
    useDeleteCountryMutation,

    // ---- USER ---- //
    useChangeUserStatusMutation,
    // ---- COURSE ---- //
    useGetCoursesListQuery,
    useGetSectorWPTypesQuery,
    useGetAllCoursesByRtoQuery,
    useGetSectorByCourseIdQuery,
    useGetAppointmentCoursesQuery,
    useGetCoursesListBySectorQuery,
    useGetSubadminCoursesListQuery,

    // ---- AGREEMENT ---- //
    useViewSignedAgreementQuery,

    // ---- DRAFT ---- //
    useSetEmailDarftMutation,
    useGetEmailDarftQuery,
    useSetNoteDarftMutation,
    useGetNoteDarftQuery,

    // ---- TICKETS ---- //
    useGetTicketQuery,
    useGetDepartmentTicketQuery,
    useAddReplyMutation,
    useUpdateReplyMutation,
    useGetAllTicketQuery,
    useGetTicketCountQuery,
    useCloseTicketMutation,
    useCreateTicketMutation,
    useGetTicketDetailQuery,
    useForwardTicketMutation,
    useGetTicketRepliesQuery,
    useSeenTicketReplyMutation,
    useGetTicketsListByUserQuery,
    useGetStudentTicketsListQuery,

    // ----- STUDENTASSESSMENTFILES ----- //
    useGalleryFileViewDetailQuery,
    useGetAllRtoGalleryStudentsQuery,
    useGetAllStudentAssessmentFilesQuery,
    useMakeAsHighPriorityMutation,

    // ----- FIND WORKPLACE ----- //
    useAddIndustryMutation,
    useAddToSignupMutation,
    useViewListingNoteQuery,
    useUpdateIndustryMutation,
    useFindIndustriesCountQuery,
    useGetAllFindWorkplacesQuery,
    useSubmitAutoListingMutation,
    useGetMapFutureIndustriesQuery,
    useRunListingAutomationMutation,
    useListingAutomationDetailsQuery,
    useUpdateEligibilityListingMutation,
    useGetMapFutureIndustriesInRadiusQuery,
    useGetFutureIndustryListingByStateQuery,
    useGetFindWorkplacesCountQuery,
    useGetFindWorkplacesCountByStatesQuery,
    useImportIndustriesListMutation,
    useRemoveFutureIndustryMutation,
    useUpdateFutureIndustryNoteMutation,
    useGetFutureIndustryDetailQuery,
    useIndustriesStatusChangeMutation,
    useRemoveMultiFutureIndustryMutation,
    useAddFutureIndustryListingNoteMutation,
    useMultipleIndustriesStatusChangeMutation,
    useImportIndustriesWithoutEmailListMutation,
    useGetDepartmentFutureIndustriesListQuery,
    useChangePendingIndustryStatusMutation,
    useGetDepartmentApprovedIndustryListQuery,
    useGetIndustryListingProfileDetailsQuery,
    useGetIndustryListingNotesQuery,
    useAddIndustryListingDetailsNoteMutation,
    useComposeListingIndustryMailMutation,
    useGetListingIndustryMailsQuery,
    useFutureIndustryContactedMutation,
    useFutureIndustryCallLogMutation,
    useGetContactedFutureIndustriesListQuery,
    useFutureIndustryInterestMutation,

    // Impersonation
    useImpersonationToggleMutation,
    useAllowAsAdminMutation,

    // ---- ESIGN ---- //
    useGetEsignListQuery,
    useSaveEsignMutation,
    useGetEsignRtosQuery,
    useCancelESignMutation,
    useGetTabsForUsersQuery,
    useInitiateESignMutation,
    useGetEsignTemplateQuery,
    useAddSignForUserMutation,
    useUpdateSignDateMutation,
    useRemoveTemplateMutation,
    useCheckIfUserSignedQuery,
    useGetIndustryEsignListQuery,
    useGetDocumentForUsersQuery,
    useSaveIndustryEsignMutation,
    useSaveEsignTemplateMutation,
    useChangeEsignStatusMutation,
    useGetEsignTemplateTabsQuery,
    useGetSubadminEsignListQuery,
    useGetESignStudentDetailQuery,
    useRemoveTemplateTabsMutation,
    useGetIndustryAllEsignListQuery,
    useGetIndustryEsignDetailQuery,
    useGetIndustryEsignDocsQuery,
    useGetIndustryPendingDocsQuery,
    useInitiateIndustryESignMutation,
    useGetTemplatePagesCountQuery,
    useUpdateIndustryEsignMutation,
    useSignDocumentByUserMutation,
    useAddCustomFieldDataMutation,
    useResendEmailToUserMutation,
    usePendingDocumentsCountQuery,
    useGetEsignTemplateDetailQuery,
    useGetESignTemplateDetailQuery,
    useCancelEsignDocumentMutation,
    useGetCoordinatorsByCourseQuery,
    useDownloadTemplateTabsQuery,
    useDownloadEsignDocumentQuery,
    useToggleReminderEmailMutation,
    usePreviewAsSignerTemplateQuery,
    useRequestResignForESignMutation,
    useViewStudentEsignDocumentQuery,
    useGetTotalPagesForDocumentsQuery,
    useUsersPendingDocumentsListQuery,
    useAddEmailCustomFieldDataMutation,
    useUpdateEsignTemplateDetailMutation,
    useGetUserTemplateDocumentForSignQuery,
    useGetUserSignatureTabForTemplateQuery,
    useGetEsignDocumentsCountQuery,

    // ---- Traineeship ---- //
    useGetTraineeshipProgramQuery,
    useAddTraineeshipProgramMutation,
    useGetTraineeshipProgramCountQuery,
    useContactTraineeshipProgramMutation,

    // ---- WORK BASED ---- //
    useGetWorkBasedProgramQuery,
    useGetContactUsQueriesQuery,
    useGetContactUsQueriesCountQuery,
    useAddWorkBasedProgramMutation,
    useBookADemoMutation,
    useListBookDemoQuery,
    useGetWorkBasedProgramCountQuery,
    useContactWorkBasedProgramMutation,
    useContactContactUsQueriesMutation,
    useGetWorkBasedProgramAndTraineeshipCountQuery,

    // ---- FEEDBACK ---- //
    useStudentFeedbackMutation,
    useGetStudentCoordinatorFeedbackQuery,
    useSubmitCoordinatorFeedbackMutation,
    useGetUserReviewForCoordinatorQuery,
    usePlacementFeedbackMutation,
    useGetCourseSchedulesQuery,
    useGetPlacementFeedbackQuery,
    useGetOverAllIndustryRatingsFromStudentQuery,
    useGetIndustryFeedbackListFromStudentQuery,

    // ---- ALLOW LOGIN ---- //
    useAllowAsLoginMutation,

    // ---- Students ---- //
    useSearchAllPortalStudentsQuery,

    // ---- AI ASSISTANT ---- //
    useSearchStudentQuery,
    useAskAiAboutStudentMutation,
    useAiStudentSearchDetailQuery,
    useStudentWorkplaceRequestQuery,

    // --------- TEAMS -------------//
    useCreateSupportTeamMutation,
    useEditSupportTeamMutation,
    useGetAllSupportTeamsQuery,
    useDeleteSupportTeamMutation,
    useGetTeamCountsQuery,
    useGetAutomatedTicketsQuery,
    useGetAutomatedTicketDetailsQuery,
    useUpdateAutoTicketPriorityMutation,
    useUpdateAutoTicketStatusMutation,
    useAddAutoTicketNoteMutation,
    useGetAutomatedTicketNotesQuery,
    useGetSupportTeamsListQuery,
    useGetSupportTeamMemberListQuery,
    useGetAutomatedTicketsCountQuery,
    // --------- Call Management ----------- //
    useGetAllAiCallListQuery,
} = commonApi

export const CommonApi = {
    Student: {
        searchAllPortalStudents: useSearchAllPortalStudentsQuery,
    },
    Website: {
        useGetUserWebsiteCountQuery,
        useGetSingleBlog: useGetSingleBlogQuery,
    },
    ViewPassword: {
        getUserPassword: useGetUserPasswordQuery,
    },
    LogoutActivity: {
        perFormAcivityOnLogout: usePerFormAcivityOnLogoutMutation,
    },
    SearchPlaces: {
        useGetSerchedPlaces: useGetSerchedPlacesQuery,
        studentsMap: useGetStudentsSubAdminMapQuery,
    },
    Download: {
        downloadAssessmentTool: useDownloadAssessmentToolQuery,
    },
    changeUserStatus: {
        useChangeStatus: useBulkStatusMutation,
    },
    Expiry: {
        useExpiryDate: useUpdateExpiryDateMutation,
    },
    Avatar: {
        useChangeProfile: useChangeProfileMutation,
        useRemoveProfile: useRemoveProfileMutation,
    },
    Filter: {
        useIndustries: useGetAllIndustriesQuery,
        useRtos: useGetAllRtosQuery,
        useCourses: useGetAllCoursesQuery,
        useSubAdminRtos: useGetFilterSubAdminRtosQuery,
    },
    Rtos: {
        useRtosList: useGetRtosListQuery,
        getRtoWpTypes: useGetRtoWpTypesQuery,
        addRtoWpType: useAddRtoWpTypeMutation,
        removeRtoWpType: useRemoveRtoWpTypeMutation,
    },
    Industries: {
        getFolders: useGetCoursesFoldersQuery,
        jobsCount: useGetAdvertisedJobCountQuery,
        useList: useIndustryBranchesAddressListQuery,
        useBranchesCounts: useIndustryBranchesCountsQuery,
        useSnoozeIndustry: useSnoozeIndustryMutation,
        addIndustryWpType: useAddIndustryWpTypeMutation,
        getIndustryWPType: useGetIndustryWPTypeQuery,
        useAddProfileVisitor: useAddProfileVisitorQuery,
        useProfileVisitors: useViewProfileVisitorQuery,
        useUnSnoozeIndustry: useUnSnoozeIndustryMutation,
        useIndustriesList: useAllGetIndustriesListQuery,
        useIsIndustryHiring: useIsIndustryHiringMutation,
        useApplyForJob: useApplyForJobFromHomePageMutation,
        getAllAdvertisedJobs: useGetAllAdvertisedJobsQuery,
        removeIndustryWPType: useRemoveIndustryWPTypeMutation,
        getAdvertisedJobDetail: useGetAdvertisedJobDetailQuery,
        getIndustriesWPTypeList: useGetIndustriesWPTypeListQuery,
        addBranchesAddress: useAddIndustryBranchesAddressMutation,
        useUpdateIndustryBranch: useUpdateIndustryBranchAddressMutation,
        useRegisterByFutureIndustry: useRegisterByFutureIndustryMutation,
        useRemoveIndustryBranch: useRemoveIndustryBranchAddressMutation,
        bulkEmailSubadminIndustries: useGetBulkEmailSubadminIndustriesQuery,
        useIndustryEligibilityCriteria: useGetIndustryEligibilityCriteriaQuery,
        useUpdateIndustryEligibilityCriteria:
            useUpdateIndustryEligibilityCriteriaMutation,
        useToggleIndustryPremiumFeature:
            useToggleIndustryPremiumFeatureMutation,
        useIndustryPremiumFeatures: useGetIndustryPremiumFeaturesQuery,
        useToggleIndustryPremiumSubFeatures:
            useToggleIndustryPremiumSubFeaturesMutation,
        usePremiumFeaturesList: useGetPremiumFeaturesListQuery,
        usePremiumFeatureFlag: useGetPremiumFeatureFlagQuery,
    },
    Coordinators: {
        useCoordinatorByRole: useGetCoordinatorByRoleQuery,
    },
    Courses: {
        useCoursesList: useGetCoursesListQuery,
        getSectorWPTypes: useGetSectorWPTypesQuery,
        getCoursesByRto: useGetAllCoursesByRtoQuery,
        getSectorByCourseId: useGetSectorByCourseIdQuery,
        getCoursesBySector: useGetCoursesListBySectorQuery,
        subadminCoursesList: useGetSubadminCoursesListQuery,
        getAppointmentCourses: useGetAppointmentCoursesQuery,
    },

    Notes: {
        useList: useNotesQuery,
        usePinned: useNotesPinnedQuery,
        useCreate: useNoteCreateMutation,
        useUpdate: useNoteUpdateMutation,
        useRemove: useNoteRemoveMutation,
        getNotesTemplate: useGetNotesTemplateQuery,
        useStatusChange: useNoteStatusChangeMutation,
    },
    AllCommunication: {
        useCommunications: useCommunicationsQuery,
    },
    Messages: {
        useMessages: useGetMessagesQuery,
        useSendMessage: useSendMessageMutation,
        useAllMails: useGetAllMailsQuery,
        useMailCount: useCountUnreadMessageQuery,
        useIsSeen: useIsSeenMutation,
        multiplesMailsSeen: useMultiplesMailsSeenMutation,
        useMailDetail: useGetMailDetailQuery,
        useAllConversations: useGetAllConversationsQuery,
        useUserMails: useGetUsersAllMailQuery,
        sendCustomEmail: useSendCustomEmailMutation,
        useSingleChat: useGetSingleChatQuery,
        useRemoveMail: useRemoveMailMutation,
        useRemoveMultipleMails: useRemoveMultipleMailMutation,
        useRecentMails: useGetRecentMailsQuery,
        useAllMailsList: useGetAllMailsListQuery,
        useAllSentMails: useGetAllSentMailsListQuery,
        useMailsByStatus: useGetMailsByStatusQuery,
        useAllTemplates: useGetAllTemplatesQuery,
        useGetTemplate: useGetTemplateQuery,
        useSendBulkMail: useSendBulkMailMutation,
        useSearchBulkMailStudents: useSearchBulkMailStudentsQuery,
        useCreateDraft: useCreateNewDraftMutation,
        bulkMailSubadminStudents: useSearchBulkMailSubadminStudentsQuery,
        bulkMailSubadminRTOs: useSearchBulkMailSubadminRTOsQuery,
        useRemoveDraft: useRemoveDraftMutation,
        useUpdateEmailDraft: useUpdateEmailDraftMutation,
        useContactUs: useContactUsMutation,
        ourStoryContactUs: useOurStoryContactUsMutation,
    },
    Appointments: {
        appointmentType: useGetAppointmentsTypesQuery,
        createAppointment: useCreateAppointmentMutation,
        useApproveAppointment: useApprovePendingAppointmentMutation,
        useAppointmentsAvailableSlots: useGetAppointmentsAvailableSlotsQuery,
        getRescheduleAppointmentsAvailableSlots:
            useGetRescheduleAppointmentsAvailableSlotsQuery,
        updateSuccessFullStatus: useUpdateAppointmentSuccessfullStatusMutation,
        appointmentDetail: useAppointmentDetailQuery,
        cancellAppointment: useCancellAppointmentMutation,
        addNoteOnAppointment: useAddNoteOnAppointmentMutation,
        useBookedAppointments: useGetBookedAppointmntsQuery,
        allCoordinators: useAllCoordinatorsQuery,
        useCoordinatorAvailablity: useCoordinatorAvailablityQuery,
        useUpcommingAppointment: useGetUpcommingAppointmentQuery,
        rescheduleAppointment: useRescheduleAppointmentMutation,
        useAppointmentCompletionStatus: useGetAppointmentCompletionStatusQuery,
        useAppointmentCompletionStatusIndustry:
            useGetAppointmentCompletionStatusIndustryQuery,
        useStudentAgreementAndScheduleStatus:
            useGetStudentAgreementAndScheduleStatusQuery,
    },
    Notifications: {
        useNotifications: useGetNotificationsQuery,
        useIsReadNotification: useIsReadNotificationMutation,
        usePlacementNotifications: useGetPlacementNotificationsQuery,
    },
    Documents: {
        useList: useGetCommonDocumentsQuery,
        useGetSpecificUserDocuments: useGetSpecificUserDocumentsQuery,
    },
    Countries: {
        useCountries: useGetCountriesQuery,
        useStatesList: useGetStatesQuery,
        useCountryStatesList: useGetCountryStatesQuery,
        useAddCountry: useCountryAddMutation,
        useAddState: useStateAddMutation,
        useDeleteState: useDeleteStateMutation,
        useDelateCountry: useDeleteCountryMutation,
        useCountriesList: useGetCountriesListQuery,
    },
    RecentActivities: {
        useRecentActivities: useGetRecentActivitiesQuery,
        useSubAdminActivitiesAsAdmin: useGetSubAdminActivitiesAsAdminQuery,
        useRecentActivitiesCount: useGetRecentActivitiesCountQuery,
        useIndustryRecentActivities: useGetIndustryRecentActivitiesQuery,
    },
    User: {
        changeUserStatus: useChangeUserStatusMutation,
        bulkRemove: useBulkUserRemoveMutation,
    },
    Agreement: {
        viewAgreement: useViewSignedAgreementQuery,
    },
    Draft: {
        useEmailDraft: useSetEmailDarftMutation,
        useGetEmailDraft: useGetEmailDarftQuery,
        useSetNoteDarft: useSetNoteDarftMutation,
        getNoteDarft: useGetNoteDarftQuery,
    },
    Tickets: {
        useGetTicket: useGetTicketQuery,
        useDepartmentTicket: useGetDepartmentTicketQuery,
        useAddReply: useAddReplyMutation,
        useUpdateReply: useUpdateReplyMutation,
        useGetAllTicket: useGetAllTicketQuery,
        useGetDetail: useGetTicketDetailQuery,
        useCloseTicket: useCloseTicketMutation,
        useCreateTicket: useCreateTicketMutation,
        useForwardTicket: useForwardTicketMutation,
        useGetTicketReplies: useGetTicketRepliesQuery,
        useSeenTicketReply: useSeenTicketReplyMutation,
        useGetTicketCountQuery: useGetTicketCountQuery,
        useTicketListByUser: useGetTicketsListByUserQuery,
        useStudentTicketsList: useGetStudentTicketsListQuery,
    },
    StudentAssessmentFiles: {
        useMakeAsHighPriority: useMakeAsHighPriorityMutation,
        useGalleryFileViewDetail: useGalleryFileViewDetailQuery,
        useGetAllRtoGalleryStudents: useGetAllRtoGalleryStudentsQuery,
        useAllStudentAssessmentFiles: useGetAllStudentAssessmentFilesQuery,
    },
    FindWorkplace: {
        useAddIndustry: useAddIndustryMutation,
        useAddToSignup: useAddToSignupMutation,
        viewListingNoew: useViewListingNoteQuery,
        useAddFutureIndustryListingNote:
            useAddFutureIndustryListingNoteMutation,
        useUpdateIndustry: useUpdateIndustryMutation,
        submitAutoListing: useSubmitAutoListingMutation,
        useFindIndustriesCount: useFindIndustriesCountQuery,
        mapFutureIndustries: useGetMapFutureIndustriesQuery,
        runListingAutomation: useRunListingAutomationMutation,
        listingAutomationDetails: useListingAutomationDetailsQuery,
        updateEligibilityListing: useUpdateEligibilityListingMutation,
        useMapFutureIndustriesInRadius: useGetMapFutureIndustriesInRadiusQuery,
        listingByState: useGetFutureIndustryListingByStateQuery,
        importIndustriesList: useImportIndustriesListMutation,
        useGetAllFindWorkplaces: useGetAllFindWorkplacesQuery,
        useGetFindWorkplacesCount: useGetFindWorkplacesCountQuery,
        useGetFutureIndustryDetail: useGetFutureIndustryDetailQuery,
        useIndustriesStatusChange: useIndustriesStatusChangeMutation,
        useRemoveFutureIndustryMutation: useRemoveFutureIndustryMutation,
        useUpdateFutureIndustryNote: useUpdateFutureIndustryNoteMutation,
        useRemoveMultiFutureIndustry: useRemoveMultiFutureIndustryMutation,
        useMultipleStatusChange: useMultipleIndustriesStatusChangeMutation,
        importListWithoutEmail: useImportIndustriesWithoutEmailListMutation,
        useDepartmentFutureIndustriesList:
            useGetDepartmentFutureIndustriesListQuery,
        findWpCountsByStates: useGetFindWorkplacesCountByStatesQuery,
        useChangePendingIndustryStatus: useChangePendingIndustryStatusMutation,
        useDepartmentApprovedIndustryList:
            useGetDepartmentApprovedIndustryListQuery,
        useIndustryListingProfileDetails:
            useGetIndustryListingProfileDetailsQuery,
        useIndustryListingNotes: useGetIndustryListingNotesQuery,
        useAddIndustryListingDetailsNote:
            useAddIndustryListingDetailsNoteMutation,
        useComposeListingIndustryMail: useComposeListingIndustryMailMutation,
        useListingIndustryMails: useGetListingIndustryMailsQuery,
        useFutureIndustryContacted: useFutureIndustryContactedMutation,
        useFutureIndustryCallLog: useFutureIndustryCallLogMutation,
        useContactedFutureIndustriesList:
            useGetContactedFutureIndustriesListQuery,
        useFutureIndustryInterest: useFutureIndustryInterestMutation,
    },
    Impersonation: {
        useImpersonationToggle: useImpersonationToggleMutation,
        useAllowAsAdmin: useAllowAsAdminMutation,
    },
    ESign: {
        useGetEsign: useGetEsignListQuery,
        useSaveEsign: useSaveEsignMutation,
        useGetTabs: useGetTabsForUsersQuery,
        useGetEsignRtos: useGetEsignRtosQuery,
        useAddSign: useAddSignForUserMutation,
        useCancelESign: useCancelESignMutation,
        useInitiateESign: useInitiateESignMutation,
        useEsignTemplate: useGetEsignTemplateQuery,
        useGetDocument: useGetDocumentForUsersQuery,
        checkIfUserSigned: useCheckIfUserSignedQuery,
        useUpdateSignDate: useUpdateSignDateMutation,
        useRemoveTemplate: useRemoveTemplateMutation,
        useRemoveTabs: useRemoveTemplateTabsMutation,
        industryAllEsigns: useGetIndustryAllEsignListQuery,
        useSaveTemplate: useSaveEsignTemplateMutation,
        useChangeStatus: useChangeEsignStatusMutation,
        saveIndustryEsign: useSaveIndustryEsignMutation,
        pendingDocsCount: usePendingDocumentsCountQuery,
        useEsignCounts: useGetEsignDocumentsCountQuery,
        getIndustryEsignList: useGetIndustryEsignListQuery,
        useGetESignStudent: useGetESignStudentDetailQuery,
        addCustomFieldData: useAddCustomFieldDataMutation,
        useResendEmailToUser: useResendEmailToUserMutation,
        useSubadminEsignList: useGetSubadminEsignListQuery,
        cancelEsignDocument: useCancelEsignDocumentMutation,
        useSignDocumentByUser: useSignDocumentByUserMutation,
        getIndustryEsignDetail: useGetIndustryEsignDetailQuery,
        getIndustryEsignDocs: useGetIndustryEsignDocsQuery,
        initiateIndustryESign: useInitiateIndustryESignMutation,
        getIndustryPendingDocs: useGetIndustryPendingDocsQuery,
        useTamplatePagesCount: useGetTemplatePagesCountQuery,
        updateIndustryEsign: useUpdateIndustryEsignMutation,
        useGetEsignTemplateTabs: useGetEsignTemplateTabsQuery,
        useToggleReminderEmail: useToggleReminderEmailMutation,
        useEsignTemplateDetail: useGetEsignTemplateDetailQuery,
        useESignTemplateDetail: useGetESignTemplateDetailQuery,
        requestResignForESign: useRequestResignForESignMutation,
        useDownloadTemplateTabs: useDownloadTemplateTabsQuery,
        useDownloadEsignDocument: useDownloadEsignDocumentQuery,
        getCoordinatorsByCourse: useGetCoordinatorsByCourseQuery,
        useStudentEsignDocument: useViewStudentEsignDocumentQuery,
        useUpdateEsignDetail: useUpdateEsignTemplateDetailMutation,
        usePendingDocumentsList: useUsersPendingDocumentsListQuery,
        usePreviewAsSignerTemplate: usePreviewAsSignerTemplateQuery,
        useGetDocumentTotalPages: useGetTotalPagesForDocumentsQuery,
        addEmailCustomFieldData: useAddEmailCustomFieldDataMutation,
        useTemplateDocumentForSign: useGetUserTemplateDocumentForSignQuery,
        useSignatureTabForTemplate: useGetUserSignatureTabForTemplateQuery,
    },
    Traineeship: {
        useGetList: useGetTraineeshipProgramQuery,
        useCount: useGetTraineeshipProgramCountQuery,
        useAddTraineeship: useAddTraineeshipProgramMutation,
        useContactTraineeship: useContactTraineeshipProgramMutation,
    },
    WorkBased: {
        useCount: useGetWorkBasedProgramCountQuery,
        useWorkBasedList: useGetWorkBasedProgramQuery,
        useContactUsQueries: useGetContactUsQueriesQuery,
        useContactUsQueriesCount: useGetContactUsQueriesCountQuery,
        useAddWorkBased: useAddWorkBasedProgramMutation,
        useBookADemo: useBookADemoMutation,
        useListBookDemo: useListBookDemoQuery,
        useContactWorkBase: useContactWorkBasedProgramMutation,
        useContactContactUsQueries: useContactContactUsQueriesMutation,
        useWorkBaseAndTraineeCount:
            useGetWorkBasedProgramAndTraineeshipCountQuery,
    },
    Feedback: {
        useStudentFeedback: useStudentFeedbackMutation,
        useStudentFeedbackList: useGetStudentCoordinatorFeedbackQuery,
        submitCoordinatorFeedback: useSubmitCoordinatorFeedbackMutation,
        useUserReviewForCoordinator: useGetUserReviewForCoordinatorQuery,
        usePlacementFeedback: usePlacementFeedbackMutation,
        useGetCourseSchedules: useGetCourseSchedulesQuery,
        useGetPlacementFeedback: useGetPlacementFeedbackQuery,
        useOverAllIndustryRatingsFromStudent:
            useGetOverAllIndustryRatingsFromStudentQuery,
        useIndustryFeedbackListFromStudent:
            useGetIndustryFeedbackListFromStudentQuery,
    },
    AllowLogin: {
        useAllowAsLogin: useAllowAsLoginMutation,
    },
    AiAssistant: {
        searchStudent: useSearchStudentQuery,
        askAiAboutStudent: useAskAiAboutStudentMutation,
        aiStudentSearchDetail: useAiStudentSearchDetailQuery,
        studentWorkplaceRequest: useStudentWorkplaceRequestQuery,
    },
    Teams: {
        useCreateSupportTeam: useCreateSupportTeamMutation,
        useEditSupportTeam: useEditSupportTeamMutation,
        useAllSupportTeams: useGetAllSupportTeamsQuery,
        useDeleteSupportTeam: useDeleteSupportTeamMutation,
        useTeamCounts: useGetTeamCountsQuery,
        useAutomatedTickets: useGetAutomatedTicketsQuery,
        useAutomatedTicketDetails: useGetAutomatedTicketDetailsQuery,
        useUpdateAutoTicketPriority: useUpdateAutoTicketPriorityMutation,
        useUpdateAutoTicketStatus: useUpdateAutoTicketStatusMutation,
        useAddAutoTicketNote: useAddAutoTicketNoteMutation,
        useAutomatedTicketNotes: useGetAutomatedTicketNotesQuery,
        useTeamsList: useGetSupportTeamsListQuery,
        useSupportTeamMemberList: useGetSupportTeamMemberListQuery,
        useAutomatedTicketsCount: useGetAutomatedTicketsCountQuery,
    },
    CallManagement: {
        useAllAiCallList: useGetAllAiCallListQuery,
    },
}
