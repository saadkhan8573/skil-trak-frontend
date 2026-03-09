import { SubAdminApi } from '@queries'
import {
    IndustriesInRadiusTabsNav,
    TabProps,
} from './industriesInRadiusTabsNav'
import {
    FutureIndustriesInRadiusTab,
    SignedUpIndustriesInRadiusTab,
} from './industryListingTabs'

export const ListIndustriesInRadius = ({
    workplaceId,
    courseId,
    studentLocation,
    setSelectedBox,
}: any) => {
    const counts = SubAdminApi.Workplace.useMapIndustriesInRadiusCount(
        { id: courseId, wpId: workplaceId },
        { skip: !courseId && !workplaceId }
    )

    const tabs: TabProps[] = [
        {
            label: 'Signed Up',
            element: (
                <SignedUpIndustriesInRadiusTab
                    workplaceId={workplaceId}
                    courseId={courseId}
                    studentLocation={studentLocation}
                    setSelectedBox={setSelectedBox}
                />
            ),
        },
        {
            label: 'Future/Listing',
            element: (
                <FutureIndustriesInRadiusTab
                    workplaceId={workplaceId}
                    courseId={courseId}
                    studentLocation={studentLocation}
                    setSelectedBox={setSelectedBox}
                />
            ),
        },
    ]
    return (
        <div className="space-y-2">
            {/* <StatsCards counts={counts} /> */}

            <IndustriesInRadiusTabsNav tabs={tabs} />
        </div>
    )
}
