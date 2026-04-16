import { withPermission } from '@components'
import { SubAdminLayout } from '@layouts'
import { RtoListingDetail } from '@partials/sub-admin'
import { NextPageWithLayout, PermissionType } from '@types'
import { ReactElement } from 'react'

const RtoListingDetailPage: NextPageWithLayout = () => {
    return <RtoListingDetail />
}
RtoListingDetailPage.getLayout = (page: ReactElement) => {
    return (
        <SubAdminLayout
            pageTitle={{
                title: 'RTO Listing Details',
            }}
        >
            {page}
        </SubAdminLayout>
    )
}
export default withPermission(RtoListingDetailPage, {
    permissions: [PermissionType.ALLOW_RTO_LISTING],
})
