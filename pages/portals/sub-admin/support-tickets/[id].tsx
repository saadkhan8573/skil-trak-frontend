import { withPermission } from '@components'
import { SubAdminLayout } from '@layouts'
import { TicketDetails } from '@partials/common'
import { PermissionType } from '@types'
import { ReactElement } from 'react'

const TicketDetailPage = () => {
    return <TicketDetails />
}

TicketDetailPage.getLayout = (page: ReactElement) => {
    return <SubAdminLayout>{page}</SubAdminLayout>
}

export default withPermission(TicketDetailPage, {
    permissions: [PermissionType.VIEW_SUPPORT_TICKETS],
})
