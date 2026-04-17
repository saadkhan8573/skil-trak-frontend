import { ReactElement, useEffect } from 'react'
// Layouts
import { SubAdminLayout } from '@layouts'
// Types
import { NextPageWithLayout, PermissionType } from '@types'
// Animations
import { Animations } from '@animations'
// Components
import { DisplayPrimaryActions } from '@components'
import { RecentAppointment } from '@partials/common'
// Hooks
import { useJoyRide, useSubadminProfile } from '@hooks'

// query
import { SubAdminApi } from '@queries'

const SubAdminTasks: NextPageWithLayout = () => {
    const statistics = SubAdminApi.Count.statistics()

    const subadmin = useSubadminProfile()

    // WORKPLACE JOY RIDE - Start
    const joyride = useJoyRide()

    useEffect(() => {
        if (joyride.state.tourActive) {
            setTimeout(() => {
                joyride.setState({ ...joyride.state, run: true, stepIndex: 1 })
            }, 1200)
        }
    }, [])

    const PrimaryLinks = [
        {
            title: 'Workplace Requests',
            description: 'Student Workplace',
            link: 'tasks/workplace?tab=all&subTab=case-officer-not-assigned',
            animation: Animations.Student.Appointments.Workplace,
            id: 'workplace',
            badge: {
                text: statistics?.data?.workplaceRequest,
                loading: statistics.isLoading,
            },
            permissions: [PermissionType.PLACEMENT_REQUESTS],
        },
        {
            title: 'Appointments',
            description: 'Appointments',
            link: 'tasks/appointments',
            animation: Animations.Student.Appointments.AppointmentsSec,
            id: 'appointments',
            permissions: [PermissionType.MANAGE_APPOINTMENTS],
        },
        {
            title: 'Assessment Submissions',
            description: ' ',
            link: subadmin?.isAssociatedWithRto
                ? 'tasks/assessment-evidence?tab=allDocumentSubmitted'
                : 'tasks/assessment-evidence?tab=pending',
            animation: Animations.Student.Appointments.Submissions,
            id: 'assessment-evidence',
            badge: {
                text: statistics?.data?.assessmentEvidence,
                loading: statistics.isLoading,
            },
            permissions: [PermissionType.SUBMISSIONS],
        },
        // {
        //     title: 'My Student Report',
        //     description: 'My Student Report',
        //     link: 'tasks/my-students-report',
        //     animation: Animations.Student.Appointments.MyStudentsReport,
        //     id: 'my-student-report',
        // },
    ]

    // WORKPLACE JOY RIDE - END
    return (
        <div className="flex flex-col">
            <div className="flex items-start gap-x-6">
                {/* Primary Actions */}
                <div className="bg-white min-w-40 p-4 rounded-2xl shadow-xl flex-shrink-0">
                    <DisplayPrimaryActions actions={PrimaryLinks} />
                </div>

                {/* Special Cards */}
                <div className="w-full flex flex-col justify-center space-y-2">
                    {/* <PlacementProgressCard
                        placementProgress={'Query'}
                    /> */}
                    <RecentAppointment
                        link={'/portals/sub-admin/tasks/appointments'}
                    />
                </div>
            </div>
        </div>
    )
}

SubAdminTasks.getLayout = (page: ReactElement) => {
    return (
        <SubAdminLayout pageTitle={{ title: 'Tasks' }}>{page}</SubAdminLayout>
    )
}

export default SubAdminTasks
