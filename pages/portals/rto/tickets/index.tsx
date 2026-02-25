import { ReactElement, useEffect } from 'react'
// Layouts
import { RtoLayout } from '@layouts'
// Types
import { BackButton, Button, TabNavigation, TabProps } from '@components'
import { PageHeading } from '@components/headings'
import { useNavbar } from '@hooks'
import { ClosedTickets, OpenTickets } from '@partials/rto'
import { NextPageWithLayout } from '@types'
import { useRouter } from 'next/router'
import { BsFillTicketDetailedFill } from 'react-icons/bs'

enum TicketType {
    ClosedTickets = 'closed-tickets',
    AllTickets = 'all-tickets',
}

const Tickets: NextPageWithLayout = () => {
    const router = useRouter()
    const { setTitle } = useNavbar()

    useEffect(() => {
        setTitle('Tickets')
    }, [])

    const tabs: TabProps[] = [
        {
            label: 'All Tickets',
            href: {
                pathname: 'tickets',
                query: { tab: TicketType.AllTickets },
            },

            element: <OpenTickets />,
        },
        {
            label: 'Closed Tickets',
            href: {
                pathname: 'tickets',
                query: { tab: TicketType.ClosedTickets },
            },

            element: <ClosedTickets />,
        },
    ]

    return (
        <div className="px-4">
            <TabNavigation tabs={tabs}>
                {({ header, element }: any) => {
                    return (
                        <div>
                            <div>{header}</div>
                            <div className="mt-4 ml-4">
                                <BackButton text={'Go Back'} />
                                <PageHeading
                                    title={'Ticket'}
                                    subtitle={'You can find all Tickets here'}
                                >
                                    <Button
                                        variant={'dark'}
                                        text={'Create a Ticket'}
                                        Icon={BsFillTicketDetailedFill}
                                        onClick={() => {
                                            router.push(
                                                '/portals/rto/tickets/add-ticket'
                                            )
                                        }}
                                    />
                                </PageHeading>
                            </div>
                            <div className="p-4">{element}</div>
                        </div>
                    )
                }}
            </TabNavigation>
        </div>
    )
}

Tickets.getLayout = (page: ReactElement) => {
    return <RtoLayout>{page}</RtoLayout>
}

export default Tickets
