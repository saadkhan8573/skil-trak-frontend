import { ReactElement } from 'react'
// Layouts
import { RtoLayoutV2 } from '@layouts'
// Components
import { Button, ConfigTabs, TabConfig } from '@components'
import { PageHeading } from '@components/headings'
import { ClosedTickets, OpenTickets } from '@partials/rto'
import { CommonApi } from '@queries'
import { NextPageWithLayout } from '@types'
import { useRouter } from 'next/router'
import { BiEnvelope } from 'react-icons/bi'
import { BsFillTicketDetailedFill } from 'react-icons/bs'

const Tickets: NextPageWithLayout = () => {
    const router = useRouter()
    const { data: ticketCount } = CommonApi.Tickets.useGetTicketCountQuery()

    const tabs: TabConfig[] = [
        {
            label: 'All Tickets',
            value: 'all-tickets',
            count: ticketCount?.openTickets || 0,
            component: () => <OpenTickets layoutV2 />,
        },
        {
            label: 'Closed Tickets',
            value: 'closed-tickets',
            count: ticketCount?.closedTickets || 0,
            component: () => <ClosedTickets layoutV2 />,
        },
    ]

    return (
        <div>
            <div>
                <PageHeading
                    title={'Tickets'}
                    subtitle={'You can find all Tickets here'}
                >
                    <Button
                        variant={'dark'}
                        text={'Create a Ticket'}
                        Icon={BsFillTicketDetailedFill}
                        onClick={() => {
                            router.push(
                                '/portals/rto/communications/tickets/add-ticket'
                            )
                        }}
                    />
                </PageHeading>
            </div>
            <div className="mt-4">
                <ConfigTabs
                    tabs={tabs}
                    defaultValue="all-tickets"
                    value={(router.query.tab as string) || 'all-tickets'}
                    onValueChange={(val) => {
                        router.push(
                            {
                                pathname: router.pathname,
                                query: { ...router.query, tab: val },
                            },
                            undefined,
                            { shallow: true }
                        )
                    }}
                />
            </div>
        </div>
    )
}

Tickets.getLayout = (page: ReactElement) => {
    return (
        <RtoLayoutV2
            titleProps={{
                Icon: BiEnvelope,
                title: 'Tickets',
                description: 'View and manage all your support tickets',
            }}
        >
            {page}
        </RtoLayoutV2>
    )
}

export default Tickets
