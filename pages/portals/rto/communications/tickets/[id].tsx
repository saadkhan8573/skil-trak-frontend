import { ReactElement } from 'react'
// Layouts
import { RtoLayoutV2 } from '@layouts'
// Components
import { TicketDetails } from '@partials/common'
import { NextPageWithLayout } from '@types'
import { BiEnvelope } from 'react-icons/bi'

const TicketDetailPage: NextPageWithLayout = () => {
    return <TicketDetails />
}

TicketDetailPage.getLayout = (page: ReactElement) => {
    return (
        <RtoLayoutV2
            titleProps={{
                Icon: BiEnvelope,
                title: 'Ticket Details',
                description: 'View and reply to this ticket conversation',
            }}
        >
            {page}
        </RtoLayoutV2>
    )
}

export default TicketDetailPage
