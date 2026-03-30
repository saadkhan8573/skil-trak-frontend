import { SubAdminLayout } from '@layouts'
import { TicketDashboard } from '@partials/common'
import { ReactElement } from 'react'

const TicketsPage = () => {
    return <TicketDashboard />
}

TicketsPage.getLayout = (page: ReactElement) => {
    return <SubAdminLayout>{page}</SubAdminLayout>
}

export default TicketsPage
