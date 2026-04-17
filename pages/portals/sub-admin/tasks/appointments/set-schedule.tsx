import { ReactElement } from 'react'

import { SubAdminLayout } from '@layouts'
import { NextPageWithLayout, PermissionType } from '@types'

// components
import { withPermission } from '@components'
import { SetScheduleContainer } from '@partials/sub-admin'

const SetSchedule: NextPageWithLayout = () => {
    return <SetScheduleContainer />
}
SetSchedule.getLayout = (page: ReactElement) => {
    return (
        <SubAdminLayout
            pageTitle={{
                title: 'Set Schedule',
                navigateBack: true,
                backTitle: 'Back',
            }}
        >
            {page}
        </SubAdminLayout>
    )
}

export default withPermission(SetSchedule, {
    permissions: [PermissionType.MANAGE_APPOINTMENTS],
})
