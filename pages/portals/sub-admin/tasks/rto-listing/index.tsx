import { withPermission } from '@components'
import { SubAdminLayout } from '@layouts'
import { RtoListing } from '@partials/sub-admin'
import { NextPageWithLayout, PermissionType } from '@types'
import { ReactElement } from 'react'

type Props = {}
const RtoListingPage: NextPageWithLayout = (props: Props) => {
    return <RtoListing />
}
RtoListingPage.getLayout = (page: ReactElement) => {
    return (
        <SubAdminLayout pageTitle={{ title: 'RTOs Listing' }}>
            {page}
        </SubAdminLayout>
    )
}
export default withPermission(RtoListingPage, {
    permissions: [PermissionType.ALLOW_RTO_LISTING],
})
