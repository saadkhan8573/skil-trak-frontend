import React, { ReactElement } from 'react'

import { NextPageWithLayout } from '@types'
import { AdminLayout } from '@layouts'
import {
    WpCancelationRequest,
    WpRejectionList,
    WpIndustryRejectedRequest,
    WpTerminationRequest,
} from '@partials/common'
import { TabNavigation, TabProps } from '@components'

const CancelledWorkplaceRequests: NextPageWithLayout = () => {
    const tabs: TabProps[] = [
        {
            label: 'Cancelled Workplace Requests',
            href: {
                pathname: '/portals/admin/cancelled-workplace-requests',
                query: {
                    tab: 'cancelled-workplace-requests',
                    page: 1,
                    pageSize: 50,
                },
            },
            element: <WpCancelationRequest />,
        },
        {
            label: 'Declined Workplaces',
            href: {
                pathname: '/portals/admin/cancelled-workplace-requests',
                query: { tab: 'rejected-workplace', page: 1, pageSize: 50 },
            },

            element: <WpRejectionList />,
        },
        {
            label: 'Industry Rejected Workplaces',
            href: {
                pathname: '/portals/admin/cancelled-workplace-requests',
                query: {
                    tab: 'industry-rejected-workplace',
                    page: 1,
                    pageSize: 50,
                },
            },

            element: <WpIndustryRejectedRequest />,
        },
        {
            label: 'Termination Requests',
            href: {
                pathname: '/portals/admin/cancelled-workplace-requests',
                query: {
                    tab: 'termination-requests',
                    page: 1,
                    pageSize: 50,
                },
            },
            element: <WpTerminationRequest />,
        },
    ]
    return (
        <div>
            <TabNavigation tabs={tabs}>
                {({ header, element }: any) => {
                    return (
                        <div>
                            <div>{header}</div>
                            <div className="p-4">{element}</div>
                        </div>
                    )
                }}
            </TabNavigation>
            {/* <WpCancelationRequest /> */}
        </div>
    )
}

CancelledWorkplaceRequests.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default CancelledWorkplaceRequests
