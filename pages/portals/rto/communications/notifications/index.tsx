import { withPermission } from '@components'
import { RtoLayoutV2 } from '@layouts'
import { NotificationList } from '@partials/common'
import { PermissionType } from '@types'
import { Bell } from 'lucide-react'
import React, { ReactElement } from 'react'

const NotificationsPage = () => {
    return <NotificationList />
}

NotificationsPage.getLayout = (page: ReactElement) => {
    return (
        <RtoLayoutV2
            titleProps={{
                Icon: Bell,
                title: 'Notifications',
                description: 'All Notifications',
            }}
        >
            {page}
        </RtoLayoutV2>
    )
}

export default withPermission(NotificationsPage, {
    permissions: [PermissionType.NOTIFICATIONS],
})
