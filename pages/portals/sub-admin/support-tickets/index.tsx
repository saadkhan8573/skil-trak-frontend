import { withPermission } from '@components'
import { SubAdminLayout } from '@layouts'
import { TicketDashboard } from '@partials/common'
import { PermissionType } from '@types'
import { ReactElement } from 'react'

const TicketsPage = () => {
    return <TicketDashboard />
}

TicketsPage.getLayout = (page: ReactElement) => {
    return <SubAdminLayout>{page}</SubAdminLayout>
}

export default withPermission(TicketsPage, {
    permissions: [PermissionType.VIEW_SUPPORT_TICKETS],
})
