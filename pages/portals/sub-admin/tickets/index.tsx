import { ReactElement, useEffect, useMemo } from 'react'
// Layouts
import { SubAdminLayout } from '@layouts'
// Types
import { BackButton, TabNavigation, TabProps } from '@components'
import { useNavbar } from '@hooks'
import {
    ClosedTickets,
    DepartmentTickets,
    OpenTickets,
} from '@partials/sub-admin/Tickets'
import { NextPageWithLayout } from '@types'
import { useRouter } from 'next/router'
import { SubAdminApi } from '@queries'

enum TicketType {
    ClosedTickets = 'closed-tickets',
    AllTickets = 'all-tickets',
    DepartmentTickets = 'department-tickets',
}

const Tickets: NextPageWithLayout = () => {
    const router = useRouter()
    const { setTitle } = useNavbar()
    useEffect(() => {
        setTitle('Tickets')
    }, [])
    const { data } = SubAdminApi.SubAdmin.useProfile()
    const isHod = data?.departmentMember?.isHod

    const tabs: TabProps[] = useMemo(() => {
        const baseTabs = [
            {
                label: 'Custom My Tickets',
                href: {
                    pathname: 'tickets',
                    query: { tab: TicketType.AllTickets },
                },
                element: <OpenTickets />,
            },
            {
                label: 'Closed Department Tickets',
                href: {
                    pathname: 'tickets',
                    query: { tab: TicketType.ClosedTickets },
                },
                element: <ClosedTickets />,
            },
        ]

        if (isHod) {
            baseTabs.splice(1, 0, {
                label: 'Open Department Tickets',
                href: {
                    pathname: 'tickets',
                    query: { tab: TicketType.DepartmentTickets },
                },
                element: <DepartmentTickets />,
            })
        }

        return baseTabs
    }, [isHod])

    return (
        <div className="px-4">
            <BackButton text={'Go Back'} />
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

Tickets.getLayout = (page: ReactElement) => {
    return <SubAdminLayout>{page}</SubAdminLayout>
}

export default Tickets
