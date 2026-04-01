// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AuthUtils } from '@utils'

// initialize an empty api service that we'll inject endpoints into later as needed

const adminTagTypes = [
    'Blog',
    'Tags',
    'SMS',
    'RPL',
    'Jobs',
    'RTOS',
    'Invoice',
    'Folders',
    'Profile',
    'Message',
    'Sectors',
    'Tickets',
    'Courses',
    'Students',
    'Documents',
    'Volunteer',
    'SubAdmins',
    'Industries',
    'Workplaces',
    'Departments',
    'Subscribers',
    'Generate-Key',
    'NotesTemplates',
    'Insurance-Type',
    'WorkplaceTypes',
    'BlogCategories',
    'SectorDocuments',
    'PremiumFeatures',
    'AllowRtoListing',
    'DefaultDocuments',
    'AppointmentTypes',
    'Upload-Blog-Image',
    'TalentPoolProfiles',
    'AutoAssignWorkplace',
    'Industry-Course-Program',
    'StudentForecast',
]

const subadminTagTypes = [
    'TODO',
    'Setting',
    'Logbook',
    'SubAdmin',
    'Department',
    'RTOListing',
    'Industries',
    'SetSchedule',
    'Appointment',
    'RtosListing',
    'Coordinates',
    'SubAdminRtos',
    'SubAdminReports',
    'SubAdminCourses',
    'SubAdminStudents',
    'SetUnAvailability',
    'SubAdmin-Students',
    'SubAdminWorkplace',
    'AssessmentEvidence',
    'SubAdminIndustries',
    'RequestToAddCourse',
    'IndustryResponseAdded',
]

const rtoTagTypes = [
    'RTO',
    'RTOMOU',
    'RTOCourses',
    'Rto-Students',
    'RTOWorkplace',
    'RtoDocuments',
    'RTO-Documents',
    'RTOIndustries',
    'RTO-V2-Courses',
    'RTOAppointment',
    'ContactPersons',
    'Rto-Coordinators',
    'RTOIndustryCredits',
    'RtoAssessmentToolsList',
]

const industryTagTypes = [
    'RPL',
    'Job',
    'MOU',
    'Course',
    'Message',
    'Branches',
    'Employee',
    'Document',
    'Students',
    'HeadQuarter',
    'EmployeeTask',
    'Notifications',
    'AvailableShifts',
    'TalentPoolCount',
    'Industry-Gallery',
    'MatchingProfiles',
    'RequestAVolunteer',
    'IndustryWorkplace',
    'IndustryAppointment',
]

const studentTagTypes = [
    'Feedback',
    'Workplace',
    'StudentJobs',
    'HighPriority',
    'StudentCourses',
    'StudentProfile',
    'Workplace-Apply',
    'StudentSchedule',
    'StudentDocuments',
    'IndustryFeedback',
    'StudentAppointments',
    'TalentPoolRequiredDocs',
    'StudentAssessmentEvidence',
    'StudentAssessmentEvidence',
]

const commonTagTypes = [
    'RTO',
    'User',
    'KPIS',
    'Count',
    'Draft',
    'Notes',
    'Mails',
    'Users',
    'Team',
    'Rating',
    'E-Sign',
    'Avatar',
    'Course',
    'Blogs',
    'States',
    'Country',
    'Profile',
    'Messages',
    'Industry',
    'SubAdmin',
    'Workplace',
    'MailCount',
    'Agreement',
    'WorkBased',
    'E-Signssss',
    'Statistics',
    'BulkStatus',
    'Email Sign',
    'MailsRecent',
    'Traineeship',
    'TeamMembers',
    'AI-Assistant',
    'Appointments',
    'Impersonation',
    'CallManagement',
    'E-Signsssssssss',
    'BulkUsersDelete',
    'RecentActivities',
    'StudentsWorkplace',
    'FutureIndustries',
    'AllNotifications',
    'AllCommunications',
    'WaitingForStudents',
    'StudentAppointments',
    'RunListingAutomation',
    'IndustriesAddProfile',
    'IndustryWorkplaceType',
]

const managementTypes = [
    'RemoveTeam',
    'TeamMembers',
    'KpiProgress',
    'KpiReportList',
    'TeamManagement',
    'KpiReportDocument',
]
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_END_POINT}/`,
        prepareHeaders: async (headers, { getState }) => {
            // const token = AuthUtils.getToken()
            const token = AuthUtils.token()

            // const session: any = await getSession()

            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            // if (session?.accessToken) {
            //     headers.set('authorization', `Bearer ${session?.accessToken}`)
            // }
            return headers
        },
    }),
    tagTypes: [
        ...rtoTagTypes,
        ...adminTagTypes,
        ...commonTagTypes,
        ...studentTagTypes,
        ...managementTypes,
        ...industryTagTypes,
        ...subadminTagTypes,
    ],

    endpoints: () => ({}),
})
