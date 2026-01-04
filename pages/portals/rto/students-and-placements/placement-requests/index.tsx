import { Card, TabNavigation, TabProps } from '@components'
import { RtoLayoutV2 } from '@layouts'
import {
    PlacementRequestStats,
    StudentProvidedWorkplaceTab,
    StudentsNeedWorkplaceTab,
} from '@partials'
import { ActionRequiredHeader, Title } from '@partials/rto-v2/components'
import { RtoV2Api } from '@queries'
import { Briefcase } from 'lucide-react'
import { ReactElement } from 'react'

export const PlacementRequests = () => {
    const tabs: TabProps[] = [
        {
            label: 'Student Need Workplace',
            href: {
                pathname: 'placement-requests',
                query: { tab: 'student-need-wp' },
            },
            element: <StudentsNeedWorkplaceTab />,
        },
        {
            label: 'Student Provided Workplace',
            href: {
                pathname: 'placement-requests',
                query: { tab: 'student-provided-wp' },
            },
            element: <StudentProvidedWorkplaceTab />,
        },
    ]
    const count = RtoV2Api.PlacementRequests.useStudentPlacementRequestStats()

    return (
        <div className="">
            <ActionRequiredHeader
                icon={Briefcase}
                title="Student Placement Requests"
                description="Manage student placement requests, workplace matching, and eligibility verification"
                pendingLabel="High Priority"
                gradientFrom="[#044866]"
                gradientTo="[#044866]"
                iconGradient="from[#044866] to-[#044866]"
            />

            <PlacementRequestStats
                totalRequests={count?.data?.all || 0}
                needsWorkplaceCount={count?.data?.requested || 0}
                providedWorkplaceCount={count?.data?.provided || 0}
            // activePlacementsCount={10}
            />

            <Card
                noPadding
                className="border border-border/50 shadow-premium-lg"
            >
                <div className="border-b p-6">
                    <Title Icon={Briefcase} title="Placement Requests" />
                </div>

                <TabNavigation tabs={tabs}>
                    {({ header, element }: any) => (
                        <div>
                            <div>{header}</div>
                            <div className="p-4">{element}</div>
                        </div>
                    )}
                </TabNavigation>
            </Card>
        </div>
    )
}

PlacementRequests.getLayout = (page: ReactElement) => {
    return (
        <RtoLayoutV2
            titleProps={{
                Icon: Briefcase,
                title: 'Student Placement Requests',
                description: 'Manage student placement requests',
            }}
        >
            {page}
        </RtoLayoutV2>
    )
}

export default PlacementRequests
