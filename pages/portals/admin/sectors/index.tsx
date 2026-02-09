import { ReactElement } from 'react'

import { TabNavigation, TabProps } from '@components'
import { AdminLayout } from '@layouts'
import {
    Courses,
    SectorDocuments,
    Sectors,
    WorkplaceTypes
} from '@partials/admin/sector'
import { NextPageWithLayout } from '@types'

const SectorList: NextPageWithLayout = () => {
    const tabs: TabProps[] = [
        {
            label: 'Sectors',
            href: {
                pathname: 'sectors',
                query: { tab: 'sectors', page: 1, pageSize: 50 },
            },
            element: <Sectors />,
        },
        {
            label: 'Courses',
            href: {
                pathname: 'sectors',
                query: { tab: 'courses', page: 1, pageSize: 50 },
            },
            element: <Courses />,
        },
        {
            label: 'Workplace Types',
            href: {
                pathname: 'sectors',
                query: { tab: 'wp-types', page: 1, pageSize: 50 },
            },
            element: <WorkplaceTypes />,
        },
        // {
        //     label: 'Sector Documents',
        //     href: {
        //         pathname: 'sectors',
        //         query: { tab: 'sector-documents', page: 1, pageSize: 50 },
        //     },
        //     element: <SectorDocuments />,
        // },
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
        </div>
    )
}

SectorList.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default SectorList
