import { ReactElement } from 'react'

import { EmptyData, LoadingAnimation, withPermission } from '@components'
import { SubAdminLayout } from '@layouts'
import { WpCancelationRequestSA } from '@partials/common'
import { SubAdminApi } from '@queries'
import { NextPageWithLayout, PermissionType } from '@types'

const CancelledWorkplaceRequests: NextPageWithLayout = () => {
    const profile = SubAdminApi.SubAdmin.useProfile()

    return (
        <div>
            {profile?.isLoading ? (
                <LoadingAnimation />
            ) : profile?.data ? (
                <WpCancelationRequestSA />
            ) : profile?.isSuccess ? (
                <EmptyData />
            ) : null}
        </div>
    )
}

CancelledWorkplaceRequests.getLayout = (page: ReactElement) => {
    return (
        <SubAdminLayout
            pageTitle={{ title: 'Workplace Cancellation Requests' }}
        >
            {page}
        </SubAdminLayout>
    )
}

export default withPermission(CancelledWorkplaceRequests, {
    permissions: [PermissionType.WORKPLACE_CANCELLATION_REQUESTS],
})
