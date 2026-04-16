import { ReactElement, useEffect } from 'react'

import { Animations } from '@animations'
import {
    Button,
    DisplayPrimaryActions,
    RtoContextBarData,
    SidebarCalendar,
    usePermissionCheck,
} from '@components'
import { FigureCard } from '@components/sections/subAdmin'
import { AppointmentCard } from '@components/sections/subAdmin/components/Cards/AppointmentCard'
import { useContextBar, useJoyRide } from '@hooks'
import { SubAdminLayout } from '@layouts'
import { SubAdminApi } from '@queries'
import { NextPageWithLayout, PermissionType, UserStatus } from '@types'
import { getUserCredentials } from '@utils'

const SubAdminUsers: NextPageWithLayout = () => {
    const { checkPermission } = usePermissionCheck()
    const status = getUserCredentials()?.status

    const PrimaryLinks = [
        {
            title: 'RTOs',
            description: 'Manage Allocated RTOs',
            link: 'users/rtos',
            animation: Animations.Student.Workplace.Student,
            id: 'rtos',
            permissions: [PermissionType.MANAGE_RTOS],
        },
        {
            title: 'RTO Listing',
            description: 'RTO Listing',
            link: 'tasks/rto-listing?tab=all&page=1&pageSize=50',
            animation: Animations.Student.Appointments.RtoListing,
            id: 'rto-listing',
        },
        {
            title: 'Industries',
            description: 'Manage Allocated Industries',
            link: 'users/industries?tab=all',
            animation: Animations.Student.Appointments.AssessmentTool,
            id: 'industries',
            permissions: [PermissionType.MANAGE_INDUSTRIES],
        },
        {
            title: 'Industry Listing',
            description: 'Industry Listing',
            link: 'tasks/industry-listing?tab=all&page=1&pageSize=50',
            animation: Animations.Student.Appointments.IndustryListing,
            id: 'industry-listing',
            permissions: [PermissionType.ALLOW_INDUSTRY_LISTING],
        },
    ]

    const filteredActions = PrimaryLinks.filter((action) => {
        if (!action.permissions) return true
        return checkPermission(action.permissions)
    })

    const statistics = SubAdminApi.Count.statistics(undefined, {
        skip: status !== UserStatus.Approved,
    })
    const contextBar = useContextBar()
    useEffect(() => {
        contextBar.setContent(
            <>
                <Button variant={'dark'} text={'My Schedule'} />
                <SidebarCalendar />
                <RtoContextBarData />
            </>
        )
        contextBar.show(false)

        return () => {
            contextBar.setContent(null)
            contextBar.hide()
        }
    }, [])

    // USER JOY RIDE - Start
    const joyride = useJoyRide()

    useEffect(() => {
        if (joyride.state.tourActive) {
            setTimeout(() => {
                joyride.setState({ ...joyride.state, run: true, stepIndex: 1 })
            }, 1200)
        }
    }, [])
    // USER JOY RIDE - END
    return (
        <div className="flex flex-col">
            <div className="flex gap-x-6">
                {/* Primary Actions */}
                <div className="bg-white p-4 rounded-2xl shadow-xl shrink-0">
                    <DisplayPrimaryActions actions={filteredActions} />
                </div>

                {/* Figure Cards */}

                <div className="flex gap-y-2 flex-col w-full">
                    <div className="flex gap-x-2">
                        <FigureCard
                            imageUrl="/images/icons/rto.png"
                            count={statistics?.data?.rto}
                            title={'RTOs'}
                            link={'/portals/sub-admin/users/rtos'}
                        />
                        <FigureCard
                            imageUrl="/images/icons/students.png"
                            count={statistics?.data?.student}
                            title={'Students'}
                            link={'/portals/sub-admin/students?tab=all'}
                        />
                        <FigureCard
                            imageUrl="/images/icons/industry.png"
                            count={statistics?.data?.industry}
                            title={'Industries'}
                            link={'/portals/sub-admin/users/industries?tab=all'}
                        />
                    </div>

                    <AppointmentCard />
                </div>
            </div>

            {/* <div className="mt-6 flex justify-between">

                <HelpQuestionSet
                    title={'What you want to do here?'}
                    questions={RelatedQuestions}
                />


                <HelpQuestionSet
                    title={'What else you want to do?'}
                    questions={OtherQuestions}
                />
            </div> */}
        </div>
    )
}

SubAdminUsers.getLayout = (page: ReactElement) => {
    return (
        <SubAdminLayout pageTitle={{ title: 'Users' }}>{page}</SubAdminLayout>
    )
}

export default SubAdminUsers
